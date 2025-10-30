const mongoose = require('mongoose');
const Table = require('../models/Table');

function coerceTableName(value) {
  if (value === undefined || value === null) return 'Table';
  const s = String(value).trim();
  return s ? s : 'Table';
}

const createTable = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload || (Array.isArray(payload) && payload.length === 0)) {
      return res.status(400).json({ error: 'Provide table data' });
    }

    const arr = Array.isArray(payload) ? payload : [payload];

    for (const t of arr) {
      if (typeof t.tableNum === 'undefined') {
        return res.status(400).json({ error: 'tableNum is required' });
      }
      if (typeof t.chairs === 'undefined') {
        return res.status(400).json({ error: 'chairs is required' });
      }

      if (!('tableName' in t) || t.tableName === null || String(t.tableName).trim() === '') {
        t.tableName = 'Table';
      } else {
        t.tableName = String(t.tableName).trim();
      }
    }

    const nums = arr.map(a => a.tableNum);
    const existing = await Table.find({ tableNum: { $in: nums } }).select('tableNum');
    if (existing.length) {
      const taken = existing.map(e => e.tableNum).join(', ');
      return res.status(409).json({ error: `Table(s) already exist with tableNum: ${taken}` });
    }

    const created = await Table.insertMany(arr, { ordered: true });
    return res.status(201).json({ message: 'Table(s) created', tables: created });
  } catch (err) {
    console.error('createTable:', err);
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Duplicate tableNum' });
    }
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

const allTables = async (req, res) => {
  try {
    const {
      q,
      minChairs,
      maxChairs,
      page = 1,
      limit = 50,
      sort = 'tableNum',
      dir = 'asc',
    } = req.query;

    const filter = {};
    if (q) filter.tableName = { $regex: q, $options: 'i' };
    if (typeof minChairs !== 'undefined' || typeof maxChairs !== 'undefined') {
      filter.chairs = {};
      if (typeof minChairs !== 'undefined') filter.chairs.$gte = Number(minChairs);
      if (typeof maxChairs !== 'undefined') filter.chairs.$lte = Number(maxChairs);
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const dirNum = dir === 'desc' ? -1 : 1;

    const [items, total] = await Promise.all([
      Table.find(filter)
        .sort({ [sort]: dirNum, updatedAt: -1 })
        .skip((pageNum - 1) * lim)
        .limit(lim),
      Table.countDocuments(filter),
    ]);

    return res.json({
      total,
      page: pageNum,
      pages: Math.ceil(total / lim),
      items,
    });
  } catch (err) {
    console.error('allTables:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { byNum } = req.query;

    let table;
    if (typeof byNum !== 'undefined') {
      table = await Table.findOne({ tableNum: Number(byNum) })
        .populate('currentOrder', '_id status orderType createdAt');
    } else {
      if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
      table = await Table.findById(id)
        .populate('currentOrder', '_id status orderType createdAt');
    }

    if (!table) return res.status(404).json({ error: 'Table not found' });
    return res.json({ table });
  } catch (err) {
    console.error('getTable:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });

    const body = req.body || {};
    const allowed = ['tableName', 'chairs', 'tableNum'];
    const update = {};
    for (const k of allowed) if (k in body) update[k] = body[k];

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'No updatable fields provided' });
    }

    if ('tableName' in update) {
      update.tableName = coerceTableName(update.tableName);
    }

    const touchingStructure = ('chairs' in update) || ('tableNum' in update);
    const filter = touchingStructure
      ? { _id: id, isOccupied: false, currentOrder: null }
      : { _id: id };

    const updated = await Table.findOneAndUpdate(
      filter,
      update,
      { new: true, runValidators: true }
    );

    if (!updated) {
      const exists = await Table.findById(id).select('isOccupied currentOrder');
      if (!exists) return res.status(404).json({ error: 'Table not found' });
      return res.status(409).json({
        error: 'Cannot change chairs/tableNum while the table is assigned',
        details: { isOccupied: exists.isOccupied, hasCurrentOrder: Boolean(exists.currentOrder) }
      });
    }

    return res.json({ message: 'Table updated', table: updated });
  } catch (err) {
    console.error('updateTable:', err);
    if (err?.code === 11000) return res.status(409).json({ error: 'Duplicate tableNum' });
    if (err?.name === 'ValidationError') return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Server error' });
  }
};


const delTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { byNum } = req.query;

    const notAssignedFilter = { isOccupied: false, currentOrder: null };

    let deleted;
    let deletedNum;

    if (typeof byNum !== 'undefined') {
      const tableNum = Number(byNum);

      deleted = await Table.findOneAndDelete({ tableNum, ...notAssignedFilter });

      if (!deleted) {
        const exists = await Table.findOne({ tableNum }).select('isOccupied currentOrder');
        if (!exists) return res.status(404).json({ error: 'Table not found' });
        return res.status(409).json({
          error: 'Table is currently assigned and cannot be deleted',
          details: { isOccupied: exists.isOccupied, hasCurrentOrder: Boolean(exists.currentOrder) }
        });
      }

      deletedNum = tableNum;
    } else {
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid id' });
      }

      deleted = await Table.findOneAndDelete({ _id: id, ...notAssignedFilter });

      if (!deleted) {
        const exists = await Table.findById(id).select('isOccupied currentOrder');
        if (!exists) return res.status(404).json({ error: 'Table not found' });
        return res.status(409).json({
          error: 'Table is currently assigned and cannot be deleted',
          details: { isOccupied: exists.isOccupied, hasCurrentOrder: Boolean(exists.currentOrder) }
        });
      }

      deletedNum = deleted.tableNum;
    }

    await Table.updateMany(
      { tableNum: { $gt: deletedNum } },
      { $inc: { tableNum: -1 } }
    );

    return res.json({
      message: `Table ${deletedNum} deleted and table numbers adjusted`,
    });
  } catch (err) {
    console.error('delTable:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};



module.exports = { createTable, allTables, delTable, getTable, updateTable };

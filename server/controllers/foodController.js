const mongoose = require("mongoose");
const Food = require("../models/Food");

const createFood = async (req, res) => {
  try {
    let {
      itemImage,
      name,
      description = "",
      price,
      avgPrepTime,
      category,
      stock = true,
      rating = null,
    } = req.body ?? {};

    if (!itemImage || !name || typeof price === "undefined" || typeof avgPrepTime === "undefined" || !category || typeof stock === "undefined") {
      return res.status(400).json({
        error:
          "itemImage, name, price, avgPrepTime, category, and stock are required",
      });
    }

    const food = await Food.create({
      itemImage,
      name,
      description,
      price,
      avgPrepTime,
      category,
      stock,
      rating,
    });

    return res.status(201).json({
      message: "Food item added successfully",
      food,
    });
  } catch (err) {
    console.error("createFood:", err);
    
    if (err?.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

const getFood = async (req, res) => {
  try {
    const {
      category,
      inStock, 
      minPrice,
      maxPrice,
      q, 
      page = 1,
      limit = 20,
      sort = "-createdAt", 
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (typeof inStock !== "undefined") filter.stock = inStock === "true";
    if (typeof minPrice !== "undefined" || typeof maxPrice !== "undefined") {
      filter.price = {};
      if (typeof minPrice !== "undefined") filter.price.$gte = Number(minPrice);
      if (typeof maxPrice !== "undefined") filter.price.$lte = Number(maxPrice);
    }
    if (q) filter.name = { $regex: q, $options: "i" };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const [items, total] = await Promise.all([
      Food.find(filter).sort(sort).skip((pageNum - 1) * lim).limit(lim),
      Food.countDocuments(filter),
    ]);

    return res.json({
      total,
      page: pageNum,
      pages: Math.ceil(total / lim),
      items,
    });
  } catch (err) {
    console.error("getFood:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const updated = await Food.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: "Food not found" });

    return res.json({ message: "Food updated", food: updated });
  } catch (err) {
    console.error("updateFood:", err);
    if (err?.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

const delFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const deleted = await Food.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Food not found" });

    return res.json({ message: "Food deleted" });
  } catch (err) {
    console.error("delFood:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createFood,
  getFood,
  updateFood,
  delFood,
};

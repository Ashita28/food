const express = require('express');
const { createTable, allTables, delTable, getTable, updateTable } = require('../controllers/tableController');

const router = express.Router();

router.post('/tables', createTable);
router.get('/tables', allTables);
router.get('/tables/:id', getTable);      
router.patch('/tables/:id', updateTable); 
router.delete('/tables/:id', delTable);

module.exports = router;

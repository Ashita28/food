const express = require('express');
const { chefsData, updateChefsData, allChefs, getChef } = require('../controllers/chefsController');

const router = express.Router();

router.post('/chefs', chefsData);        
router.patch('/chefs/assign', updateChefsData); 
router.get('/chefs', allChefs);          
router.get('/chefs/:id', getChef);       

module.exports = router;

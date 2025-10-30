const express = require("express");
const { createFood, getFood, updateFood, delFood } = require("../controllers/foodController");

const router = express.Router();

router.post("/foods", createFood);   
router.get("/foods", getFood);       
router.patch("/foods/:id", updateFood); 
router.delete("/foods/:id", delFood);   

module.exports = router;

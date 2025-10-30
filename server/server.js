require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const foodRoutes  = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes  = require('./routes/userRoutes');
const chefsRoutes = require('./routes/chefsRoutes');
const tableRoutes = require('./routes/tableRoutes');
const analyticsRoutes = require("./routes/analyticsRoutes");


const app = express();

const PORT   = process.env.PORT;            
const ADMIN  = process.env.ADMIN  || 'https://food-brown-kappa.vercel.app/';
const CLIENT = process.env.CLIENT

const allowedOrigins = new Set([ADMIN, CLIENT]);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);                
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

app.use(cors(corsOptions));

app.options(/^\/api(?:\/.*)?$/, cors(corsOptions));  

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', foodRoutes);
app.use('/api', orderRoutes);
app.use('/api', chefsRoutes);
app.use('/api', tableRoutes);
app.use("/api", analyticsRoutes);

// Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
      console.log(`Allowed origins: ${[...allowedOrigins].join(', ')}`);
    });
  })
  .catch((err) => console.error('Mongo error:', err));

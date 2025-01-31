require('dotenv').config()
const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const { error } = require('console');
const User=require('./schema')


const app = express();
const port = 3010;

const DB_URL=process.env.URL

app.use(express.static('static'));
const connectDB=async ()=>{
  await mongoose.connect(DB_URL,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("Connected to MongoDB")
  }).catch((error)=>{
    console.log(error)
  })
}
// POST API Endpoint
app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;

    // Validate and save user data
    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res
        .status(400)
        .json({ message: 'Validation error', details: error.message });
    } else {
      res.status(500).json({ message: 'Server error', details: error.message });
    }
  }
});
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});


connectDB().then(()=>{
  app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
})
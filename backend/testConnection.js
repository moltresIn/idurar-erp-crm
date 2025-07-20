// backend/testConnection.js
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Connecting to:', process.env.DATABASE);
    await mongoose.connect(process.env.DATABASE);
    console.log('Connected successfully');
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (err) {
    console.error('Connection error:', err.message);
  }
}

testConnection();

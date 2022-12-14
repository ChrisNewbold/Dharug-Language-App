require('dotenv').config();
const mongoose = require('mongoose');

// Node will look for this environment variable and if it exists, it will use it. Otherwise, it will assume that you are running this application locally
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Export connection 
module.exports = mongoose.connection;

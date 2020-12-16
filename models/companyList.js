const mongoose = require('mongoose');

const companyListSchema = new mongoose.Schema({
  company_name: {
    type: String,
    trim: true,
  },
  cin: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('companyList', companyListSchema);
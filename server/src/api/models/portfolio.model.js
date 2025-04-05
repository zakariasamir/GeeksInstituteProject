const mongoose = require('mongoose');
const portfolioSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  picture: String,
  education: [{ school: String, degree: String, year: Number }],
  experience: [{ company: String, role: String, duration: String }],
  projects: [{ name: String, description: String }],
  skills: [{ type: String }],
});
const Portfolio = mongoose.model('Portfolio', portfolioSchema);
module.exports = Portfolio;
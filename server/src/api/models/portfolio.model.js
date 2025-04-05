const mongoose = require('mongoose');
const portfolioSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  bio: { type: String, required: true },
  picture: String,
  education: [{ school: String, degree: String, year: Number }],
  experience: [{ company: String, role: String, duration: String }],
  projects: [{ name: String, description: String }],
  skills: [{ type: String }],
});
const Portfolio = mongoose.model('Portfolio', portfolioSchema);
module.exports = Portfolio;
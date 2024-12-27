const mongoose = require('mongoose');


const historySchema = new mongoose.Schema({
  
  userId:{type: mongoose.Types.ObjectId, ref: 'User'},
  
  portId: {type: mongoose.Types.ObjectId, ref: 'Device'},
  date_in: { type: String, required: true },
  time_in: { type: String, required: true },
  
});

module.exports = mongoose.model('History', historySchema);

const historySchema = new mongoose.Schema({
    id_port: { type: String, required: true },
    UID: { type: String, required: true, ref: 'User' }, // Tham chiếu đến User qua UID
    time_in: { type: String, required: true },
    time_out: { type: String, required: true },
    status: { type: Boolean, required: true },
  });
  
  module.exports = mongoose.model('History', historySchema);
  
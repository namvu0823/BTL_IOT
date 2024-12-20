const deviceSchema = new mongoose.Schema({
    id_port: { type: String, required: true, unique: true },
    uid: { type: String, required: true, ref: 'User' }, // Tham chiếu đến User qua UID
  });
  
  module.exports = mongoose.model('Device', deviceSchema);
  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  // Name: String,
  // Times: [
  //   {
  //     time: String,
  //     booked: Boolean,
  //   }
  // ], // 11:00, false   
  
  type: { type: String, required: true }, // 'Small meeting room', 'Middle meeting room', etc.
  location: { type: String, required: true }, // 'Main office 44 Cedar Avenue, 3 floor', etc.
  capacity: { type: Number, required: true }, // 4, 8, 12, etc.
  amenities: [{ type: String }], // ['Wi-Fi', 'TV'], ['Wi-Fi', 'Projector'], etc.
  image: { type: String, required: true }, // URL to the image of the room
  times: [
    {
      startTime: { type: String, required: true },
      endTime: { type: String,required: true },
      booked: { type: Boolean, default: false },
      }
      ],
});


module.exports = mongoose.model('rooms', roomSchema);
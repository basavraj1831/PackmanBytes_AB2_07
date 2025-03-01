import mongoose from "mongoose";

const receiverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      bloodGroup: {
        type: String,
        required: true,
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      
}, {timestamps: true});

receiverSchema.index({ location: '2dsphere' });

const Receiver = mongoose.model("Receiver", receiverSchema, "receivers");

export default Receiver; 
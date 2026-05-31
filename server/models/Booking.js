const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  numberOfTickets: {
    type: Number,
    required: [true, 'Number of tickets is required'],
    min: [1, 'Must book at least 1 ticket']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed'
  },
  bookingId: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Unique Booking ID automatically generate karo
bookingSchema.pre('save', function() {
  if (this.isNew) {
    this.bookingId = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
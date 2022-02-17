const mongoose = require('mongoose');

const EconomySchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  userId: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  cash: {
    type: mongoose.SchemaTypes.Number,
    require: true,
    default: 0,
  },
  bank: {
    type: mongoose.SchemaTypes.Number,
    require: true,
    default: 0,
  },
  begTime: {
    type: mongoose.SchemaTypes.Date,
    require: false,
    default: '1990-01-01T00:00:00.000+00:00',
  },
  dailyTime: {
    type: mongoose.SchemaTypes.Date,
    require: false,
    default: '1990-01-01T00:00:00.000+00:00',
  }
});

module.exports = mongoose.model('Economy', EconomySchema);

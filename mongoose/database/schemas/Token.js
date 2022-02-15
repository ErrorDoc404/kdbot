const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  token: {
    type: mongoose.SchemaTypes.String,
    require: true,
    unique: true,
  },
  guildId: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  userId: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  date: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: '1990-01-01T00:00:00.000+00:00',
  }
});

module.exports = mongoose.model('Token', TokenSchema);
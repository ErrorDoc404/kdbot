const mongoose = require('mongoose');

const WelcomeImageSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    require: true,
    unique: true,
  },
  png: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  gif: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  setGif: {
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  }
});

module.exports = mongoose.model('WelcomeImage', WelcomeImageSchema);

const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    require: true,
    unique: false,
  },
  userID: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  xp: {
    type: mongoose.SchemaTypes.Number,
    require: false,
    default: null,
  },
  totalXp: {
    type: mongoose.SchemaTypes.Number,
    require: false,
    default: null,
  },
  level: {
    type: mongoose.SchemaTypes.Number,
    require: false,
    default: null,
  },
  rank: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  rankRole: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  color: {
    type: mongoose.SchemaTypes.String,
    require: false,
  }
});

module.exports = mongoose.model('Level', LevelSchema);

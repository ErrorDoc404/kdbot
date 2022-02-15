const mongoose = require('mongoose');

const ModerationSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    require: true,
    unique: true,
  },
  createChannel: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  deleteChannel: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  updateChannel: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  welcomeChannel: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  welcomeChannelMessage: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  welcomeChannelLog: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  goodbyeChannel: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  memberUpdateChannel: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  reactionChannel: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  editMessageChannel: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  voiceUpdateChannel: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
});

module.exports = mongoose.model('Moderation', ModerationSchema);
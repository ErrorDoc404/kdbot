const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    require: true,
    unique: true,
  },
  channelCreate: {
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  },
  channelDelete: {
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  },
  channelUpdate: {
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  },
  guildMemberAdd: {
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  },
  guildMemberAddRemove: {
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  },
  guildMemberUpdate: {
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  },
  messageReactionAdd: {
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  },
  messageReactionRemove: {
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  },
  messageUpdate: {
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  },
  voiceStateUpdate: {
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  }
});

module.exports = mongoose.model('Module', ModuleSchema);
const mongoose = require('mongoose');

const GuildConfigSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    require: true,
    unique: true,
  },
  prefix: {
    type: mongoose.SchemaTypes.String,
    require: true,
    default: '!',
  },
  modRole: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  defaultRole: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  memberLogChannel: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  premium:{
    type: mongoose.SchemaTypes.Boolean,
    require: true,
    default: false,
  },
  premiumExpiration:{
    type: mongoose.SchemaTypes.String,
    require: false,
    default: '1990-01-01T00:00:00.000+00:00',
  },
});

module.exports = mongoose.model('GuildConfig', GuildConfigSchema);

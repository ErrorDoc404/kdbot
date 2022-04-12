const mongoose = require('mongoose');

const RankRoleSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    require: true,
    unique: false,
  },
  level: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  roleId: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
});

module.exports = mongoose.model('RankRole', RankRoleSchema);

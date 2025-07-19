const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema(
  {
    settingKey: {
      type: String,
      required: true,
      unique: true,
    },
    settingValue: mongoose.Schema.Types.Mixed,
    removed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', SettingSchema);
module.exports = Setting;

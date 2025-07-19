const mongoose = require('mongoose');

// Define the schema
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

// Export the model, but only compile it if it hasn't been compiled yet
module.exports = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

const mongoose = require('mongoose');
const Setting = require('@/models/appModels/Setting'); // Adjust the path to your Setting model

const listBySettingKey = async ({ settingKeyArray = [] }) => {
  try {
    if (settingKeyArray.length === 0) {
      return [];
    }

    const settingsToShow = { $or: settingKeyArray.map((settingKey) => ({ settingKey })) };
    const results = await Setting.find(settingsToShow).where('removed', false);

    return results;
  } catch (error) {
    console.error('Error in listBySettingKey:', error); // Log errors for debugging
    return [];
  }
};

module.exports = listBySettingKey;

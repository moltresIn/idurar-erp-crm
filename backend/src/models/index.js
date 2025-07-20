const { globSync } = require('glob');
const path = require('path');

const loadModels = () => {
  const modelFiles = globSync('./src/models/appModels/**/*.js');
  modelFiles.forEach((file) => {
    try {
      require(path.resolve(file));
    } catch (err) {
      console.error(`Error loading model from ${file}:`, err.message);
    }
  });
};

module.exports = loadModels;

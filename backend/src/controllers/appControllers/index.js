const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { routesList } = require('@/models/utils');
const { globSync } = require('glob');
const path = require('path');
const mongoose = require('mongoose');

const pattern = './src/controllers/appControllers/*/'; // Adjusted pattern
const controllerDirectories = globSync(pattern).map((filePath) => {
  return path.basename(filePath);
});

const appControllers = () => {
  const controllers = {};
  const hasCustomControllers = [];

  // Load custom controllers
  controllerDirectories.forEach((controllerName) => {
    try {
      const customController = require(`@/controllers/appControllers/${controllerName}`);
      if (customController) {
        hasCustomControllers.push(controllerName);
        controllers[controllerName] = customController;
      }
    } catch (err) {
      console.error(`Error loading custom controller ${controllerName}:`, err.message);
      throw new Error(err.message);
    }
  });

  // Debug: Log registered models
  console.log('Registered Mongoose models:', Object.keys(mongoose.models));

  // Generate CRUD controllers for models without custom controllers
  routesList.forEach(({ modelName, controllerName }) => {
    console.log(`Generating controller for model: ${modelName}`);
    if (!hasCustomControllers.includes(controllerName)) {
      if (!mongoose.models[modelName]) {
        console.warn(`Skipping controller for ${modelName}: Model not registered`);
        return;
      }
      controllers[controllerName] = createCRUDController(modelName);
    }
  });

  return controllers;
};

module.exports = appControllers();

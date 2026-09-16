const serverModule = require("../dist/index.cjs");

const { initializeApp, app } = serverModule;

let initializationPromise = null;

module.exports = async function handler(req, res) {
  if (!initializationPromise) {
    initializationPromise = initializeApp();
  }

  await initializationPromise;

  return app(req, res);
};
const { gen_hash } = require('./pkg/qval_wasm.js');


// Export all wasm methods
module.exports = {
  gen_hash,
};
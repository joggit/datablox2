const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'datablox2',
  location: 'europe-southwest1'
};
exports.connectorConfig = connectorConfig;


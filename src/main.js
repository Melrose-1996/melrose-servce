const app = require('./app');
require('./app/database');

const config = require('./app/config');

app.listen(config.APP_PORT, () => {
  console.info(`service run at ${config.APP_PORT}~`);
});

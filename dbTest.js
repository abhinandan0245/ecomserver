const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommerce', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Unable to connect:', error.message);
  }
})();

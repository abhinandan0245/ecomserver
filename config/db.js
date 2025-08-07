// const mongoose = require('mongoose')
// const dotenv = require('dotenv')

// // load enviroment variables 
// dotenv.config();

// const connectDB = async () => {
//     const MONGO_URI = process.env.MONGO_URI;
//     if(!MONGO_URI){
//         console.log('MONGO_URI is Missing!');
//         return;
//     }
//     try{
//    const conn = await mongoose.connect(MONGO_URI);
//    console.log(`MongoDB successfully Connected: ${conn.connection.host}`);
//     }catch(error){
//         console.error('Error connecting to MongoDB:', error?.message);
//         process.exit(1); // Exit process with failure
//     }
// };

// module.exports = connectDB;


// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('ecommerce', 'root', '', {
//   host: '127.0.0.1',
//   dialect: 'mysql',
// });

// module.exports = sequelize;


// const { Sequelize } = require('sequelize');
// const dotenv = require('dotenv');

// dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME || 'ecommerce',
//   process.env.DB_USER || 'root',
//   process.env.DB_PASSWORD || '',
//   {
//     host: process.env.DB_HOST || 'localhost',
//     dialect: 'mysql',
//     logging: false, // Turn off SQL logging
//   }
// );

// sequelize
//   .sync() // or force: true temporarily
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`✅ Server running at http://localhost:${PORT}`);
//       console.log('✅ MySQL DB synced via Sequelize');
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Unable to connect to the database:', err.message);
//   });

// module.exports = sequelize;

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
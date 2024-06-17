module.exports = {
  db: {
    // host: '10.168.4.100',
    host: '192.168.8.152',
    // host: '192.168.20.155',
    port: '5432',
    dialect: 'postgres',
    database: 'leapting_robot',
    user: 'postgres',
    password: 'root',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  },
  r_db: {
    // host: '10.168.4.100',
    host: '192.168.8.152',
    // host: '192.168.20.155',
    port: '5432',
    dialect: 'postgres',
    database: 'robot',
    user: 'postgres',
    password: 'root',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  },
  jwt: {
    secret: 'lepating',
    expiresIn: '48h'
  },
};

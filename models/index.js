import Sequelize from 'sequelize';

const sequelize = new Sequelize('scmgasescimav', 'root', 'mush-2017', {
  host: 'localhost',
  dialect: 'mysql',
});

const db = {
  User: sequelize.import('./user'),
  Gas: sequelize.import('./gas'),
  Rack: sequelize.import('./rack'),
  Order: sequelize.import('./order'),
  GasType: sequelize.import('./gas_type'),
};

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;

export default (sequelize, DataTypes) => {
  // User Model
  const Rack = sequelize.define('Rack', {
    number: {
      type: DataTypes.STRING,
    },
  });

  // User associations
  Rack.associate = (models) => {
    // User can have many gases
    Rack.hasMany(models.Gas, {
      foreignkey: 'rackId',
    });
  };

  return Rack;
};

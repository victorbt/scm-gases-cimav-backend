export default (sequelize, DataTypes) => {
  // Rack Model
  const Rack = sequelize.define('Rack', {
    number: {
      type: DataTypes.STRING,
    },
  });

  // Rack associations
  Rack.associate = (models) => {
    // User can have many gases
    Rack.hasMany(models.Gas, {
      foreignKey: 'rack_id',
    });
  };

  return Rack;
};

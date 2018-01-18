export default (sequelize, DataTypes) => {
  // Gas Model
  const Gas = sequelize.define('Gas', {
    status: {
      type: DataTypes.INTEGER,
    },
  });


  Gas.associate = (models) => {
    // User can have many gases
    Gas.belongsTo(models.GasType, {
      foreignKey: 'gas_type_id',
    });
  };


  return Gas;
};

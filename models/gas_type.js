export default (sequelize, DataTypes) => {
  // Gas Model
  const GasType = sequelize.define('Gas_type', {
    name: {
      type: DataTypes.STRING,
    },
  });

  return GasType;
};

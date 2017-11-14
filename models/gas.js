export default (sequelize, DataTypes) => {
  // Gas Model
  const Gas = sequelize.define('Gas', {
    name: {
      type: DataTypes.STRING,
    },
  });


  return Gas;
};

export default (sequelize, DataTypes) => {
  // User Model
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
    },
  });

  // User associations
  User.associate = (models) => {
    // User can have many gases
    User.hasMany(models.Gas, {
      foreignKey: 'ownerId',
    });
  };

  return User;
};

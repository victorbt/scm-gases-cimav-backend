export default (sequelize, DataTypes) => {
  // User Model
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  });

  // User associations
  User.associate = (models) => {
    // User can have many gases
    User.hasMany(models.Order, {
      foreignKey: 'user_id',
    });
  };

  return User;
};

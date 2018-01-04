export default (sequelize, DataTypes) => {
  // User Model
  const Order = sequelize.define('Order', {
    order_identifier: {
      type: DataTypes.STRING,
    },
  });

  // User associations
  Order.associate = (models) => {
    // User can have many gases
    Order.hasMany(models.Gas, {
      foreignKey: 'order_id',
    });
  };
  return Order;
};

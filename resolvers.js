import Sequelize from 'sequelize';
import _ from 'lodash';

const Op = Sequelize.Op;

import {
  requiresAuth,
} from './permissions';

const sequelize = new Sequelize('scmgasescimav', 'root', 'mush-2017', {
  host: 'localhost',
  dialect: 'mysql',
});

export default {

  Gas: {
    type: ({
        gas_type_id,
      }, args, {
        models,
      }) =>
      models.GasType.findOne({
        where: {
          id: gas_type_id,
        },
      }),
    order: ({
        order_id,
      }, args, {
        models,
      }) =>
      models.Order.findOne({
        where: {
          id: order_id,
        },
      }),
    rack: ({
        rack_id,
      }, args, {
        models,
      }) =>
      models.Rack.findOne({
        where: {
          id: rack_id,
        },
      }),
    user: ({
        order_id,
    }, args, {
      models,
    }) => models.User.findOne({
      include:[{
        model: models.Order,
        where:{ id : order_id}
      }]
    })
  },

  User: {
  },


  Rack: {
  },

  Order: {
    user: ({
        user_id,
      }, args, {
        models,
      }) =>
      models.User.findOne({
        where: {
          id: user_id,
        },
      }),
  },

  Query: {
    //
    allUsers: (parent, args, {
      models,
    }) => models.User.findAll(),
    //
    allOrders: requiresAuth.createResolver((parent, args, {
      models,
      user,
    }) => models.Order.findAll()),

    getUser: (parent, {
      user,
    }, {
      models,
    }) => models.User.findOne({
      where: {
        username: user,
      },
    }),
    //
    allGases: (parent, args, {
      models,
    }) => models.Gas.findAll({}),
    //
    allGasesTypes: (parent, args, {
      models,
    }) => models.GasType.findAll({}),
    //
    getUserGases: (parent, {
      userId,
    },{models,user}) => {
      if(userId==0 ){
        return sequelize.query('SELECT * FROM Gas WHERE order_id in(SELECT id FROM Orders WHERE user_id = :n);', {
          replacements: {
            n: user.id
          },
          type: sequelize.QueryTypes.SELECT,
        })
      }else{
        return sequelize.query('SELECT * FROM Gas WHERE order_id in(SELECT id FROM Orders WHERE user_id = :n);', {
          replacements: {
            n: userId
          },
          type: sequelize.QueryTypes.SELECT,
        })
      }
  },
    //
    getOrderGases: (parent, {
      orderId,
    },{
      models,
    }) => models.Gas.findAll({
      where: {
        order_id: orderId,
      },
    }),
    //
    getUserOrders: (parent, {
      userId,
    }, {
      models,
    }) => models.Order.findAll({
      where: {
        user_id: userId,
      },
    }),
    //
  },

  Mutation: {
    createUser: (parent, args, {
      models,
    }) => models.User.create(args),

    createOrder: (parent, args, {
      models,
    }) => models.Order.create(args),

    updateUser: (parent, {
      username,
      newUsername,
    }, {
      models,
    }) => models.User.update({
      username: newUsername,
    }, {
      where: username,
    }),

    deleteUser: (parent, args, {
      models,
    }) => models.User.destroy({
      where: args,
    }),
    //
    createGas: (parent, args, {
      models,
    }) => models.Gas.create(args),
    //
    updateGasStatus:(parent, { gas_id , status },{
      models
    })=> models.Gas.update({
       status
    }, {
      where:{
        id: gas_id,
      }
    }),
    //
    createGasType: (parent, args, {
      models,
    }) => models.GasType.create(args),
    //
    createRack: (parent, args, {
      models,
    }) => models.Rack.create(args),
  },

};

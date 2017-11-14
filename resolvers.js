export default {


  Gas: {
    owner: ({
        ownerId,
      }, args, {
        models,
      }) =>
      models.User.findOne({
        where: {
          id: ownerId,
        },
      }),
  },

  User: {

  },
  Rack: {

  },

  Query: {

    allUsers: (parent, args, {
      models,
    }) => models.User.findAll(),
    //
    getUser: (parent, {
      username,
    }, {
      models,
    }) => models.User.findOne({
      where: username,
    }),
    //
    allGases: (parent, args, {
      models,
    }) => models.Gas.findAll(),
    //
    getUserGases: (parent, args, {
      models,
    }) => models.Gas.findAll({
      where: args,
    }),
  },

  Mutation: {
    createUser: (parent, args, {
      models,
    }) => models.User.create(args),

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
    createRack: (parent, args, {
      models,
    }) => models.Rack.create(args),
  },

};

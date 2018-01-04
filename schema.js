export default `
type User{
  id: Int!
  username: String!
  email: String!
  createdAt: String!
  updatedAt: String!
}

type Rack{
  id: Int!
  number: String!
}

type Gas{
  id: Int!
  type: GasType!
  order: Order!
  rack: Rack!
}

type GasType{
  id:Int!
  name: String!
}

type Order{
  id:Int!
  order_identifier:String!
  user: User!
}

type Query{
  allUsers: [User!]!
  getUser(user: String!): User!
  getUserGases(userId: Int!): [Gas!]!
  getUserOrders(userId: Int!): [Order!]!
  allGasesTypes:[GasType!]!
  allGases:[Gas!]!
  allOrders:[Order!]!
}

type Mutation{
  createUser(username: String!,email:String!):User
  createOrder(order_identifier: String!,user_id:Int!):Order!
  updateUser(username: String!, newUsername: String!):[Int!]!
  deleteUser(username: String!): Int!
  createGas( gas_type_id:Int!,order_id: Int!,rack_id:Int!): Gas!
  createGasType(name: String!): GasType!
  createRack(number: String!):Rack!
}
`;

export default `
type User{
  id: Int!
  username: String!
  createdAt: String!
  updatedAt: String!
}

type Rack{
  id: Int!
  number: String!
}

type Gas{
  id: Int!
  name: String!
  owner: User!
}

type Query{
  allUsers: [User!]!
  getUser(username: String!): User!
  getUserGases(ownerId: String!): [Gas!]!
  allGases:[Gas!]!
}

type Mutation{
  createUser(username: String!):User
  updateUser(username: String!, newUsername: String!):[Int!]!
  deleteUser(username: String!): Int!
  createGas(ownerId: Int!, name: String!): Gas!
  createRack(number: String!):Rack!
}
`;

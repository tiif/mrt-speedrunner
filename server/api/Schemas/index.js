const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = graphql;
//input user data
const userData = require("../data.json");

//usertype
const UserType = require("./TypeDefs/UserType");

//delete the arg field later, and change function name
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: { 
        id: { type: GraphQLString},
      },
      resolve(parent, args) {
        return userData;
      },
    },
  },
});

//for input data, for our case might not be needed
////debug later, make it work for scalability
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        nextName: { type: GraphQLString },
        door: { type: GraphQLString },
      },
      resolve(parent, args) {
        userData.push({
          id: userData.length + 1,
          firstName: args.firstName,
          lastName: args.lastName,
          door: args.door,
        });
        return args;
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });

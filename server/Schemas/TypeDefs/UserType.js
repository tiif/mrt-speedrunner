const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = graphql;

//it works in the server, but all null, probably because of the structure
////what is the name for
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    name: { type: GraphQLString },
    next: { type: new GraphQLList(nextStationType)},
  }),
});

const nextStationType = new GraphQLObjectType({
  name: "NextStation",
  fields: () => ({
    name: { type: GraphQLString },
    door: { type: GraphQLString },
  }),
});


module.exports = UserType;

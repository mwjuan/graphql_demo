const Koa = require('koa');
const cors = require('koa2-cors');
const { ApolloServer, gql } = require('apollo-server-koa');
const _ = require('lodash');

const users = [];

for (let index = 1; index < 30; index++) {
	users.push({ id: index.toString(), name: "name" + index })
}

const typeDefs = gql`
	type Query {
    hello: String
    users: [user]
		user(id:String!):user
  }
  type user {
    id: String
		name: String
	}
	type Mutation {
		addUser(user: UserInput!): Boolean
		deleteUser(id: String!): Boolean
		updateUser(id: String!, user: UserInput):Boolean
	}
	input UserInput {
		id: String
		name: String
	}
`;

const resolvers = {
	Query: {
		hello: (parent, arg) => {
			return 'hi graphql';
		},
		users: async (parent, arg) => {
			return users;
		},
		user: async (parent, { id }) => {
			return _.find(users, u => u.id === id);
		}
	},
	Mutation: {
		addUser: async (parent, { user }) => {
			users.push(user);
		},
		deleteUser: async (parent, { id }) => {
			_.remove(users, u => u.id === id);
		},
		updateUser: async (parent, { id, user }) => {
			_.each(users, u => {
				if (u.id === id) {
					u.id = user.id;
					u.name = user.name;
				}
			})
		}
	},
};

const app = new Koa();
const apollo = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ ctx }) => ({ ctx })
});
apollo.applyMiddleware({ app });

app.use(cors())
app.listen(9000);
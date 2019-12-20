const Koa = require('koa');
const cors = require('koa2-cors');
const { ApolloServer, gql } = require('apollo-server-koa');
const _ = require('lodash');

const users = [];
const companys = [];

for (let index = 1; index < 30; index++) {
	let c = { id: index.toString(), name: "company" + index };
	companys.push(c);
	users.push({ id: index.toString(), name: "name" + index, company: c.id })
}

const typeDefs = gql`
	type Query {
    hello: String
    users: [User]
		user(id:String!):User
  }
  type User {
    id: String
		name: String
		company:Company
	}
	type Mutation {
		addUser(user: UserInput!): Boolean
		deleteUser(id: String!): Boolean
		updateUser(id: String!, user: UserInput):Boolean
	}
	input UserInput {
		id: String
		name: String
		company: CompanyInput
	}
	type Company{
		id:String
		name:String
	}
	input CompanyInput{
		id:String
		name:String
	}
`;

const resolvers = {
	Query: {
		hello: (parent, arg) => {
			return 'hi graphql';
		},
		users: async (parent, arg) => {
			_.each(users, u => {
				if (u.company && !u.company.id) {
					u.company = _.find(companys, c => c.id === u.company);
				}
			})
			return users;
		},
		user: async (parent, { id }) => {
			return _.find(users, u => u.id === id);
		}
	},
	Mutation: {
		addUser: async (parent, { user }) => {
			if (user.company) {
				companys.push(user.company);
			}
			users.push(user);
		},
		deleteUser: async (parent, { id }) => {
			_.remove(users, u => u.id === id);
		},
		updateUser: async (parent, { id, user }) => {
			if (user.company) {
				companys.push(user.company);
			}
			_.each(users, u => {
				if (u.id === id) {
					u.id = user.id;
					u.name = user.name;
					u.company = user.company;
				}
			})
		},
	},
	Company: async (parent, args, context, info) => {
		return _.find(company, c => c.id === parent.company);
	}
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
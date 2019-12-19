import React from 'react';
import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";
import './App.css';

let users = [], user = {};

function createApolloClient() {
	let result = new ApolloClient({
		uri: `http://localhost:9000/graphql`,
	});
	return result;
}

let apolloClient = createApolloClient();

async function query(query, variables) {
	let result = await apolloClient.query({ query, variables, fetchPolicy: 'no-cache' });
	return result.data;
}

async function getUsers() {
	let data = await query(gql`
     {
			users{
				id
				name
			}
		}
		`);

	users = data.users;
	console.log(users);
}

async function getUser(id) {
	let data = await query(gql`
      {
        user(id:"${id}"){
					id
					name
				}
      }
		`);

	user = data.user;
	console.log(user)
}

async function addUser() {
	await query(gql`
   	 mutation ($u:UserInput!) {
   	   addUser(user: $u)
   	 }`,
		{
			u: { id: 'add', name: 'name' }
		});
	getUsers();
}

async function deleteUser(id) {
	await query(gql`
      mutation ($id: String!) {
        deleteUser(id: $id)
      }`, { id });
	getUsers();
}

async function updateUser(id) {
	await query(gql`
        mutation($id:String!, $user: UserInput!){
          updateUser(id: $id, user: $user)
        }
      `,
		{
			id,
			user: { id, name: 'update' }
		});
	getUsers();
}

function App() {
	return (
		<div className="App">
			<button onClick={() => getUsers()}> getUsers</button>
			<button onClick={() => getUser("5")}> getUser id = 5</button>
			<button onClick={() => addUser()}> addUser id=add name=add</button>
			<button onClick={() => deleteUser("add")}> deleteUser id = add</button>
			<button onClick={() => updateUser("2")}> updateUser id = 2 name= update</button>
		</div>
	);
}

export default App;

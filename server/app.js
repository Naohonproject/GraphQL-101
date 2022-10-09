const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();

// load schema and resolver
const typeDefs = require('./schema/schema');
const resolvers = require('./resolver/resolver');

// load db methods
const mongoDataMethods = require('./data/db');

// connect to mongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://letuanbao:${process.env.MONGODB_PASSWORD}@cluster0.vvrrtvr.mongodb.net/graphql?retryWrites=true&w=majority`
    );
    console.log('connected to mongodb');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ mongoDataMethods })
});
const app = express();

const start = async () => {
  await server.start();
  server.applyMiddleware({ app });
};
connectDB();
start().then(() => {
  app.listen({ port: 4000 }, () => {
    console.log(
      `server is ready at http://localhost:4000${server.graphqlPath}`
    );
  });
});

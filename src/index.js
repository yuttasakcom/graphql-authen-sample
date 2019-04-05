import express from "express";
import { ApolloServer } from "apollo-server-express";
import { importSchema } from "graphql-import";
import resolvers from "./resolvers";
import mongoose from "mongoose";
import auth from "./middleware/auth";

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`Mongodb connected.`))
  .catch(err => console.log("Mongodb error:", err));

const app = express();

app.set("port", process.env.PORT || "4000");

app.use(auth);

const typeDefs = importSchema("src/schema.graphql");

const formatError = err => {
  if (!err.originalError) {
    return err;
  }

  const data = err.originalError.data;
  const message = err.message || "An error occurred.";
  const code = err.originalError.code || 500;
  return { message, status: code, data };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  formatError,
});

server.applyMiddleware({ app });

app.get("/graphiql", (_, res) => res.redirect("/graphql"));

app.listen(app.get("port"), () => {
  console.log(
    `Server is running at http://localhost:${app.get("port")}/graphql`
  );
});

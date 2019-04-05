import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models";

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    hello: (parent, args, { req }) => {
      if (!req.isAuth) {
        const errors = [{ message: "Error something" }];
        const error = new Error("Unauthorized");
        error.data = errors;
        error.code = 401;

        throw error;
      }
      return "Hello, Graphql";
    },
    users: async () => {
      const users = await db.user.find();
      return users;
    },
  },
  Mutation: {
    signup: async (parent, { data }) => {
      const newUser = await new db.user({
        username: data.username,
        password: data.password,
        email: data.email,
      }).save();
      return {
        token: createToken(newUser, process.env.SECRET_KEY, "1hr"),
        user: newUser,
      };
    },
    signin: async (parent, { data }) => {
      const user = await db.user.findOne({ username: data.username });

      if (!user) {
        const errors = [{ message: "Invalid User" }];
        const error = new Error("Unprocessable Entity");
        error.data = errors;
        error.code = 422;

        throw error;
      }
      const isValidPassword = await bcrypt.compare(
        data.password,
        user.password
      );

      if (!isValidPassword) {
        const errors = [{ message: "Invalid User" }];
        const error = new Error("Unprocessable Entity");
        error.data = errors;
        error.code = 422;

        throw error;
      }
      return {
        token: createToken(user, process.env.SECRET_KEY, "1hr"),
        user,
      };
    },
  },
  User: {
    password: () => {
      return null;
    },
  },
};

export default resolvers;

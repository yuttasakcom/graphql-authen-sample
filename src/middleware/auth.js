import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.currentUser = decodedToken;
  req.isAuth = true;
  next();
};

const authMiddleware = (req, res, next) => {
  // Authentication can be added here when user login/JWT is implemented.
  next();
};

export default authMiddleware;
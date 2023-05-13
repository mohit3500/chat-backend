const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(' ')[1];
      let decodedToken = jwt.verify(token, process.env.SecretKey);
      req.user = await User.findById(decodedToken.id).select('-password');
    } else {
      res.status(401).send({ message: 'Unauthorized User' });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: 'Unauthorized User' });
  }
};

module.exports = auth;

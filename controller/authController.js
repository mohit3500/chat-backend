const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const usernameCheck = await User.findOne({ username });
  if (usernameCheck)
    return res.status(409).json({ msg: 'Username already used' });

  const emailCheck = await User.findOne({ email });
  if (emailCheck) return res.status(409).json({ msg: 'Email already used' });

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await User.create({
    email,
    username,
    password: hashedPassword,
  });
  const token = jwt.sign({ id: user._id }, process.env.SecretKey);
  try {
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ msg: 'Incorrect Username or Password' });
  }

  const pwdValid = bcrypt.compareSync(password, user.password);
  if (!pwdValid) {
    return res.status(400).json({ msg: 'Incorrect Username or Password' });
  }

  const token = jwt.sign({ id: user._id }, process.env.SecretKey);
  try {
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const setAvatar = async (req, res) => {
  const userId = req.params.id;
  const avatarImage = req.body.image;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      isAvatarImageSet: true,
      avatarImage,
    },
    { new: true }
  );
  try {
    res
      .status(201)
      .json({ isSet: user.isAvatarImageSet, image: user.avatarImage });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.params.id } }).select([
    'email',
    'username',
    'avatarImage',
    '_id',
  ]);
  try {
    res.status(201).json({ users });
  } catch (error) {
    res.status(400).send(error);
  }
};

const logout = async (req, res) => {
  if (!req.params.id) return res.json({ msg: 'User id is required ' });
  try {
    res.status(201).send();
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { register, login, setAvatar, getAllUsers, logout };

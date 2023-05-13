const { Router } = require('express');
const { register, login, setAvatar, getAllUsers, logout } = require('../controller/authController');
const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/setAvatar/:id').post(setAvatar);
router.route('/getAllUsers/:id').get(getAllUsers);
router.route('/logout/:id').get(logout);

module.exports = router;

const express = require('express');
const jwt = require('jwt-simple');
const User = require('../models/User');
const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'secret';

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.encode({ userId: user._id, username: user.username }, SECRET);
    res.status(201).json({ message: '회원가입 성공', token, user: { id: user._id, username, email } });
  } catch (error) {
    res.status(500).json({ message: '회원가입 중 오류 발생', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: '비밀번호가 틀바르지 않습니다.' });
    }

    const token = jwt.encode({ userId: user._id, username: user.username, isAdmin: user.isAdmin }, SECRET);
    res.json({ message: '로그인 성공', token, user: { id: user._id, username: user.username, cash: user.cash, totalAssets: user.totalAssets } });
  } catch (error) {
    res.status(500).json({ message: '로그인 중 오류 발생', error: error.message });
  }
});

module.exports = router;

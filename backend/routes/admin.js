const express = require('express');
const Stock = require('../models/Stock');
const User = require('../models/User');
const router = express.Router();

const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123';

const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== ADMIN_KEY) {
    return res.status(401).json({ message: '관리자 권한이 없습니다.' });
  }
  next();
};

router.post('/manipulate-stock', adminAuth, async (req, res) => {
  try {
    const { stockId, newPrice } = req.body;
    
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: '주식을 찾을 수 없습니다.' });
    }

    const oldPrice = stock.currentPrice;
    stock.currentPrice = newPrice;
    stock.priceHistory.push({ price: newPrice, timestamp: new Date() });
    await stock.save();

    const { io } = require('../server');
    io.emit('admin-stock-manipulated', { stockId, oldPrice, newPrice, timestamp: new Date() });

    res.json({ message: '주식 가격이 조작되었습니다.', stock });
  } catch (error) {
    res.status(500).json({ message: '주식 조작 중 오류 발생', error: error.message });
  }
});

router.post('/manipulate-user', adminAuth, async (req, res) => {
  try {
    const { userId, newAssets } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const oldAssets = user.totalAssets;
    user.cash = newAssets;
    user.totalAssets = newAssets;
    await user.save();

    const { io } = require('../server');
    io.emit('admin-user-manipulated', { userId, oldAssets, newAssets, timestamp: new Date() });

    res.json({ message: '사용자 자산이 조작되었습니다.', user });
  } catch (error) {
    res.status(500).json({ message: '사용자 조작 중 오류 발생', error: error.message });
  }
});

router.get('/ranking', adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ totalAssets: -1 }).limit(100);
    const ranking = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      totalAssets: user.totalAssets,
      cash: user.cash
    }));
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: '랭킹 조회 중 오류 발생', error: error.message });
  }
});

module.exports = router;

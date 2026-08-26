const express = require('express');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: '주식 조회 중 오류 발생', error: error.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { userId, name, symbol, initialPrice } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    const success = Math.random() > 0.5;
    const resultAmount = success ? initialPrice * 1.5 : -initialPrice;

    const stock = new Stock({ name, symbol, currentPrice: initialPrice });
    await stock.save();

    user.cash += resultAmount;
    user.totalAssets = user.cash;
    await user.save();

    const transaction = new Transaction({
      userId,
      stockId: stock._id,
      type: 'create',
      price: initialPrice,
      success,
      resultAmount,
      status: 'completed'
    });
    await transaction.save();

    res.json({ message: success ? '주식 생성 성공!' : '주식 생성 실패!', stock, success, resultAmount });
  } catch (error) {
    res.status(500).json({ message: '주식 생성 중 오류 발생', error: error.message });
  }
});

router.post('/buy', async (req, res) => {
  try {
    const { userId, stockId, quantity } = req.body;
    
    const user = await User.findById(userId);
    const stock = await Stock.findById(stockId);

    if (!user || !stock) {
      return res.status(404).json({ message: '사용자 또는 주식을 찾을 수 없습니다.' });
    }

    const totalCost = stock.currentPrice * quantity;
    if (user.cash < totalCost) {
      return res.status(400).json({ message: '잔액이 부족합니다.' });
    }

    user.cash -= totalCost;
    user.portfolio.push({ stockId, quantity, buyPrice: stock.currentPrice });
    user.totalAssets = user.cash;
    await user.save();

    const transaction = new Transaction({
      userId,
      stockId,
      type: 'buy',
      quantity,
      price: stock.currentPrice,
      totalAmount: totalCost,
      success: true,
      status: 'completed'
    });
    await transaction.save();

    res.json({ message: '주식 매수 성공', user });
  } catch (error) {
    res.status(500).json({ message: '주식 매수 중 오류 발생', error: error.message });
  }
});

router.post('/sell', async (req, res) => {
  try {
    const { userId, stockId, quantity } = req.body;
    
    const user = await User.findById(userId);
    const stock = await Stock.findById(stockId);

    if (!user || !stock) {
      return res.status(404).json({ message: '사용자 또는 주식을 찾을 수 없습니다.' });
    }

    const portfolio = user.portfolio.find(p => p.stockId.toString() === stockId);
    if (!portfolio || portfolio.quantity < quantity) {
      return res.status(400).json({ message: '보유 주식이 부족합니다.' });
    }

    const sellPrice = stock.currentPrice * quantity;
    const fee = sellPrice * 2;
    const profit = sellPrice - fee;

    user.cash += profit;
    portfolio.quantity -= quantity;
    if (portfolio.quantity === 0) {
      user.portfolio = user.portfolio.filter(p => p.stockId.toString() !== stockId);
    }
    user.totalAssets = user.cash;
    await user.save();

    const transaction = new Transaction({
      userId,
      stockId,
      type: 'sell',
      quantity,
      price: stock.currentPrice,
      totalAmount: sellPrice,
      resultAmount: profit,
      success: true,
      status: 'completed'
    });
    await transaction.save();

    res.json({ message: '주식 매도 성공', profit, user });
  } catch (error) {
    res.status(500).json({ message: '주식 매도 중 오류 발생', error: error.message });
  }
});

module.exports = router;

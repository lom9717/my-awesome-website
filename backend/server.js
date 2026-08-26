const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 미들웨어
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.log('MongoDB 연결 실패', err));

// 라우트
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/admin', adminRoutes);

// WebSocket 연결
io.on('connection', (socket) => {
  console.log('사용자 연결:', socket.id);

  // 실시간 랭킹 업데이트
  socket.on('get-ranking', async () => {
    const ranking = require('./controllers/rankingController');
    const data = await ranking.getRanking();
    socket.emit('ranking-update', data);
  });

  // 실시간 주식 가격 업데이트
  socket.on('get-stocks', async () => {
    const stocks = require('./controllers/stockController');
    const data = await stocks.getAllStocks();
    socket.emit('stocks-update', data);
  });

  socket.on('disconnect', () => {
    console.log('사용자 연결 해제:', socket.id);
  });
});

// 관리자: 주식 가격 조작
const manipulateStockPrice = (stockId, newPrice) => {
  io.emit('admin-stock-update', { stockId, newPrice });
};

// 관리자: 랭킹 조작
const manipulateRanking = (userId, newAssets) => {
  io.emit('admin-ranking-update', { userId, newAssets });
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = { io, manipulateStockPrice, manipulateRanking };

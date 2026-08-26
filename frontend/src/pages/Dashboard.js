import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [stocks, setStocks] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('stocks-update', (data) => {
      setStocks(data);
    });

    newSocket.on('ranking-update', (data) => {
      setRanking(data);
    });

    fetchStocks();
    fetchRanking();

    return () => newSocket.close();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stocks/all');
      setStocks(response.data);
    } catch (error) {
      console.error('주식 조회 실패:', error);
    }
  };

  const fetchRanking = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/ranking', {
        headers: { 'x-admin-key': 'admin123' }
      });
      setRanking(response.data);
    } catch (error) {
      console.error('랭킹 조회 실패:', error);
    }
  };

  const handleBuyStock = async () => {
    if (!selectedStock) return;
    try {
      await axios.post('http://localhost:5000/api/stocks/buy', {
        userId: user.id,
        stockId: selectedStock._id,
        quantity: parseInt(quantity)
      });
      setQuantity(1);
      setSelectedStock(null);
      fetchStocks();
    } catch (error) {
      alert(error.response?.data?.message || '매수 실패');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>주식.io</h1>
        <div className="user-info">
          <span>{user?.username}</span>
          <span>💰 {user?.totalAssets?.toLocaleString()} 원</span>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      </header>

      <div className="container">
        <div className="main-content">
          <section className="stocks-section">
            <h2>📈 주식 시장</h2>
            <div className="stocks-grid">
              {stocks.map((stock) => (
                <div key={stock._id} className="stock-card">
                  <h3>{stock.name}</h3>
                  <p className="symbol">{stock.symbol}</p>
                  <p className="price">💵 {stock.currentPrice?.toLocaleString()} 원</p>
                  <button onClick={() => setSelectedStock(stock)}>매수</button>
                </div>
              ))}
            </div>
          </section>

          {selectedStock && (
            <div className="modal">
              <div className="modal-content">
                <h3>{selectedStock.name} 매수</h3>
                <p>현재 가격: {selectedStock.currentPrice?.toLocaleString()} 원</p>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <p>총액: {(selectedStock.currentPrice * quantity)?.toLocaleString()} 원</p>
                <button onClick={handleBuyStock}>매수하기</button>
                <button onClick={() => setSelectedStock(null)} className="cancel-btn">
                  취소
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="ranking-section">
          <h2>🏆 실시간 랭킹</h2>
          <div className="ranking-list">
            {ranking.map((player, index) => (
              <div key={index} className="ranking-item">
                <span className="rank">#{player.rank}</span>
                <span className="name">{player.username}</span>
                <span className="assets">{player.totalAssets?.toLocaleString()} 원</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;

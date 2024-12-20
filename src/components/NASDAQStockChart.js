import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { Spin, Button, Modal, Select, Tooltip, Dropdown, Menu } from 'antd';
import styled, { keyframes } from 'styled-components';
import { FaArrowUp, FaArrowDown, FaClock, FaTimes, FaToolbox, FaCar, FaChartArea, FaLine, FaCogs, FaGlobe } from 'react-icons/fa';
import { RiAppleFill, RiMicrosoftFill, RiAmazonFill, RiGoogleFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import {useAuth} from "../context/AuthContext";

const { Option } = Select;

const stocks = [
  { symbol: 'AAPL', name: 'Apple', icon: <RiAppleFill /> },
  { symbol: 'MSFT', name: 'Microsoft', icon: <RiMicrosoftFill /> },
  { symbol: 'AMZN', name: 'Amazon', icon: <RiAmazonFill /> },
  { symbol: 'GOOGL', name: 'Alphabet', icon: <RiGoogleFill /> },
  { symbol: 'TSLA', name: 'Tesla', icon: <FaCar /> },
  { symbol: '^IXIC', name: 'NASDAQ Composite', icon: <FaGlobe /> }, // NASDAQ index
  { symbol: 'NQ=F', name: 'NASDAQ', icon: <FaGlobe /> }, // NASDAQ index
];

const intervals = [
  { label: '1 Minute', value: '1m' },
  { label: '2 Minutes', value: '2m' },
  { label: '5 Minutes', value: '5m' },
  { label: '15 Minutes', value: '15m' },
  { label: '30 Minutes', value: '30m' },
  { label: '1 Hour', value: '1h' },
  { label: 'Daily', value: '1d' },
  { label: 'Weekly', value: '1wk' },
  { label: 'Monthly', value: '1mo' },
];

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// const fadeIn = keyframes`
//     from { opacity: 0; transform: translateY(-10px); }
//     to { opacity: 1; transform: translateY(0); }
// `;

const Card = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
    overflow: hidden;
`;

const CardHeader = styled.div`
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
`;

const Title = styled.h1`
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin: 0;
`;

const Subtitle = styled.p`
    color: #666;
    margin: 0.5rem 0 0 0;
`;

const TableContainer = styled.div`
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableHeader = styled.th`
    padding: 1rem;
    text-align: ${props => props.align || 'left'};
    background: #f8f9fa;
    cursor: pointer;
    user-select: none;
    color: #555;
    font-weight: 600;
    transition: background-color 0.2s;

    &:hover {
        background: #edf2f7;
    }
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #eee;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: #f8f9fa;
    }
`;

const TableCell = styled.td`
    padding: 1rem;
    text-align: ${props => props.align || 'left'};
    color: #333;
`;

const StatusBadge = styled.span`
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    background: ${props => {
  switch (props.status) {
    case 'COMPLETED': return '#10B981';
    case 'PENDING': return '#F59E0B';
    case 'FAILED': return '#EF4444';
    case 'CANCELLED': return '#6B7280';
    default: return '#6B7280';
  }
}};
`;

const HeaderCell = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: ${props => props.align === 'right' ? 'flex-end' : 'flex-start'};
`;

const ActionButton = styled.button`
    background-color: #3B82F6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #2563EB;
    }

    &:disabled {
        background-color: #9CA3AF;
        cursor: not-allowed;
    }
`;

// const MainContainer = styled.div`
//     min-height: 100vh;
//     width: 100%;
//     display: flex;
//     margin-top: 70px;
//     flex-direction: column;
//     padding: 2rem;
//     background: linear-gradient(135deg, #e1f5fe 0%, #ffebee 100%);
//     animation: ${fadeIn} 1s ease-in-out;
// `;


const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
  padding: 20px;
  max-width: 100%;
  background: linear-gradient(135deg, #e1f5fe 0%, #ffebee 100%);
  animation: ${fadeIn} 1s ease-in-out;
  overflow-x: hidden;
`;

const StockSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  background: rgba(255, 255, 255, 0.6);
  padding: 25px 40px;
  border-radius: 20px;
  margin-bottom: 30px;
  width: 100%;
  max-width: 1200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.8s ease-in-out;
`;

const StockIcon = styled.div`
  font-size: 55px;
  margin-right: 30px;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: scale(1.2);
    color: #ff6f61;
  }
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eef2f7;
  border-radius: 15px;
  padding: 15px 30px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
`;

const PriceText = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

const ArrowIcon = styled.div`
  font-size: 28px;
  color: ${({ isUp }) => (isUp ? '#28a745' : '#dc3545')};
  margin-left: 15px;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: ${({ isComparing }) => (isComparing ? 'row' : 'column')};
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
  animation: ${fadeIn} 1s ease-in-out;
`;

const ChartSection = styled.div`
  width: ${({ isComparing }) => (isComparing ? '50%' : '100%')};
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 25px;
  height: 63vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: width 0.5s ease;
`;

const CompareSection = styled.div`
  width: 50%;
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 25px;
  height: 63vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: 20px;
`;

const CancelComparisonIcon = styled(FaTimes)`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 20px;
  cursor: pointer;
  color: #dc3545;
`;

const AdvancedToolsButton = styled(Button)`
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border-radius: 10px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const AdvancedToolsMenu = styled(Menu)`
  background: #f1f2f6;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TradingButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
`;

const TradeButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const BuyButton = styled(TradeButton)`
  background-color: #28a745;
  color: white;
  
  &:hover {
    background-color: #218838;
  }
`;

const SellButton = styled(TradeButton)`
  background-color: #dc3545;
  color: white;
  
  &:hover {
    background-color: #c82333;
  }
`;

const OrderModal = styled(Modal)`
  .modal-content {
    padding: 20px;
    border-radius: 10px;
  }
`;

// Utility function to calculate Simple Moving Average (SMA)
const calculateSMA = (data, windowSize) => {
  let sma = [];
  for (let i = windowSize - 1; i < data.length; i++) {
    const sum = data.slice(i + 1 - windowSize, i + 1).reduce((acc, val) => acc + val.y[3], 0);
    sma.push({ x: data[i].x, y: sum / windowSize });
  }
  return sma;
};

// Utility function to calculate Bollinger Bands
const calculateBollingerBands = (data, windowSize, numStdDev) => {
  const sma = calculateSMA(data, windowSize);
  let bands = {
    upper: [],
    lower: [],
  };

  for (let i = windowSize - 1; i < data.length; i++) {
    const mean = sma[i - windowSize + 1].y;
    const squaredDiffs = data.slice(i + 1 - windowSize, i + 1).map(val => Math.pow(val.y[3] - mean, 2));
    const stdDev = Math.sqrt(squaredDiffs.reduce((acc, val) => acc + val, 0) / windowSize);

    bands.upper.push({ x: data[i].x, y: mean + numStdDev * stdDev });
    bands.lower.push({ x: data[i].x, y: mean - numStdDev * stdDev });
  }

  return { sma, upperBand: bands.upper, lowerBand: bands.lower };
};

const NASDAQStockChart = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [compareData, setCompareData] = useState([]);
  const [smaData, setSmaData] = useState([]);
  const [bollingerBands, setBollingerBands] = useState({ upperBand: [], lowerBand: [] });
  const [standardNormalDeviationData, setStandardNormalDeviationData] = useState([]);
  const [zScoreData, setZScoreData] = useState({ zScorePositive: [], zScoreNegative: [] });
  const [zScoreProbability, setZScoreProbability] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState('^IXIC');
  const [selectedInterval, setSelectedInterval] = useState('1m');
  const [compareStock, setCompareStock] = useState('');
  const [isIntervalModalVisible, setIsIntervalModalVisible] = useState(false);
  const [isStockModalVisible, setIsStockModalVisible] = useState(false);
  const [selectedIndicators, setSelectedIndicators] = useState([]); // Track selected indicators

  const [settlementPrice, setSettlementPrice] = useState(null);
  const [sigma, setSigma] = useState(null);

  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [orderType, setOrderType] = useState(null);
  const [orderAmount, setOrderAmount] = useState('');

  const [tradeOrders, setTradeOrders] = useState([]);
  const [isTradeOrdersLoading, setIsTradeOrdersLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState('type');
  const [sortDirection, setSortDirection] = useState('asc');
  const { user } = useAuth();

  const fetchTradeOrders = async () => {
    if (!user) return;

    setIsTradeOrdersLoading(true);
    try {
      const response = await fetch(
          `http://localhost:8083/api/v1/orders/user/${user.username}/symbol/${selectedStock}?currentPrice=${currentPrice}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch trade orders');
      }

      const data = await response.json();
      setTradeOrders(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsTradeOrdersLoading(false);
    }
  };


  useEffect(() => {
    if (user && currentPrice) {
      fetchTradeOrders();
    }
  }, [user,currentPrice]); // This will run once when user becomes available

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const closeTradeOrder = async (orderId) => {
    try {
      const response = await fetch(
          `http://localhost:8083/api/v1/orders/${orderId}/close?currentPrice=${currentPrice}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );

      if (!response.ok) {
        throw new Error('Failed to close trade order');
      }

      const updatedOrder = await response.json();
      toast.success('Trade order closed successfully');
      fetchTradeOrders(); // Refresh the trade orders list
    } catch (error) {
      toast.error(error.message);
    }
  };


  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }

    // Implement sorting logic here if needed
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };


  const showIntervalModal = () => setIsIntervalModalVisible(true);
  const hideIntervalModal = () => setIsIntervalModalVisible(false);

  const showStockModal = () => setIsStockModalVisible(true);
  const hideStockModal = () => setIsStockModalVisible(false);

  const showOrderModal = (type) => {
    setOrderType(type);
    setIsOrderModalVisible(true);
  };

  const hideOrderModal = () => {
    setIsOrderModalVisible(false);
    setOrderAmount('');
  };

  const placeOrder = async () => {
    try {
      // Assuming you have the user ID stored in your app state or localStorage
      const userId = localStorage.getItem('userId');
      console.log("orderType  " , orderType)
      const response = await fetch('http://localhost:8083/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Username': user.username, // Pass the username in the headers
        },
        body: JSON.stringify({
          symbol: selectedStock,
          orderType: orderType,
          lotsSize: parseFloat(orderAmount),
          price: currentPrice,
        }),
      });


      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      toast.success(`${orderType} order placed successfully!`);
      hideOrderModal();
      fetchTradeOrders(); // This line refreshes the orders table
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  const fetchCurrentPrice = useCallback(async (symbol) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v8/finance/chart/${symbol}`, {
        params: {
          interval: '1d',
          range: '1d',
        },
      });

      const result = response.data.chart.result[0];
      const price = result.meta.regularMarketPrice;
      setPreviousPrice(currentPrice);
      setCurrentPrice(price);

      // Extract high, low, and close prices for settlement price and sigma calculation
      const highPrice = result.indicators.quote[0].high[0];
      const lowPrice = result.indicators.quote[0].low[0];
      const closePrice = result.indicators.quote[0].close[0];

      // Settlement price: using the closing price for the day
      const settlementPrice = closePrice;

      // Sigma: calculating an approximation of price volatility
      const sigma = (highPrice - lowPrice) / 2; // Simplified measure of volatility

      setSettlementPrice(settlementPrice); // You'd need to define this state
      setSigma(sigma); // You'd need to define this state
    } catch (error) {
      console.error('Error fetching current price:', error.message);
      setCurrentPrice(null);
    }
    setLoading(false);
  }, [currentPrice]);

  const fetchHistoricalData = useCallback(async (symbol, interval, isCompare = false) => {
    setLoading(true);
    try {
      const validRange = interval === '1m' || interval === '2m' || interval === '5m' || interval === '15m' ? '1d' : '1mo';
      const response = await axios.get(`/api/v8/finance/chart/${symbol}`, {
        params: {
          interval,
          range: validRange,
        },
      });

      const { timestamp, indicators } = response.data.chart.result[0];
      const prices = indicators.quote[0];
      const formattedData = timestamp.map((time, index) => ({
        x: new Date(time * 1000),
        y: [prices.open[index], prices.high[index], prices.low[index], prices.close[index]],
      }));

      if (isCompare) {
        setCompareData(formattedData);
      } else {
        setHistoricalData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error.message);
    }
    setLoading(false);
  }, []);

  // Utility function to calculate Standard Normal Deviation
  const calculateStandardNormalDeviation = (data, volatility, expiration) => {
    return data.map(point => {
      const sigma = point.y[3] * (volatility / 100) * expiration;
      return {
        x: point.x,
        y: [
          point.y[3] + 0.5 * sigma,
          point.y[3] + sigma,
          point.y[3] + 2 * sigma,
          point.y[3] + 3 * sigma,
          point.y[3] - sigma,
          point.y[3] - 2 * sigma,
          point.y[3] - 3 * sigma,
        ],
      };
    });
  };

  // Custom function to calculate Z-Score based on historical data
  const calculateZScore = (historicalData) => {
    if (!historicalData || historicalData.length === 0) return null;

    const lastClose = historicalData[historicalData.length - 1].y[3];
    const mean = historicalData.reduce((acc, curr) => acc + curr.y[3], 0) / historicalData.length;
    const stdDev = Math.sqrt(historicalData.reduce((acc, curr) => acc + Math.pow(curr.y[3] - mean, 2), 0) / historicalData.length);

    const zScore = (lastClose - mean) / stdDev;

    return {
      positive: mean + zScore * stdDev,
      negative: mean - zScore * stdDev,
      zScore,
    };
  };

  const addIndicator = (indicatorType, params = {}) => {
    if (selectedIndicators.includes(indicatorType)) return;

    setSelectedIndicators((prev) => [...prev, indicatorType]);

    switch (indicatorType) {
      case 'SMA':
        setSmaData(calculateSMA(historicalData, params.windowSize));
        break;
      case 'BollingerBands':
        const bands = calculateBollingerBands(historicalData, params.windowSize, params.numStdDev);
        setSmaData(bands.sma);
        setBollingerBands({ upperBand: bands.upperBand, lowerBand: bands.lowerBand });
        break;
      case 'StandardNormalDeviation':
        const stdNormalDevData = calculateStandardNormalDeviation(historicalData, params.volatility, params.expiration);
        setStandardNormalDeviationData(stdNormalDevData);
        break;
      case 'ZScore':
        const zScoreResult = calculateZScore(historicalData);

        if (zScoreResult) {
          const zScorePositiveData = historicalData.map(data => ({ x: data.x, y: zScoreResult.positive }));
          const zScoreNegativeData = historicalData.map(data => ({ x: data.x, y: zScoreResult.negative }));

          setZScoreData({
            zScorePositive: zScorePositiveData,
            zScoreNegative: zScoreNegativeData,
          });

          setZScoreProbability({
            positive: zScoreResult.zScore > 0 ? 100 - zScoreResult.zScore * 50 : zScoreResult.zScore * 50,
            negative: zScoreResult.zScore < 0 ? 100 + zScoreResult.zScore * 50 : -zScoreResult.zScore * 50,
          });
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    fetchCurrentPrice(selectedStock);
    fetchHistoricalData(selectedStock, selectedInterval);
  }, [selectedStock, selectedInterval, fetchCurrentPrice, fetchHistoricalData]);

  const chartOptions = {
    chart: {
      type: 'candlestick',
      height: '100%',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    plotOptions: {
      candlestick: {
        wick: {
          useFillColor: true,
        },
      },
    },
    options: {
      scales: {
        x: {
          type: 'linear', // Assuming a linear scale
          position: 'bottom'
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        afterDraw: (chart) => {
          const { ctx, chartArea: { top, bottom, left, right } } = chart;
          ctx.save();
          ctx.fillStyle = '#00E396';
          ctx.font = 'bold 12px sans-serif';

          // Draw a simple text label at the top
          ctx.fillText('Custom Label', left + 0, top + 18200);
          ctx.restore();
        }
      }
    },
    annotations: {
      yaxis: [
        {
          y: currentPrice,
          borderColor: '#ff5733',
          label: {
            borderColor: '#ff5733',
            style: {
              color: '#fff',
              background: '#ff5733',
            },
            text: `Current Price: $${currentPrice}`,
          },
        },
        {
          y: settlementPrice,
          borderColor: '#0000FF',
          label: {
            text: `Settlement Price: $${currentPrice}`,
            style: {
              color: '#fff',
              background: '#0000FF',
            },
          },
        },
        {
          y: settlementPrice + (3.4 * sigma),
          borderColor: '#00E396',
          label: {
            text: '+3.4σ',
            style: {
              color: '#fff',
              background: '#00E396',
            },
          },
        },
        {
          y: settlementPrice + (1.5 * sigma),
          borderColor: '#00E396',
          label: {
            text: '+1.5σ',
            style: {
              color: '#fff',
              background: '#00E396',
            },
          },
        },
        {
          y: settlementPrice + (1.0*sigma),
          borderColor: '#00E396',
          label: {
            text: '+1.0σ',
            style: {
              color: '#fff',
              background: '#00E396',
            },
          },
        },
        {
          y: settlementPrice +(0.7 * sigma),
          borderColor: '#00E396',
          label: {
            text: '+0.7σ',
            style: {
              color: '#fff',
              background: '#00E396',
            },
          },
        },
        {
          y: settlementPrice +(0.5*sigma),
          borderColor: '#00E396',
          label: {
            text: '+0.5σ',
            style: {
              color: '#fff',
              background: '#00E396',
            },
          },
          position: 'back',
        },
        {
          y: settlementPrice -(0.5 * sigma),
          borderColor: '#FF0000',
          label: {
            text: '-0.5σ',
            style: {
              color: '#fff',
              background: '#FF0000',
            },
          },
        },
        {
          y: settlementPrice -(0.7*sigma),
          borderColor: '#FF0000',
          label: {
            text: '-0.7σ',
            style: {
              color: '#fff',
              background: '#FF0000',
            },
          },
        },
        {
          y: settlementPrice - (1.0*sigma),
          borderColor: '#FF0000',
          label: {
            text: '-1.0σ',
            style: {
              color: '#fff',
              background: '#FF0000',
            },
          },
        },
        {
          y: settlementPrice - (1.5*sigma),
          borderColor: '#FF0000',
          label: {
            text: '-1.5σ',
            style: {
              color: '#fff',
              background: '#FF0000',
            },
          },
        },
        {
          y: settlementPrice - (3.4*sigma),
          borderColor: '#FF0000',
          label: {
            text: '-3.4σ',
            style: {
              color: '#fff',
              background: '#FF0000',
            },
          },
        },

        ...(zScoreProbability ? [
          {
            y: zScoreData.zScorePositive[0]?.y,
            borderColor: '#1a8cff',
            label: {
              borderColor: '#1a8cff',
              style: {
                color: '#fff',
                background: '#1a8cff',
              },
              text: `Z-Score Positive: ${zScoreProbability.positive.toFixed(2)}%`,
            },
          },
          {
            y: zScoreData.zScoreNegative[0]?.y,
            borderColor: '#ff1a1a',
            label: {
              borderColor: '#ff1a1a',
              style: {
                color: '#fff',
                background: '#ff1a1a',
              },
              text: `Z-Score Negative: ${zScoreProbability.negative.toFixed(2)}%`,
            },
          },
        ] : []),
      ],
    },
  };

  const stockSeries = [
    { name: 'Candlestick', data: historicalData },
    ...(selectedStock === '^IXIC'
        ? [
          { name: 'Standard Normal Deviation', data: standardNormalDeviationData, type: 'line', color: '#e2b93d', dashStyle: 'dash', fillOpacity: 0.1 },
          { name: 'Z-Score Positive', data: zScoreData.zScorePositive, type: 'line', color: '#1a8cff' },
          { name: 'Z-Score Negative', data: zScoreData.zScoreNegative, type: 'line', color: '#ff1a1a' },
        ]
        : [
          { name: 'SMA', data: smaData, type: 'line' },
          { name: 'Upper Band', data: bollingerBands.upperBand, type: 'line' },
          { name: 'Lower Band', data: bollingerBands.lowerBand, type: 'line' },
        ]),
  ];

  const compareSeries = [
    { name: `Comparison: ${compareStock}`, data: compareData, type: 'candlestick' },
    ...(compareStock === '^IXIC'
        ? [
          { name: 'Standard Normal Deviation', data: standardNormalDeviationData, type: 'line', color: '#e2b93d', dashStyle: 'dash', fillOpacity: 0.1 },
          { name: 'Z-Score Positive', data: zScoreData.zScorePositive, type: 'line', color: '#1a8cff' },
          { name: 'Z-Score Negative', data: zScoreData.zScoreNegative, type: 'line', color: '#ff1a1a' },
        ]
        : [
          { name: 'SMA', data: smaData, type: 'line' },
          { name: 'Upper Band', data: bollingerBands.upperBand, type: 'line' },
          { name: 'Lower Band', data: bollingerBands.lowerBand, type: 'line' },
        ]),
  ];

  const advancedToolsMenu = (
      <AdvancedToolsMenu>
        <Menu.Item
            key="1"
            icon={<FaChartArea />}
            onClick={() => addIndicator('SMA', { windowSize: 20 })}
        >
          Add 20-Day SMA
        </Menu.Item>
        <Menu.Item
            key="2"
            icon={<FaLine />}
            onClick={() => addIndicator('BollingerBands', { windowSize: 20, numStdDev: 2 })}
        >
          Add Bollinger Bands
        </Menu.Item>
        {selectedStock === '^IXIC' && (
            <>
              <Menu.Item
                  key="3"
                  icon={<FaCogs />}
                  onClick={() => addIndicator('StandardNormalDeviation', { volatility: 15, expiration: 0.063 })}
              >
                Add Standard Normal Deviation
              </Menu.Item>
              <Menu.Item
                  key="4"
                  icon={<FaLine />}
                  onClick={() => addIndicator('ZScore')}
              >
                Add Z-Score (Prob: {zScoreProbability ? `${zScoreProbability.positive.toFixed(2)}%` : 'Calculating...'})
              </Menu.Item>
            </>
        )}
      </AdvancedToolsMenu>
  );

  return (
      <MainContainer>
        <StockSection>
          <StockIcon onClick={showStockModal}>
            {stocks.find((stock) => stock.symbol === selectedStock)?.icon}
          </StockIcon>
          <PriceSection>
            <PriceText>
              {currentPrice !== null ? `$${currentPrice}` : <Spin />}
            </PriceText>
            {previousPrice && currentPrice > previousPrice ? (
                <ArrowIcon isUp><FaArrowUp /></ArrowIcon>
            ) : (
                <ArrowIcon isUp={false}><FaArrowDown /></ArrowIcon>
            )}
          </PriceSection>
          <Tooltip title="Select Interval">
            <Button onClick={showIntervalModal}>
              <FaClock />
            </Button>
          </Tooltip>
        </StockSection>

        <ChartContainer isComparing={!!compareStock}>
          <ChartSection isComparing={!!compareStock}>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Chart
                    options={chartOptions}
                    series={stockSeries}
                    type="candlestick"
                    height="100%"
                />
            )}
          </ChartSection>
          {compareStock && (
              <CompareSection>
                <CancelComparisonIcon onClick={() => setCompareStock('')} />
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Chart
                        options={chartOptions}
                        series={compareSeries}
                        type="candlestick"
                        height="100%"
                    />
                )}
              </CompareSection>
          )}
        </ChartContainer>

        <Dropdown overlay={advancedToolsMenu} placement="bottomCenter">
          <AdvancedToolsButton icon={<FaToolbox />}>
            Advanced Tools
          </AdvancedToolsButton>
        </Dropdown>

        <Modal
            title="Select Interval"
            open={isIntervalModalVisible}
            onCancel={hideIntervalModal}
            footer={null}
            centered
            destroyOnClose
        >
          <div>
            {intervals.map((interval) => (
                <Button
                    key={interval.value}
                    onClick={() => {
                      setSelectedInterval(interval.value);
                      // Fetch data for the primary stock
                      fetchHistoricalData(selectedStock, interval.value); // Pass the selectedStock and interval
                      // Fetch data for the comparison stock if one is selected
                      if (compareStock) {
                        fetchHistoricalData(compareStock, interval.value, true); // Pass the compareStock and interval
                      }
                      hideIntervalModal();
                    }}
                    style={{ width: '100%', marginBottom: '10px' }}
                >
                  {interval.label}
                </Button>
            ))}
          </div>
        </Modal>

        <Modal
            title="Select Stock"
            open={isStockModalVisible}
            onCancel={hideStockModal}
            footer={null}
            centered
            destroyOnClose
        >
          <div style={{ marginTop: '20px' }}>
            {stocks.map((stock) => (
                <Button
                    key={stock.symbol}
                    onClick={() => {
                      setSelectedStock(stock.symbol);
                      fetchCurrentPrice(stock.symbol);
                      fetchHistoricalData(stock.symbol, selectedInterval);
                      hideStockModal();
                    }}
                    style={{ marginBottom: '10px', width: '100%' }}
                >
                  {stock.name}
                </Button>
            ))}
          </div>
        </Modal>

        <Select
            placeholder="Compare with another stock"
            style={{ width: 300, marginTop: 20 }}
            onChange={(value) => {
              setCompareStock(value);
              fetchHistoricalData(value, selectedInterval, true);
            }}
        >
          {stocks.map((stock) => (
              <Option key={stock.symbol} value={stock.symbol}>
                {stock.name}
              </Option>
          ))}
        </Select>

        <TradingButtons>
          <BuyButton onClick={() => showOrderModal('BUY')}>
            Buy {stocks.find((stock) => stock.symbol === selectedStock)?.name}
          </BuyButton>
          <SellButton onClick={() => showOrderModal('SELL')}>
            Sell {stocks.find((stock) => stock.symbol === selectedStock)?.name}
          </SellButton>
        </TradingButtons>


        <TableContainer>
          <Table>
            <thead>
            <tr>
              <TableHeader onClick={() => handleSort('type')}>
                <HeaderCell>
                  Type
                  <span>{getSortIcon('type')}</span>
                </HeaderCell>
              </TableHeader>
              <TableHeader onClick={() => handleSort('lotsSize')}>
                <HeaderCell>
                  Lots Size
                  <span>{getSortIcon('lotsSize')}</span>
                </HeaderCell>
              </TableHeader>
              <TableHeader onClick={() => handleSort('originalPrice')}>
                <HeaderCell>
                  Original Price
                  <span>{getSortIcon('originalPrice')}</span>
                </HeaderCell>
              </TableHeader>
              <TableHeader onClick={() => handleSort('currentPrice')}>
                <HeaderCell>
                  Current Price
                  <span>{getSortIcon('currentPrice')}</span>
                </HeaderCell>
              </TableHeader>
              <TableHeader onClick={() => handleSort('performanceStatus')}>
                <HeaderCell>
                  Status
                  <span>{getSortIcon('performanceStatus')}</span>
                </HeaderCell>
              </TableHeader>
              <TableHeader onClick={() => handleSort('performanceValue')}>
                <HeaderCell>
                 Value
                  <span>{getSortIcon('performanceValue')}</span>
                </HeaderCell>
              </TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
            </thead>
            <tbody>
            {tradeOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.lotsSize}</TableCell>
                  <TableCell>{formatAmount(order.originalPrice)}</TableCell>
                  <TableCell>{formatAmount(order.currentPrice)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.performanceStatus}>
                      {order.performanceStatus}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{formatAmount(order.performanceValue)}</TableCell>
                  <TableCell>
                    <ActionButton
                        onClick={() => closeTradeOrder(order.id)}
                        disabled={order.status === 'COMPLETED'}
                    >
                      Close Order
                    </ActionButton>
                  </TableCell>
                </TableRow>
            ))}
            </tbody>
          </Table>
        </TableContainer>
        <OrderModal
            title={`Place ${orderType} Order`}
            open={isOrderModalVisible}
            onCancel={hideOrderModal}
            onOk={placeOrder}
            okText="Confirm Order"
            cancelText="Cancel"
        >
          <div style={{ marginTop: '20px' }}>
            <label>Lots:</label>
            <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
                placeholder="Enter lots size"
            />
            <p style={{ marginTop: '10px' }}>
              Current Price: {currentPrice}
            </p>
          </div>
        </OrderModal>

      </MainContainer>
  );
};

export default NASDAQStockChart;
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'react-apexcharts';
import styled, { keyframes } from 'styled-components';
import { Modal, Button, Input } from 'antd';
import { FaArrowUp, FaArrowDown, FaClock, FaPaintBrush, FaEraser, FaArrowLeft, FaArrowRight, FaChartLine, FaRulerCombined, FaTrashAlt } from 'react-icons/fa';
import currencyData from '../assets/currencies.json';
import { Bitcoin, Ethereum, Litecoin, Ripple, Cardano, Polkadot, Solana, Binance, Polygon, Dogecoin } from './CoinIcons';
import Draggable from 'react-draggable';

const coins = [
  { symbol: 'BTCUSDT', icon: <Bitcoin />, name: 'Bitcoin' },
  { symbol: 'ETHUSDT', icon: <Ethereum />, name: 'Ethereum' },
  { symbol: 'LTCUSDT', icon: <Litecoin />, name: 'Litecoin' },
  { symbol: 'XRPUSDT', icon: <Ripple />, name: 'Ripple' },
  { symbol: 'ADAUSDT', icon: <Cardano />, name: 'Cardano' },
  { symbol: 'DOTUSDT', icon: <Polkadot />, name: 'Polkadot' },
  { symbol: 'SOLUSDT', icon: <Solana />, name: 'Solana' },
  { symbol: 'BNBUSDT', icon: <Binance />, name: 'Binance' },
  { symbol: 'MATICUSDT', icon: <Polygon />, name: 'Polygon' },
  { symbol: 'DOGEUSDT', icon: <Dogecoin />, name: 'Dogecoin' },
];

const intervals = [
  { label: '1 Second', value: '1s' },
  { label: '1 Minute', value: '1m' },
  { label: '1 Hour', value: '1h' },
  { label: '1 Day', value: '1d' },
  { label: '1 Week', value: '1w' },
];

const indicators = [
  { label: 'Moving Average', value: 'ma' },
  { label: 'Bollinger Bands', value: 'bb' },
  { label: 'Relative Strength Index (RSI)', value: 'rsi' },
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

const slideUp = keyframes`
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
  padding: 20px;
  max-width: 100%;
  overflow: hidden;
  animation: ${fadeIn} 1s ease-in-out;
  background: linear-gradient(135deg, #f4f7f9 0%, #dfe9f3 100%);
`;

const CoinSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px 40px;
  box-shadow: 0px 12px 45px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  width: 100%;
  max-width: 1200px;
  transition: box-shadow 0.4s ease, transform 0.4s ease;
  animation: ${slideUp} 0.8s ease-in-out;
  position: relative;

  &:hover {
    box-shadow: 0px 15px 50px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
  }
`;

const CoinIcon = styled.div`
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
  box-shadow: inset 5px 5px 15px rgba(0, 0, 0, 0.1), inset -5px -5px 15px rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: #e4e9f0;
    box-shadow: inset 5px 5px 15px rgba(0, 0, 0, 0.2), inset -5px -5px 15px rgba(255, 255, 255, 0.9);
  }
`;

const PriceText = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-right: 15px;
  color: #333;
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
`;

const ArrowIcon = styled.div`
  font-size: 28px;
  color: ${({ isUp }) => (isUp ? '#28a745' : '#dc3545')};
  margin-left: 15px;
  transition: transform 0.4s ease;

  ${PriceSection}:hover & {
    transform: scale(1.3);
  }
`;

const ChartContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
`;

const ChartSection = styled.div`
  flex-grow: 1;
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0px 12px 45px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  height: 63vh;
  animation: ${slideUp} 0.8s ease-in-out;
  
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: ${({ isDrawing }) => (isDrawing ? 'auto' : 'none')};
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60px;
  background: linear-gradient(135deg, #f4f7f9 0%, #dfe9f3 100%); /* Match with page background */
  color: white;
  border-radius: 20px 0 0 20px; /* Fix border-radius */
  box-shadow: 0px 12px 45px rgba(0, 0, 0, 0.15);
  height: 63vh;
  transition: all 0.3s ease;
  padding: 10px;

  &.collapsed {
    width: 20px;
    border-radius: 20px;
    justify-content: flex-start;
  }

  &:hover {
    background: linear-gradient(135deg, #cfd9e8, #b5c5df); /* Subtle hover effect */
  }
`;

const RightSidebar = styled(Sidebar)`
  border-radius: 0 20px 20px 0; /* Fix border-radius */
`;

const SidebarToggle = styled(Button)`
  margin: 10px 0;
  background: transparent;
  border: none;
  color: #0056b3; /* Darker color for better contrast */
  font-size: 18px;
  &:hover {
    color: #003d7a;
  }
`;

const ToolButton = styled(Button)`
  margin: 10px 0;
  background-color: #505fb0;
  color: white;
  border: none;
  font-size: 18px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.3s ease;

  &:hover {
    background-color: #6d83f2;
    color: white;
  }
`;

const ToolbarModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f0f4ff;
  border-radius: 10px;
`;

const DraggableModal = styled(Modal)`
  .ant-modal-content {
    background: #edf2f4;
    border-radius: 15px;
    padding: 20px;
    position: relative;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }

  .ant-modal-header {
    border-bottom: none;
    padding: 10px 15px;
    border-radius: 15px 15px 0 0;
    background: #505fb0;
    color: white;
  }

  .ant-modal-footer {
    display: none;
  }

  .ant-modal-body {
    padding: 0;
  }
`;

const IntervalButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #0056b3;
  cursor: pointer;
  margin-left: 25px;
  transition: color 0.3s ease, transform 0.3s ease;

  .icon {
    font-size: 28px;
    color: #0056b3;
  }

  &:hover .icon {
    color: #003d7a;
    transform: scale(1.2);
  }
`;

const SearchInput = styled(Input)`
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #dee2e6;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(38, 143, 255, 0.2);
  }
`;

const CoinGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 20px;
  align-items: center;
  padding: 10px 0;
  max-height: 500px;
  overflow-y: auto;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const CoinButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(145deg, #f0f0f0, #d9d9d9);
  border: 1px solid #dee2e6;
  box-shadow: 5px 5px 10px #cccccc, -5px -5px 10px #ffffff;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  font-size: 30px;

  &:hover {
    transform: scale(1.2);
    background: linear-gradient(145deg, #e2e6ea, #f0f0f0);
    box-shadow: 5px 5px 15px #cccccc, -5px -5px 15px #ffffff;
  }
`;

const RealTimeCryptoChart = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [convertedPrice, setConvertedPrice] = useState(null);
  const [intervalModalVisible, setIntervalModalVisible] = useState(false);
  const [coinModalVisible, setCoinModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterval, setSelectedInterval] = useState('1m');
  const [selectedCoin, setSelectedCoin] = useState('BTCUSDT');
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('red');
  const [brushSize, setBrushSize] = useState(2);

  const fetchHistoricalData = async (symbol, interval = '1m') => {
    setLoading(true);
    try {
      const endpoint = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=500`;
      const response = await fetch(endpoint);
      const data = await response.json();
      const formattedData = data.map((d) => ({
        x: new Date(d[0]),
        y: [parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3]), parseFloat(d[4])],
      }));
      setHistoricalData(formattedData);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
    setLoading(false);
  };

  const fetchCurrentPrice = async (symbol) => {
    setLoading(true);
    try {
      const endpoint = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setPreviousPrice(currentPrice);
      setCurrentPrice(parseFloat(data.price));
    } catch (error) {
      console.error('Error fetching current price:', error);
    }
    setLoading(false);
  };

  const fetchCurrencyConversion = async () => {
    try {
      const endpoint = `https://api.exchangerate-api.com/v4/latest/USD`;
      const response = await fetch(endpoint);
      const data = await response.json();
      const conversionRate = data.rates[currency];
      setConvertedPrice((currentPrice * conversionRate).toFixed(2));
    } catch (error) {
      console.error('Error converting currency:', error);
    }
  };

  useEffect(() => {
    fetchHistoricalData(selectedCoin, selectedInterval);
    fetchCurrentPrice(selectedCoin);
  }, [selectedCoin, selectedInterval]);

  useEffect(() => {
    if (currentPrice) {
      fetchCurrencyConversion();
    }
  }, [currentPrice, currency]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    contextRef.current = context;
  }, [brushColor, brushSize]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setDrawing(false);
  };

  const eraseDrawing = ({ nativeEvent }) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.globalCompositeOperation = "destination-out";
    context.arc(nativeEvent.offsetX, nativeEvent.offsetY, brushSize * 2, 0, Math.PI * 2, false);
    context.fill();
    context.globalCompositeOperation = "source-over";
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const openToolbar = () => setToolbarVisible(true);
  const closeToolbar = () => setToolbarVisible(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const selectIndicator = (indicator) => {
    if (selectedIndicators.includes(indicator)) {
      setSelectedIndicators(selectedIndicators.filter((i) => i !== indicator));
    } else {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };

  const calculateIndicator = (data) => {
    return selectedIndicators.map((indicator) => {
      switch (indicator) {
        case 'ma':
          const maData = data.map((point, index, arr) => {
            if (index < 9) return null;
            const sum = arr.slice(index - 9, index + 1).reduce((acc, curr) => acc + curr.y[3], 0);
            return { x: point.x, y: sum / 10 };
          });
          return { name: 'Moving Average', type: 'line', data: maData.filter(Boolean) };
        case 'bb':
          const bbData = data.map((point, index, arr) => {
            if (index < 19) return null;
            const sma = arr.slice(index - 19, index + 1).reduce((acc, curr) => acc + curr.y[3], 0) / 20;
            const stdDev = Math.sqrt(arr.slice(index - 19, index + 1).reduce((acc, curr) => acc + Math.pow(curr.y[3] - sma, 2), 0) / 20);
            return { x: point.x, y: [sma - 2 * stdDev, sma, sma + 2 * stdDev] };
          });
          return { name: 'Bollinger Bands', type: 'line', data: bbData.filter(Boolean) };
        case 'rsi':
          let gain = 0;
          let loss = 0;
          const rsiData = data.map((point, index, arr) => {
            if (index === 0 || index < 14) return null;
            const change = point.y[3] - arr[index - 1].y[3];
            if (change > 0) gain += change;
            if (change < 0) loss -= change;
            const avgGain = gain / 14;
            const avgLoss = loss / 14;
            const rs = avgGain / avgLoss;
            const rsi = 100 - 100 / (1 + rs);
            gain -= arr[index - 14]?.y[3] > arr[index - 15]?.y[3] ? arr[index - 14].y[3] - arr[index - 15].y[3] : 0;
            loss -= arr[index - 14]?.y[3] < arr[index - 15]?.y[3] ? arr[index - 14].y[3] - arr[index - 15].y[3] : 0;
            return { x: point.x, y: rsi };
          });
          return { name: 'RSI', type: 'line', data: rsiData.filter(Boolean) };
        default:
          return [];
      }
    }).filter((indicator) => indicator.data.length > 0);
  };

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
    colors: ['#00bfae'],
    grid: {
      borderColor: '#f1f1f1',
    },
    tooltip: {
      theme: 'dark',
    },
  };

  const combinedSeries = [
    { name: 'Candlestick', data: historicalData },
    ...calculateIndicator(historicalData)
  ];

  return (
    <MainContainer>
      <CoinSection>
        <CoinIcon onClick={() => setCoinModalVisible(true)}>
          {coins.find((coin) => coin.symbol === selectedCoin).icon}
        </CoinIcon>
        <PriceSection onClick={() => setCurrencyModalVisible(true)}>
          <PriceText>
            {currencyData.find((cur) => cur.code === currency).symbol} {convertedPrice || 'Loading...'}
          </PriceText>
          {previousPrice && currentPrice > previousPrice ? (
            <ArrowIcon isUp><FaArrowUp /></ArrowIcon>
          ) : (
            <ArrowIcon isUp={false}><FaArrowDown /></ArrowIcon>
          )}
        </PriceSection>
        <IntervalButton onClick={() => setIntervalModalVisible(true)}>
          <FaClock className="icon" />
        </IntervalButton>
      </CoinSection>

      <ChartContainer>
        <Sidebar className={sidebarCollapsed ? 'collapsed' : ''}>
          <SidebarToggle onClick={toggleSidebar}>
            {sidebarCollapsed ? <FaArrowRight /> : <FaArrowLeft />}
          </SidebarToggle>
          {!sidebarCollapsed && (
            <>
              <ToolButton onClick={() => setIsDrawing(!isDrawing)}>
                {isDrawing ? <FaPaintBrush /> : <FaEraser />}
              </ToolButton>
              <ToolButton onClick={clearCanvas}><FaTrashAlt /></ToolButton>
              <ToolButton onClick={openToolbar}><FaChartLine /></ToolButton>
            </>
          )}
        </Sidebar>

        <ChartSection isDrawing={isDrawing}>
          {loading ? (
            <div>Loading chart...</div>
          ) : (
            <>
              <Chart
                options={chartOptions}
                series={combinedSeries}
                type="candlestick"
                height="100%"
              />
              <canvas
                ref={canvasRef}
                onMouseDown={isDrawing ? startDrawing : eraseDrawing}
                onMouseMove={isDrawing ? draw : eraseDrawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </>
          )}
        </ChartSection>

        <RightSidebar className={sidebarCollapsed ? 'collapsed' : ''}>
          <SidebarToggle onClick={toggleSidebar}>
            {sidebarCollapsed ? <FaArrowLeft /> : <FaArrowRight />}
          </SidebarToggle>
          {!sidebarCollapsed && (
            <>
              {indicators.map((indicator) => (
                <ToolButton key={indicator.value} onClick={() => selectIndicator(indicator.value)}>
                  {indicator.value}
                </ToolButton>
              ))}
            </>
          )}
        </RightSidebar>
      </ChartContainer>

      <Draggable handle=".ant-modal-header">
        <DraggableModal
          title="Drawing & Analytics Tools"
          open={toolbarVisible}
          onCancel={closeToolbar}
          centered
          destroyOnClose
        >
          <ToolbarModalContent>
            <div>
              <label>Brush Color: </label>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
              />
            </div>
            <div>
              <label>Brush Size: </label>
              <input
                type="range"
                min="1"
                max="10"
                value={brushSize}
                onChange={(e) => setBrushSize(e.target.value)}
              />
            </div>
            <Button
              style={{ backgroundColor: '#edf2f4', color: '#0056b3' }}
              onClick={() => setIsDrawing(true)}
            >
              <FaPaintBrush /> Draw
            </Button>
            <Button
              style={{ backgroundColor: '#edf2f4', color: '#0056b3' }}
              onClick={() => setIsDrawing(false)}
            >
              <FaEraser /> Erase
            </Button>
            <Button style={{ backgroundColor: '#edf2f4', color: '#0056b3' }}>
              <FaChartLine /> Trendline
            </Button>
            <Button style={{ backgroundColor: '#edf2f4', color: '#0056b3' }}>
              <FaRulerCombined /> Fibonacci
            </Button>
          </ToolbarModalContent>
        </DraggableModal>
      </Draggable>

      <Modal
        title="Select Interval"
        open={intervalModalVisible}
        onCancel={() => setIntervalModalVisible(false)}
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
                setIntervalModalVisible(false);
              }}
              style={{ width: '100%', marginBottom: '10px' }}
            >
              {interval.label}
            </Button>
          ))}
        </div>
      </Modal>

      <Modal
        title="Select Coin"
        open={coinModalVisible}
        onCancel={() => setCoinModalVisible(false)}
        footer={null}
        centered
        destroyOnClose
      >
        <div>
          <SearchInput
            placeholder="Search for a coin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CoinGrid>
            {coins
              .filter((coin) => coin.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((coin) => (
                <CoinButton
                  key={coin.symbol}
                  onClick={() => {
                    setSelectedCoin(coin.symbol);
                    setCoinModalVisible(false);
                  }}
                >
                  {coin.icon}
                </CoinButton>
              ))}
          </CoinGrid>
        </div>
      </Modal>

      <Modal
        title="Select Currency"
        open={currencyModalVisible}
        onCancel={() => setCurrencyModalVisible(false)}
        footer={null}
        centered
        destroyOnClose
      >
        <div>
          {currencyData.map((cur) => (
            <Button
              key={cur.code}
              onClick={() => {
                setCurrency(cur.code);
                setCurrencyModalVisible(false);
              }}
              style={{ width: '100%', marginBottom: '10px' }}
            >
              {cur.symbol} - {cur.code}
            </Button>
          ))}
        </div>
      </Modal>
    </MainContainer>
  );
};

export default RealTimeCryptoChart;


export const fetchCryptoPrices = async (symbol = 'BTCUSDT', interval = '1m') => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        return data.map(item => ({
          timestamp: item[0],
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
          volume: parseFloat(item[5]),
        }));
      } else {
        console.error('Unexpected data format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      return [];
    }
  };

  export const fetchCurrentPrice = async (symbol) => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      const data = await response.json();
      return parseFloat(data.price).toFixed(2);
    } catch (error) {
      console.error('Error fetching current price:', error);
      return null;
    }
  };



  export const fetchCoinInfo = async (coinSymbol) => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${coinSymbol}`);
      const data = await response.json();
      return {
        price: data.lastPrice,
        high24h: data.highPrice,
        low24h: data.lowPrice,
        volume: data.volume,
      };
    } catch (error) {
      console.error('Error fetching coin info from Binance:', error);
      return {}; // Return an empty object in case of error
    }
  };

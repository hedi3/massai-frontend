export const fetchCryptoPrices = async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price');
      const data = await response.json();
  
      // Include more coins in the filter
      const coinsToInclude = [
        'BTCUSDT', 'ETHUSDT', 'LTCUSDT', 'XRPUSDT', 'ADAUSDT', 'DOTUSDT', 'SOLUSDT', 'BNBUSDT', 'MATICUSDT', 'DOGEUSDT'
      ];
      return data.filter(item => coinsToInclude.includes(item.symbol));
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      return [];
    }
  };
  
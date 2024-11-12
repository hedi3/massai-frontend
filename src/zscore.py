from flask import Flask, jsonify, request
from flask_cors import CORS  # Import the CORS package
import numpy as np
import pandas as pd
import yfinance as yf
import math

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def fetch_data(ticker, interval):
    if interval in ['1m', '2m', '5m', '15m', '30m', '1h']:
        return yf.download(ticker, period="5d", interval=interval)
    elif interval in ['1d', '1wk', '1mo']:
        return yf.download(ticker, period="1y", interval=interval)
    else:
        return pd.DataFrame()

def fetch_volatility(volatility_ticker, interval):
    if interval in ['1m', '2m', '5m', '15m', '30m', '1h']:
        return yf.download(volatility_ticker, period="5d", interval=interval)['Close']
    elif interval in ['1d', '1wk', '1mo']:
        return yf.download(volatility_ticker, period="1y", interval=interval)['Close']
    else:
        return pd.Series()

def calculate_sigma(settlement_price, volatility, expiration):
    return settlement_price * (volatility / 100) * expiration

def calculate_z_scores(current_price, high_of_day, low_of_day, sigma):
    distance_neg = (current_price - high_of_day) / sigma
    distance_pos = (current_price - low_of_day) / sigma
    return distance_neg, distance_pos

@app.route('/zscore', methods=['GET'])
def get_z_score():
    ticker = request.args.get('ticker', default='^IXIC')
    vol_ticker = request.args.get('volatility_ticker', default='^VXN')
    interval = request.args.get('interval', default='1d')

    data = fetch_data(ticker, interval)
    if data.empty or len(data) < 2:
        return jsonify({"error": "Insufficient market data"}), 400

    current_price = data['Close'].iloc[-1]
    high_of_day = data['High'].iloc[-1]
    low_of_day = data['Low'].iloc[-1]

    volatility_data = fetch_volatility(vol_ticker, interval)
    if volatility_data.empty:
        return jsonify({"error": "Insufficient volatility data"}), 400

    volatility = volatility_data.iloc[-1]

    settlement_price = data['Close'].shift(1).iloc[-1]

    expiration = {
        '1m': 1/1440,
        '2m': 2/1440,
        '5m': 5/1440,
        '15m': 15/1440,
        '30m': 30/1440,
        '1h': 1/24,
        '1d': 1,
        '1wk': 7,
        '1mo': 30,
    }.get(interval, 1)

    sigma = calculate_sigma(settlement_price, volatility, expiration)

    distance_neg, distance_pos = calculate_z_scores(current_price, high_of_day, low_of_day, sigma)

    prob_neg = 0.5 * (1 + math.erf(distance_neg / math.sqrt(2)))
    prob_pos = 0.5 * (1 + math.erf(distance_pos / math.sqrt(2)))

    response = {
        'negative_z_score': distance_neg,
        'positive_z_score': distance_pos,
        'negative_z_score_probability': prob_neg,
        'positive_z_score_probability': prob_pos
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)

// src/components/CoinIcons.js

import React from 'react';
import BitcoinIcon from './icons/bitcoin.svg'; // Make sure the path and file exist
import EthereumIcon from './icons/ethereum.svg';
import LitecoinIcon from './icons/litecoin.svg';
import RippleIcon from './icons/ripple.svg';
import CardanoIcon from './icons/cardano.svg';
import PolkadotIcon from './icons/polkadot.svg';
import SolanaIcon from './icons/solana.svg';
import BinanceIcon from './icons/binance.svg';
import PolygonIcon from './icons/polygon.svg';
import DogecoinIcon from './icons/dogecoin.svg';

export const Bitcoin = () => <img src={BitcoinIcon} alt="Bitcoin" style={{ width: '40px', height: '40px' }} />;
export const Ethereum = () => <img src={EthereumIcon} alt="Ethereum" style={{ width: '40px', height: '40px' }} />;
export const Litecoin = () => <img src={LitecoinIcon} alt="Litecoin" style={{ width: '40px', height: '40px' }} />;
export const Ripple = () => <img src={RippleIcon} alt="Ripple" style={{ width: '40px', height: '40px' }} />;
export const Cardano = () => <img src={CardanoIcon} alt="Cardano" style={{ width: '40px', height: '40px' }} />;
export const Polkadot = () => <img src={PolkadotIcon} alt="Polkadot" style={{ width: '40px', height: '40px' }} />;
export const Solana = () => <img src={SolanaIcon} alt="Solana" style={{ width: '40px', height: '40px' }} />;
export const Binance = () => <img src={BinanceIcon} alt="Binance" style={{ width: '40px', height: '40px' }} />;
export const Polygon = () => <img src={PolygonIcon} alt="Polygon" style={{ width: '40px', height: '40px' }} />;
export const Dogecoin = () => <img src={DogecoinIcon} alt="Dogecoin" style={{ width: '40px', height: '40px' }} />;

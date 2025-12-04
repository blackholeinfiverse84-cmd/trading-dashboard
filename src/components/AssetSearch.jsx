import React, { useState, useRef, useEffect } from 'react'
import './AssetSearch.css'

// Extended asset database - can be replaced with API call
const ASSET_DATABASE = [
  // Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stock', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Stock', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Stock', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Stock', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms Inc.', type: 'Stock', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock', exchange: 'NASDAQ' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', type: 'Stock', exchange: 'NSE' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', type: 'Stock', exchange: 'NSE' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', type: 'Stock', exchange: 'NSE' },
  { symbol: 'INFY', name: 'Infosys Limited', type: 'Stock', exchange: 'NSE' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', type: 'Stock', exchange: 'NSE' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', type: 'Stock', exchange: 'NSE' },
  { symbol: 'SBIN', name: 'State Bank of India', type: 'Stock', exchange: 'NSE' },
  { symbol: 'WIPRO', name: 'Wipro Limited', type: 'Stock', exchange: 'NSE' },
  // Indices
  { symbol: 'NIFTY', name: 'NIFTY 50', type: 'Index', exchange: 'NSE' },
  { symbol: 'SENSEX', name: 'S&P BSE Sensex', type: 'Index', exchange: 'BSE' },
  { symbol: 'SPX', name: 'S&P 500', type: 'Index', exchange: 'NYSE' },
  { symbol: 'DJI', name: 'Dow Jones', type: 'Index', exchange: 'NYSE' },
  { symbol: 'NASDAQ', name: 'NASDAQ Composite', type: 'Index', exchange: 'NASDAQ' },
  // Crypto
  { symbol: 'BTCUSD', name: 'Bitcoin', type: 'Crypto', exchange: 'Crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum', type: 'Crypto', exchange: 'Crypto' },
  { symbol: 'BNBUSD', name: 'Binance Coin', type: 'Crypto', exchange: 'Crypto' },
  { symbol: 'ADAUSD', name: 'Cardano', type: 'Crypto', exchange: 'Crypto' },
  { symbol: 'SOLUSD', name: 'Solana', type: 'Crypto', exchange: 'Crypto' },
  // Commodities
  { symbol: 'GOLD', name: 'Gold Spot', type: 'Commodity', exchange: 'COMEX' },
  { symbol: 'SILVER', name: 'Silver Spot', type: 'Commodity', exchange: 'COMEX' },
  { symbol: 'CRUDE', name: 'WTI Crude Oil', type: 'Commodity', exchange: 'NYMEX' },
  { symbol: 'NATURALGAS', name: 'Natural Gas', type: 'Commodity', exchange: 'NYMEX' },
]

const AssetSearch = ({ 
  value = '', 
  onChange, 
  placeholder = 'Search stocks, crypto, commodities...',
  className = '',
  showLabel = true,
  label = 'Asset'
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredAssets, setFilteredAssets] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  // Initialize with value if provided
  useEffect(() => {
    if (value) {
      const asset = ASSET_DATABASE.find(a => a.symbol === value)
      if (asset) {
        setSearchQuery(asset.symbol)
      } else {
        setSearchQuery(value)
      }
    }
  }, [value])

  // Filter assets based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAssets([])
      setIsOpen(false)
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const filtered = ASSET_DATABASE.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        asset.exchange.toLowerCase().includes(query)
    ).slice(0, 10) // Limit to 10 results

    setFilteredAssets(filtered)
    setIsOpen(filtered.length > 0)
    setSelectedIndex(-1)
  }, [searchQuery])

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setSearchQuery(newValue)
    setIsOpen(true)
    
    // If exact match found, trigger onChange
    const exactMatch = ASSET_DATABASE.find(
      (a) => a.symbol.toLowerCase() === newValue.toLowerCase()
    )
    if (exactMatch && onChange) {
      onChange({
        symbol: exactMatch.symbol,
        assetType: exactMatch.type,
        name: exactMatch.name,
        exchange: exactMatch.exchange,
      })
    } else if (newValue.trim() && onChange) {
      // Allow custom symbol entry
      onChange({
        symbol: newValue.toUpperCase(),
        assetType: 'Custom',
        name: newValue,
        exchange: '',
      })
    }
  }

  // Handle asset selection
  const handleSelectAsset = (asset) => {
    setSearchQuery(asset.symbol)
    setIsOpen(false)
    if (onChange) {
      onChange({
        symbol: asset.symbol,
        assetType: asset.type,
        name: asset.name,
        exchange: asset.exchange,
      })
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || filteredAssets.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < filteredAssets.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredAssets.length) {
          handleSelectAsset(filteredAssets[selectedIndex])
        } else if (filteredAssets.length === 1) {
          handleSelectAsset(filteredAssets[0])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
      default:
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`asset-search-wrapper ${className}`}>
      {showLabel && <label className="asset-search-label">{label}</label>}
      <div className="asset-search-container" ref={searchRef}>
        <div className="asset-search-input-wrapper">
          <span className="asset-search-icon">🔍</span>
          <input
            type="text"
            className="asset-search-input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (filteredAssets.length > 0) setIsOpen(true)
            }}
          />
          {searchQuery && (
            <button
              type="button"
              className="asset-search-clear"
              onClick={() => {
                setSearchQuery('')
                setIsOpen(false)
                if (onChange) {
                  onChange({ symbol: '', assetType: '', name: '', exchange: '' })
                }
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {isOpen && filteredAssets.length > 0 && (
          <div className="asset-search-dropdown" ref={dropdownRef}>
            {filteredAssets.map((asset, index) => (
              <div
                key={`${asset.symbol}-${index}`}
                className={`asset-search-item ${
                  index === selectedIndex ? 'asset-search-item-selected' : ''
                }`}
                onClick={() => handleSelectAsset(asset)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="asset-search-item-main">
                  <span className="asset-search-symbol">{asset.symbol}</span>
                  <span className="asset-search-name">{asset.name}</span>
                </div>
                <div className="asset-search-item-meta">
                  <span className={`asset-search-type asset-type-${asset.type.toLowerCase()}`}>
                    {asset.type}
                  </span>
                  <span className="asset-search-exchange">{asset.exchange}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssetSearch


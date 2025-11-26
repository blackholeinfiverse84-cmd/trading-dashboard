import React, { useState } from 'react'
import Card from './common/Card'
import Button from './common/Button'
import Input from './common/Input'
import './InputPanel.css'

const assetOptions = [
  { label: 'AAPL', value: 'AAPL', type: 'Stock' },
  { label: 'TSLA', value: 'TSLA', type: 'Stock' },
  { label: 'NIFTY', value: 'NIFTY', type: 'Index' },
  { label: 'BTC/USD', value: 'BTCUSD', type: 'Crypto' },
  { label: 'GOLD', value: 'GOLD', type: 'Commodity' },
]

const riskModes = [
  { label: 'Auto', value: 'auto', description: 'AI-managed risk parameters' },
  { label: 'Manual', value: 'manual', description: 'Trader-defined controls' },
]

const InputPanel = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    symbol: assetOptions[0].value,
    assetType: assetOptions[0].type,
    stopLoss: 5,
    targetReturn: 10,
    investmentAmount: 5000,
    riskMode: 'auto',
    notes: '',
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [preview, setPreview] = useState(null)
  const [previewError, setPreviewError] = useState(null)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleAssetChange = (value) => {
    const asset = assetOptions.find((option) => option.value === value)
    handleChange('symbol', value)
    handleChange('assetType', asset?.type || 'Asset')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.symbol) newErrors.symbol = 'Select an asset'
    if (!formData.stopLoss && formData.stopLoss !== 0) newErrors.stopLoss = 'Required'
    if (!formData.targetReturn && formData.targetReturn !== 0) newErrors.targetReturn = 'Required'
    if (!formData.investmentAmount || formData.investmentAmount <= 0) {
      newErrors.investmentAmount = 'Enter a valid investment amount'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const buildDecisionPayload = () => ({
      symbol: formData.symbol,
      assetType: formData.assetType,
      action: formData.targetReturn >= formData.stopLoss ? 'BUY' : 'SELL',
      price: formData.investmentAmount,
      quantity: Math.round((formData.investmentAmount || 0) / 100),
      reason: formData.notes || `Target ${formData.targetReturn}% with ${formData.stopLoss}% stop-loss.`,
      confidence: formData.riskMode === 'auto' ? 85 : 65,
      riskMode: formData.riskMode,
      parameters: {
        stopLoss: formData.stopLoss,
        targetReturn: formData.targetReturn,
        investmentAmount: formData.investmentAmount,
      },
    })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)

    const decision = buildDecisionPayload()

    try {
      if (onSubmit) {
        await onSubmit(decision)
      }
      setFormData((prev) => ({ ...prev, notes: '' }))
    } finally {
      setSubmitting(false)
    }
  }

  const handlePreview = async () => {
    if (!validateForm()) return

    setPreviewing(true)
    setPreviewError(null)

    try {
      // Simulate API preview (replace with real endpoint later)
      await new Promise((resolve) => setTimeout(resolve, 600))
      const decision = buildDecisionPayload()
      const range = Math.abs(decision.parameters.targetReturn - decision.parameters.stopLoss)
      const normalizedConfidence = Math.min(98, Math.max(55, decision.confidence + range / 2))

      setPreview({
        ...decision,
        confidence: normalizedConfidence.toFixed(1),
        summary: `Model recommends ${decision.action} with ${normalizedConfidence.toFixed(
          1,
        )}% confidence. Expect ${decision.parameters.targetReturn}% upside vs ${decision.parameters.stopLoss}% downside.`,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Preview error:', err)
      setPreviewError('Unable to generate preview right now.')
    } finally {
      setPreviewing(false)
    }
  }

  return (
    <Card title="Input Panel" subtitle="Configure your trade parameters" className="input-panel-card">
      <form className="input-panel-form" onSubmit={handleSubmit}>
        <div className="input-grid">
          <div className="input-field">
            <label className="input-panel-label">Asset</label>
            <div className="asset-options">
              {assetOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`asset-option ${formData.symbol === option.value ? 'asset-option-active' : ''}`}
                  onClick={() => handleAssetChange(option.value)}
                >
                  <span className="asset-label">{option.label}</span>
                  <span className="asset-type text-muted">{option.type}</span>
                </button>
              ))}
            </div>
            {errors.symbol && <span className="input-error-text">{errors.symbol}</span>}
          </div>

          <Input
            type="number"
            label="Stop-loss (%)"
            value={formData.stopLoss}
            onChange={(e) => handleChange('stopLoss', Number(e.target.value))}
            error={errors.stopLoss}
            fullWidth
            min={0}
            step={0.1}
          />

          <Input
            type="number"
            label="Target return (%)"
            value={formData.targetReturn}
            onChange={(e) => handleChange('targetReturn', Number(e.target.value))}
            error={errors.targetReturn}
            fullWidth
            min={0}
            step={0.1}
          />

          <Input
            type="number"
            label="Investment amount (₹)"
            value={formData.investmentAmount}
            onChange={(e) => handleChange('investmentAmount', Number(e.target.value))}
            error={errors.investmentAmount}
            fullWidth
            min={100}
            step={100}
          />

          <div className="input-field">
            <label className="input-panel-label">Risk Mode</label>
            <div className="risk-mode-options">
              {riskModes.map((mode) => (
                <button
                  type="button"
                  key={mode.value}
                  className={`risk-mode-option ${formData.riskMode === mode.value ? 'risk-mode-active' : ''}`}
                  onClick={() => handleChange('riskMode', mode.value)}
                >
                  <div className="risk-mode-title">{mode.label}</div>
                  <div className="risk-mode-description">{mode.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="input-field">
            <label className="input-panel-label">Notes / Rationale</label>
            <textarea
              className="input-textarea"
              placeholder="Briefly describe your thesis..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
            ></textarea>
          </div>
        </div>

        <div className="input-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePreview}
            disabled={previewing || submitting}
          >
            {previewing ? 'Generating preview...' : 'Predict + Action Preview'}
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Trade Inputs'}
          </Button>
        </div>

        {(preview || previewError) && (
          <div className="preview-card">
            {previewError && <p className="preview-error">⚠️ {previewError}</p>}
            {preview && !previewError && (
              <>
                <div className="preview-header">
                  <span className="preview-title">Action preview</span>
                  <span className="preview-timestamp">
                    {new Date(preview.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="preview-body">
                  <div>
                    <p className="preview-label">Recommended Action</p>
                    <p className={`preview-value ${preview.action.toLowerCase()}`}>
                      {preview.action}
                    </p>
                  </div>
                  <div>
                    <p className="preview-label">Confidence</p>
                    <p className="preview-value">{preview.confidence}%</p>
                  </div>
                  <div>
                    <p className="preview-label">Position Size</p>
                    <p className="preview-value">₹{preview.price.toLocaleString()}</p>
                  </div>
                </div>
                <p className="preview-summary">{preview.summary}</p>
              </>
            )}
          </div>
        )}
      </form>
    </Card>
  )
}

export default InputPanel


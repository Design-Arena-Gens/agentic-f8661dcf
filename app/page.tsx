'use client'

import { useState } from 'react'

interface Balance {
  asset: string
  free: string
  locked: string
}

interface AccountInfo {
  makerCommission: number
  takerCommission: number
  buyerCommission: number
  sellerCommission: number
  canTrade: boolean
  canWithdraw: boolean
  canDeposit: boolean
  balances: Balance[]
}

export default function Home() {
  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [accountData, setAccountData] = useState<AccountInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAccountInfo = async () => {
    if (!apiKey || !apiSecret) {
      setError('Lütfen API Key ve Secret Key giriniz')
      return
    }

    setLoading(true)
    setError('')
    setAccountData(null)

    try {
      const response = await fetch('/api/binance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, apiSecret }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu')
      }

      setAccountData(data)
    } catch (err: any) {
      setError(err.message || 'Hesap bilgileri alınamadı')
    } finally {
      setLoading(false)
    }
  }

  const nonZeroBalances = accountData?.balances.filter(
    b => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0
  ) || []

  return (
    <div className="container">
      <div className="header">
        <h1>💼 Binance Spot Hesabım</h1>
        <p>Spot hesap bakiyelerinizi görüntüleyin</p>
      </div>

      <div className="api-form">
        <div className="form-group">
          <label htmlFor="apiKey">API Key</label>
          <input
            id="apiKey"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Binance API Key'inizi giriniz"
          />
        </div>

        <div className="form-group">
          <label htmlFor="apiSecret">Secret Key</label>
          <input
            id="apiSecret"
            type="password"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            placeholder="Binance Secret Key'inizi giriniz"
          />
        </div>

        <button className="btn" onClick={fetchAccountInfo} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Hesabı Göster'}
        </button>

        <div className="note">
          <strong>🔒 Güvenlik Notu:</strong>
          API anahtarlarınız sunucuda saklanmaz. Sadece Binance API'ye istek yapmak için kullanılır.
          API anahtarınızı oluştururken "Enable Spot & Margin Trading" seçeneğini pasif bırakarak
          sadece okuma izni verebilirsiniz.
        </div>
      </div>

      {error && (
        <div className="error">
          <strong>Hata:</strong> {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          Hesap bilgileri yükleniyor...
        </div>
      )}

      {accountData && (
        <div className="account-info">
          <h2>📊 Hesap Bilgileri</h2>

          <div className="info-grid">
            <div className="info-item">
              <label>İşlem Yapabilir</label>
              <div className="value">{accountData.canTrade ? '✅ Evet' : '❌ Hayır'}</div>
            </div>
            <div className="info-item">
              <label>Çekim Yapabilir</label>
              <div className="value">{accountData.canWithdraw ? '✅ Evet' : '❌ Hayır'}</div>
            </div>
            <div className="info-item">
              <label>Yatırım Yapabilir</label>
              <div className="value">{accountData.canDeposit ? '✅ Evet' : '❌ Hayır'}</div>
            </div>
            <div className="info-item">
              <label>Maker Komisyon</label>
              <div className="value">{accountData.makerCommission / 100}%</div>
            </div>
            <div className="info-item">
              <label>Taker Komisyon</label>
              <div className="value">{accountData.takerCommission / 100}%</div>
            </div>
            <div className="info-item">
              <label>Toplam Varlık</label>
              <div className="value">{nonZeroBalances.length} Adet</div>
            </div>
          </div>

          <h2 style={{ marginTop: '30px', marginBottom: '20px' }}>💰 Bakiyeler</h2>

          {nonZeroBalances.length > 0 ? (
            <div className="balances-grid">
              {nonZeroBalances.map((balance) => (
                <div key={balance.asset} className="balance-card">
                  <div className="asset">{balance.asset}</div>
                  <div className="amount">
                    Serbest: {parseFloat(balance.free).toFixed(8)}
                  </div>
                  <div className="locked">
                    Kilitli: {parseFloat(balance.locked).toFixed(8)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Hesabınızda bakiye bulunmamaktadır.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

# 🚀 Trading Cockpit — Demo Guide

Bu sənəd **4 modul + Sidebar**-ın necə işlədiyini izah edir.

---

## 📦 Quraşdırma

### 1. Dependencies Quraşdır
```bash
npm install
```

**Yeni əlavə edilən packages:**
- `zustand` — State management
- `plotly.js-dist-min` — Chart engine
- `@types/plotly.js` — TypeScript types

### 2. Environment Variables
`.env` faylı yarat:
```bash
VITE_OPENAI_API_KEY=sk-your-openai-key-here
```

### 3. Run Development Server
```bash
npm run dev
```

Brauzer avtomatik açılacaq: `http://localhost:3000`

---

## 🎯 Modullar

### **1. AI Analysis** 🤖
**Məqsəd:** Real-time AI-powered market analysis

**Xüsusiyyətlər:**
- ✅ Market sentiment (BULLISH/BEARISH/NEUTRAL)
- ✅ Confidence score (0-100%)
- ✅ AI signal generation (Entry, SL, TP, R/R)
- ✅ Signal history
- ✅ Stale signal detection (5 min)

**Test:**
1. Click "Run Analysis" button
2. AI cavabı 200-500ms-də gələcək
3. Latest signal card-da Entry/SL/TP görünəcək
4. "Execute Trade" düyməsi ilə order panel-ə keçid

**State:**
- `useTradingStore` — Symbol, candles, currentPrice
- `aiService` — OpenAI API integration

---

### **2. Trading Setups** 📊
**Məqsəd:** Pre-configured AI-powered trading setups

**Xüsusiyyətlər:**
- ✅ Top 10 AI-generated setups
- ✅ Candlestick pattern detection
- ✅ Trend direction (BULLISH/BEARISH)
- ✅ R/R ratio calculation
- ✅ Confidence badge

**Test:**
1. Click "Refresh Setups" button
2. 10 setup card görünəcək
3. Card-a click edəndə border emerald olacaq
4. "Accept Setup" düyməsi ilə order panel-ə keçid

**State:**
- `useTradeStore` — tradingSetups array
- Mock data generation (real AI integration sonra)

---

### **3. Strategy Builder** 🛠️
**Məqsəd:** Drag & drop strategy creation with backtesting

**Xüsusiyyətlər:**
- ✅ Available rules (RSI, SMA, Patterns)
- ✅ Active rules (user-selected)
- ✅ Code preview (auto-generated)
- ✅ Backtest results (mock)
- ✅ Copy code to clipboard

**Test:**
1. Click on "Available Rules" card-larına
2. Rule "Active Rules" panel-ə əlavə olacaq
3. Click "Show Code" — auto-generated kod görünəcək
4. Click "Run Backtest" — mock nəticələr görünəcək
5. Click "Copy Code" — clipboard-a kopyalanacaq

**State:**
- `useTradeStore` — availableRules, activeRules, backtestResult

---

### **4. Risk Control** 🛡️
**Məqsəd:** Position sizing and risk management

**Xüsusiyyətlər:**
- ✅ Account balance input
- ✅ Risk per trade (%)
- ✅ Leverage selector
- ✅ Entry/SL price inputs
- ✅ Auto-calculated metrics:
  - Position size
  - Stop loss distance
  - Margin required
  - Potential profit/loss
- ✅ Risk warning (if risk > 2%)

**Test:**
1. Enter account balance (default: 10000)
2. Set risk % (default: 1%)
3. Set leverage (default: 1x)
4. Enter entry price (auto-filled from current price)
5. Enter stop loss price
6. Metrics avtomatik hesablanacaq
7. Əgər risk > 2% olarsa, qırmızı warning görünəcək

**State:**
- `useTradeStore` — riskMetrics
- Real-time calculation on input change

---

## 🎨 **Sidebar**

**Xüsusiyyətlər:**
- ✅ Logo + branding
- ✅ Current symbol + price
- ✅ WebSocket connection status (green/red dot)
- ✅ Portfolio summary:
  - Active positions
  - Active orders
  - Total PnL
  - PnL %
- ✅ Quick actions:
  - New Position
  - Close All
  - Export Data

**State:**
- `useTradingStore` — symbol, currentPrice, positions, orders
- `wsManager` — WebSocket connection status

---

## 🔄 **SPA Behavior (No Page Reload)**

### Tab Switching
```
User clicks "Trading Setups" tab
  ↓
useTradeStore.setActiveModule('Trading Setups')
  ↓
React state updates
  ↓
Suspense triggers lazy load (if not loaded)
  ↓
Component renders
  ↓
NO PAGE RELOAD — seamless transition
```

### WebSocket Persistence
```
User switches tabs
  ↓
WebSocket connection REMAINS ACTIVE
  ↓
Real-time data continues streaming
  ↓
State updates in background
  ↓
When user returns to chart, data is fresh
```

---

## 🧪 **Test Scenarios**

### Scenario 1: AI Analysis
1. Open app → Default tab: "AI Analysis"
2. Click "Run Analysis"
3. Wait 200-500ms
4. Latest signal görünəcək
5. Switch to "Trading Setups" tab
6. Switch back to "AI Analysis"
7. Signal hələ də görünməlidir (state persist)

### Scenario 2: Trading Setups
1. Click "Trading Setups" tab
2. Click "Refresh Setups"
3. 10 setup card görünəcək
4. Click on a card → border emerald olacaq
5. Click "Accept Setup" → alert görünəcək

### Scenario 3: Strategy Builder
1. Click "Strategy Builder" tab
2. Click "RSI < 30" rule
3. Rule "Active Rules" panel-ə əlavə olacaq
4. Click "Show Code"
5. Auto-generated kod görünəcək
6. Click "Run Backtest"
7. Mock nəticələr görünəcək

### Scenario 4: Risk Control
1. Click "Risk Control" tab
2. Enter entry price: 43000
3. Enter stop loss: 42500
4. Position size avtomatik hesablanacaq
5. Change risk % to 3%
6. Red warning görünəcək

---

## 🐛 **Debugging**

### Check State
```typescript
// Browser console
import { useTradingStore } from './core/state/store';
import { useTradeStore } from './core/tradeStore';

console.log(useTradingStore.getState());
console.log(useTradeStore.getState());
```

### Check WebSocket
```typescript
import { wsManager } from './core/services/websocket';

console.log('Connected:', wsManager.isConnected());
```

### Check Event Log
```typescript
import { eventBus } from './core/events/eventBus';

console.table(eventBus.getEventLog());
```

---

## 📊 **Performance**

### Lazy Loading
- ✅ Modules yalnız lazım olanda yüklənir
- ✅ Initial bundle size kiçikdir
- ✅ Code splitting avtomatik

### State Management
- ✅ Zustand selectors — yalnız lazım olan state-i oxuyur
- ✅ No unnecessary re-renders
- ✅ DevTools integration

### WebSocket
- ✅ Auto-reconnect (5 attempts)
- ✅ Ping/Pong keep-alive
- ✅ Delta updates (yalnız yeni candle)

---

## 🚀 **Next Steps**

### Phase 1: Core (✅ DONE)
- [x] 4 modul yaradıldı
- [x] Sidebar yaradıldı
- [x] SPA behavior
- [x] Lazy loading
- [x] State management

### Phase 2: Integration
- [ ] Real AI analysis (OpenAI API)
- [ ] Real trading setups (pattern detection)
- [ ] Real backtesting engine
- [ ] Real order execution

### Phase 3: Polish
- [ ] Animations (framer-motion)
- [ ] Keyboard shortcuts
- [ ] Mobile responsive
- [ ] Dark/Light theme toggle

---

**Built with ❤️ for institutional traders**


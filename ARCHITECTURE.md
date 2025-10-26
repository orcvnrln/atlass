# 🏗️ Trading Cockpit — Arxitektura

Bu sənəd sistemin **daxili işləmə mexanizmini** izah edir.

---

## 🎯 Əsas Prinsip

```
User Action → Event → State Update → Side Effects → UI Auto-Sync
```

**Məsələn:**
1. User chart-da symbol dəyişir → `setSymbol('BTCUSDT')`
2. Zustand state yenilənir
3. Event pipeline trigger olur:
   - WebSocket yeni symbol-a subscribe edir
   - Chart yeni data ilə render olur
   - AI context yenilənir (köhnə AI təklifləri təmizlənir)
   - Order panel yeni symbol-a keçir
4. Hər şey **eyni timestamp + symbol context**-də işləyir

---

## 📊 State Management (Zustand)

### Niyə Zustand?
- **Vahid state mənbəyi** — Hər şey bir yerdə
- **No boilerplate** — Redux-dan sadə
- **TypeScript support** — Type-safe
- **Middleware** — DevTools, subscribeWithSelector
- **Performance** — Selective re-renders

### State Structure
```typescript
{
  // Market State
  symbol: 'BTCUSDT',
  timeframe: '15m',
  currentPrice: 43250.50,
  candles: [...],
  lastUpdate: 1234567890,

  // Chart State
  overlays: [...],
  isLoading: false,

  // AI State
  signals: [...],
  isThinking: false,
  lastAnalysis: 1234567890,

  // Order State
  orders: [...],
  positions: [...],

  // UI State
  focusMode: false,
  aiPanelOpen: true,
  orderPanelOpen: true,
}
```

### State Slices
Hər slice öz məsuliyyətinə cavabdehdir:

- **marketSlice** — Symbol, timeframe, price
- **chartSlice** — Chart data, overlays
- **aiSlice** — AI signals, thinking state
- **orderSlice** — Orders, positions
- **uiSlice** — Layout, panels

### Selectors (Performance)
```typescript
// ❌ BAD — Hər dəfə bütün state-i oxuyur
const state = useTradingStore();

// ✅ GOOD — Yalnız lazım olan hissəni oxuyur
const symbol = useTradingStore((state) => state.symbol);
const currentPrice = useTradingStore((state) => state.currentPrice);
```

---

## 🔄 Event Pipeline

### Niyə Event Bus?
- **Decoupling** — Komponentlər bir-birindən asılı deyil
- **Side effects** — State dəyişəndə avtomatik reaksiya
- **Debugging** — Event log-u izləmək asan
- **Scalability** — Yeni event handler əlavə etmək asan

### Event Flow
```
State Change (Zustand)
  ↓
Subscription Trigger
  ↓
Event Emitted
  ↓
Handlers Execute (parallel)
  ↓
Side Effects (WebSocket, AI, etc.)
  ↓
State Updates (if needed)
  ↓
UI Re-renders
```

### Event Types
```typescript
type TradingEvent =
  | { type: 'SYMBOL_CHANGED'; payload: { symbol: string; timestamp: number } }
  | { type: 'TIMEFRAME_CHANGED'; payload: { timeframe: string; timestamp: number } }
  | { type: 'PRICE_UPDATED'; payload: { price: number; timestamp: number } }
  | { type: 'AI_SIGNAL_GENERATED'; payload: { signalId: string; timestamp: number } }
  | { type: 'ORDER_PLACED'; payload: { orderId: string; timestamp: number } }
```

### Event Handlers
```typescript
// Symbol dəyişəndə WebSocket-i yenidən subscribe et
eventBus.on('SYMBOL_CHANGED', ({ payload }) => {
  wsManager.subscribe(payload.symbol, timeframe);
  useTradingStore.getState().clearSignals();
  useTradingStore.getState().clearOverlays('AI');
});
```

---

## 📡 WebSocket Service

### Binance WebSocket API
```
wss://stream.binance.com:9443/ws/{symbol}@kline_{interval}
```

**Məsələn:**
```
wss://stream.binance.com:9443/ws/btcusdt@kline_15m
```

### Connection Lifecycle
```
connect()
  ↓
onopen → startPing()
  ↓
onmessage → handleMessage() → updateState()
  ↓
onerror → log error
  ↓
onclose → attemptReconnect()
```

### Reconnection Strategy
```typescript
reconnectDelay = 2000ms * attemptNumber
maxAttempts = 5

Attempt 1: 2s
Attempt 2: 4s
Attempt 3: 6s
Attempt 4: 8s
Attempt 5: 10s
```

### Message Handling
```typescript
{
  e: 'kline',
  s: 'BTCUSDT',
  k: {
    t: 1234567890,  // timestamp
    o: '43000.00',  // open
    h: '43500.00',  // high
    l: '42800.00',  // low
    c: '43250.00',  // close
    v: '1234.56',   // volume
    x: true         // is closed?
  }
}
```

### State Updates
```typescript
// Real-time price update
useTradingStore.getState().updatePrice(candle.close);

// Candle update (yalnız closed candle)
if (kline.x) {
  const updatedCandles = [...currentCandles, candle].slice(-500);
  useTradingStore.getState().updateCandles(updatedCandles);
}
```

---

## 🤖 AI Service

### OpenAI GPT-4 Integration
```
POST https://api.openai.com/v1/chat/completions
```

### Analysis Flow
```
User clicks "Analyze Market"
  ↓
Prepare market context:
  - Recent candles (last 50)
  - Technical indicators (SMA, RSI)
  - Price action
  ↓
Call OpenAI API
  ↓
Parse JSON response
  ↓
Create AISignal
  ↓
Add to store
  ↓
Create chart overlays (Entry, SL, TP)
  ↓
UI updates
```

### Market Context
```typescript
{
  symbol: 'BTCUSDT',
  timeframe: '15m',
  currentPrice: 43250.50,
  priceChange: +2.34%,
  sma20: 43100.00,
  sma50: 42800.00,
  rsi14: 62.5,
  recentHigh: 43500.00,
  recentLow: 42500.00,
  recentCandles: [...]
}
```

### AI Response Format
```json
{
  "side": "BUY",
  "entry": 43250.00,
  "stopLoss": 42800.00,
  "takeProfit": 44200.00,
  "confidence": 75,
  "reasoning": "Price broke above SMA20, RSI showing bullish momentum..."
}
```

### Chart Overlays
AI signal yarandıqda avtomatik chart-a əlavə olunur:

- **Entry Line** — Dotted line (green/red)
- **Stop Loss** — Dashed line (red)
- **Take Profit** — Dashed line (green)

---

## 📊 Chart (Plotly.js)

### Niyə Plotly.js?
- **HTML overlays** — AI markup üçün ideal
- **Real-time updates** — `Plotly.react()` efficient
- **Professional** — Bloomberg tərzi görünüş
- **Annotations** — Entry, SL, TP lines

### Chart Data Structure
```typescript
{
  type: 'candlestick',
  x: [timestamps],
  open: [opens],
  high: [highs],
  low: [lows],
  close: [closes],
  increasing: { line: { color: '#10b981' } },
  decreasing: { line: { color: '#ef4444' } },
}
```

### Overlays (Shapes)
```typescript
{
  type: 'line',
  y0: 43250,
  y1: 43250,
  line: { color: '#10b981', width: 2, dash: 'dot' },
  label: { text: 'AI Entry' },
}
```

### Update Strategy
```typescript
// Initial render
Plotly.newPlot(chartRef, data, layout, config);

// Subsequent updates (efficient)
Plotly.react(chartRef, data, layout, config);
```

---

## 🎨 UI/UX Design

### Bloomberg Terminal Principles
1. **Information Density** — Çox məlumat, az yer
2. **Dark Theme** — Göz yorğunluğunu azaldır
3. **Monospace Fonts** — Rəqəmlər üçün dəqiqlik
4. **Grid Layout** — Professional workspace
5. **Minimal Animations** — Performans prioritet

### Color System
```css
/* Background Layers */
--bg-base: #111827;      /* gray-950 */
--bg-panel: #1f2937;     /* gray-900 */
--bg-elevated: #374151;  /* gray-800 */

/* Text */
--text-primary: #e5e7eb;   /* gray-200 */
--text-secondary: #9ca3af; /* gray-400 */
--text-muted: #6b7280;     /* gray-500 */

/* Accent */
--accent: #3b82f6;  /* blue-500 */
--buy: #10b981;     /* green-500 */
--sell: #ef4444;    /* red-500 */
```

### Layout Grid
```
┌─────────────────────────────────────────────────────────┐
│ Top Bar (56px)                                          │
├──────────┬──────────────────────────────┬───────────────┤
│          │                              │               │
│  Order   │         Chart                │  AI Panel     │
│  Panel   │       (Plotly.js)            │  (Signals)    │
│ (320px)  │                              │   (384px)     │
│          │                              │               │
└──────────┴──────────────────────────────┴───────────────┘
```

### Focus Mode
```
┌─────────────────────────────────────────────────────────┐
│ Top Bar (56px)                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│                    Chart (Full Width)                   │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Performance Optimizations

### 1. Zustand Selectors
```typescript
// ❌ BAD — Component re-renders on ANY state change
const state = useTradingStore();

// ✅ GOOD — Component re-renders only when symbol changes
const symbol = useTradingStore((state) => state.symbol);
```

### 2. React.memo
```typescript
export const PlotlyChart = React.memo(() => {
  // ...
});
```

### 3. useMemo
```typescript
const chartData = useMemo(() => {
  // Heavy calculation
  return processCandles(candles);
}, [candles]);
```

### 4. Debounced Events
```typescript
const debouncedEmit = createDebouncedEmitter('PRICE_UPDATED', 300);
```

### 5. Delta Updates
```typescript
// ❌ BAD — Replace entire array
setCandles([...newCandles]);

// ✅ GOOD — Append only new candle
setCandles([...candles, newCandle].slice(-500));
```

---

## 🐛 Debugging

### 1. Event Log
```typescript
import { eventBus } from './core/events/eventBus';

const log = eventBus.getEventLog();
console.table(log);
```

### 2. State Snapshot
```typescript
import { useTradingStore } from './core/state/store';

const state = useTradingStore.getState();
console.log(JSON.stringify(state, null, 2));
```

### 3. Zustand DevTools
Redux DevTools extension ilə işləyir:
```
Redux DevTools → TradingStore
```

### 4. WebSocket Status
```typescript
console.log('Connected:', wsManager.isConnected());
```

---

## 🚀 Deployment

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Environment Variables
```bash
VITE_OPENAI_API_KEY=sk-...
```

---

## 📝 Next Steps

### Phase 1: Core (✅ DONE)
- [x] State management (Zustand)
- [x] Event pipeline
- [x] WebSocket integration
- [x] AI service
- [x] Chart (Plotly.js)
- [x] Order panel
- [x] Layout

### Phase 2: Execution
- [ ] Real order execution (Binance API)
- [ ] Position management
- [ ] PnL tracking
- [ ] Risk management

### Phase 3: Advanced
- [ ] Technical indicators (EMA, Bollinger Bands)
- [ ] Multi-timeframe analysis
- [ ] Backtesting engine
- [ ] Alerts & notifications

### Phase 4: Scale
- [ ] WebSocket reconnection improvements
- [ ] Offline mode (local cache)
- [ ] Mobile responsive
- [ ] Multi-account support

---

**Bu, institutional-grade trading platform-un beyin və sinir sistemidir.**


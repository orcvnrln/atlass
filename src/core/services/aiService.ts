/**
 * 🤖 AI SERVICE
 * AI-powered trade analysis və signal generation
 * OpenAI GPT-4 integration
 */

import { useTradingStore, AISignal, Candle } from '../state/store';
import { eventBus } from '../events/eventBus';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface AIAnalysisRequest {
  symbol: string;
  timeframe: string;
  candles: Candle[];
  currentPrice: number;
  context?: string; // User prompt
}

interface AIAnalysisResponse {
  side: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  reasoning: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI SERVICE
// ─────────────────────────────────────────────────────────────────────────────

class AIService {
  private apiKey: string = import.meta.env.VITE_OPENAI_API_KEY || '';
  private model: string = 'gpt-4-turbo-preview';
  private baseUrl: string = 'https://api.openai.com/v1/chat/completions';

  /**
   * Market analiz et və signal generate et
   */
  async analyzeMarket(request: AIAnalysisRequest): Promise<AISignal | null> {
    const store = useTradingStore.getState();
    store.setThinking(true);

    try {
      // Prepare market context
      const marketContext = this.prepareMarketContext(request);

      // Call OpenAI API
      const response = await this.callOpenAI(marketContext, request.context);

      // Parse response
      const analysis = this.parseAIResponse(response);

      if (!analysis) {
        throw new Error('Failed to parse AI response');
      }

      // Calculate R/R ratio
      const rrRatio = this.calculateRRRatio(
        analysis.entry,
        analysis.stopLoss,
        analysis.takeProfit
      );

      // Create signal
      const signal: AISignal = {
        id: `ai_${Date.now()}`,
        timestamp: Date.now(),
        symbol: request.symbol,
        side: analysis.side,
        entry: analysis.entry,
        stopLoss: analysis.stopLoss,
        takeProfit: analysis.takeProfit,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        rrRatio,
      };

      // Add to store
      store.addSignal(signal);

      // Create chart overlay
      this.createChartOverlay(signal);

      return signal;
    } catch (error) {
      console.error('[AI] Analysis error:', error);
      return null;
    } finally {
      store.setThinking(false);
    }
  }

  /**
   * Market context hazırla (AI üçün)
   */
  private prepareMarketContext(request: AIAnalysisRequest): string {
    const { symbol, timeframe, candles, currentPrice } = request;

    // Son 50 candle-ı götür
    const recentCandles = candles.slice(-50);

    // Technical indicators (sadə versiya)
    const sma20 = this.calculateSMA(recentCandles, 20);
    const sma50 = this.calculateSMA(recentCandles, 50);
    const rsi = this.calculateRSI(recentCandles, 14);

    // Price action
    const priceChange = recentCandles.length > 1
      ? ((currentPrice - recentCandles[0].close) / recentCandles[0].close) * 100
      : 0;

    return `
Market Analysis Context:
- Symbol: ${symbol}
- Timeframe: ${timeframe}
- Current Price: ${currentPrice}
- Price Change (50 candles): ${priceChange.toFixed(2)}%
- SMA 20: ${sma20.toFixed(2)}
- SMA 50: ${sma50.toFixed(2)}
- RSI (14): ${rsi.toFixed(2)}
- Recent High: ${Math.max(...recentCandles.map(c => c.high))}
- Recent Low: ${Math.min(...recentCandles.map(c => c.low))}

Recent Price Action (last 10 candles):
${recentCandles.slice(-10).map(c => 
  `[${new Date(c.timestamp).toISOString()}] O:${c.open} H:${c.high} L:${c.low} C:${c.close}`
).join('\n')}
    `.trim();
  }

  /**
   * OpenAI API çağır
   */
  private async callOpenAI(marketContext: string, userPrompt?: string): Promise<string> {
    const systemPrompt = `
You are an expert institutional trader with 20+ years of experience in algorithmic trading.
Analyze the market data and provide a trading signal.

IMPORTANT:
- Be conservative — only suggest trades with high probability
- Always provide clear entry, stop-loss, and take-profit levels
- Explain your reasoning based on technical analysis
- Confidence should be 0-100 (only suggest if >60)

Response format (JSON):
{
  "side": "BUY" or "SELL",
  "entry": <price>,
  "stopLoss": <price>,
  "takeProfit": <price>,
  "confidence": <0-100>,
  "reasoning": "<explanation>"
}
    `.trim();

    const userMessage = `
${marketContext}

${userPrompt ? `User Request: ${userPrompt}` : 'Provide a trading signal based on current market conditions.'}
    `.trim();

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * AI response-u parse et
   */
  private parseAIResponse(response: string): AIAnalysisResponse | null {
    try {
      // Extract JSON from response (AI bəzən markdown ilə wrap edir)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        side: parsed.side,
        entry: parseFloat(parsed.entry),
        stopLoss: parseFloat(parsed.stopLoss),
        takeProfit: parseFloat(parsed.takeProfit),
        confidence: parseInt(parsed.confidence),
        reasoning: parsed.reasoning,
      };
    } catch (error) {
      console.error('[AI] Response parse error:', error);
      return null;
    }
  }

  /**
   * Chart overlay yarat (AI signal üçün)
   */
  private createChartOverlay(signal: AISignal): void {
    const store = useTradingStore.getState();

    // Entry line
    store.addOverlay({
      id: `${signal.id}_entry`,
      type: 'line',
      source: 'AI',
      data: {
        type: 'line',
        y0: signal.entry,
        y1: signal.entry,
        line: { color: signal.side === 'BUY' ? '#10b981' : '#ef4444', width: 2, dash: 'dot' },
        label: { text: 'AI Entry', font: { size: 10 } },
      },
    });

    // Stop Loss
    store.addOverlay({
      id: `${signal.id}_sl`,
      type: 'line',
      source: 'AI',
      data: {
        type: 'line',
        y0: signal.stopLoss,
        y1: signal.stopLoss,
        line: { color: '#ef4444', width: 1, dash: 'dash' },
        label: { text: 'SL', font: { size: 10 } },
      },
    });

    // Take Profit
    store.addOverlay({
      id: `${signal.id}_tp`,
      type: 'line',
      source: 'AI',
      data: {
        type: 'line',
        y0: signal.takeProfit,
        y1: signal.takeProfit,
        line: { color: '#10b981', width: 1, dash: 'dash' },
        label: { text: 'TP', font: { size: 10 } },
      },
    });
  }

  // ─── TECHNICAL INDICATORS ───

  private calculateSMA(candles: Candle[], period: number): number {
    const closes = candles.slice(-period).map(c => c.close);
    return closes.reduce((a, b) => a + b, 0) / closes.length;
  }

  private calculateRSI(candles: Candle[], period: number): number {
    const closes = candles.slice(-period - 1).map(c => c.close);
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateRRRatio(entry: number, stopLoss: number, takeProfit: number): number {
    const risk = Math.abs(entry - stopLoss);
    const reward = Math.abs(takeProfit - entry);
    return reward / risk;
  }
}

export const aiService = new AIService();

// ─────────────────────────────────────────────────────────────────────────────
// EVENT HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Symbol dəyişəndə AI context-i reset et
 */
eventBus.on('SYMBOL_CHANGED', () => {
  console.log('[AI] Symbol changed, clearing signals');
  useTradingStore.getState().clearSignals();
  useTradingStore.getState().clearOverlays('AI');
});


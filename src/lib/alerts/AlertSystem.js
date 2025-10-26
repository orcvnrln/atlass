/**
 * Alert System
 * Comprehensive alert system with Telegram and Email notifications
 */

export class AlertSystem {
  constructor(config = {}) {
    this.config = {
      telegram: {
        enabled: config.telegram?.enabled || false,
        botToken: config.telegram?.botToken || '',
        chatId: config.telegram?.chatId || ''
      },
      email: {
        enabled: config.email?.enabled || false,
        apiKey: config.email?.apiKey || '',
        from: config.email?.from || '',
        to: config.email?.to || ''
      },
      ...config
    };
    
    this.alerts = [];
    this.rules = [];
    this.listeners = [];
  }

  /**
   * Add alert rule
   */
  addRule(rule) {
    const alertRule = {
      id: this.generateRuleId(),
      name: rule.name,
      type: rule.type, // 'price', 'indicator', 'performance', 'risk'
      condition: rule.condition,
      threshold: rule.threshold,
      symbol: rule.symbol,
      enabled: rule.enabled !== false,
      channels: rule.channels || ['notification'], // 'notification', 'telegram', 'email'
      cooldown: rule.cooldown || 300000, // 5 minutes default
      lastTriggered: null,
      createdAt: Date.now()
    };

    this.rules.push(alertRule);
    this.emit('ruleAdded', alertRule);
    
    return alertRule;
  }

  /**
   * Remove alert rule
   */
  removeRule(ruleId) {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      const rule = this.rules[index];
      this.rules.splice(index, 1);
      this.emit('ruleRemoved', rule);
      return true;
    }
    return false;
  }

  /**
   * Update alert rule
   */
  updateRule(ruleId, updates) {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      Object.assign(rule, updates);
      this.emit('ruleUpdated', rule);
      return rule;
    }
    return null;
  }

  /**
   * Check all rules against current data
   */
  checkRules(data) {
    const triggeredAlerts = [];

    this.rules.forEach(rule => {
      if (!rule.enabled) return;

      // Check cooldown
      if (rule.lastTriggered && (Date.now() - rule.lastTriggered) < rule.cooldown) {
        return;
      }

      const triggered = this.evaluateRule(rule, data);
      
      if (triggered) {
        const alert = this.createAlert(rule, data);
        triggeredAlerts.push(alert);
        this.sendAlert(alert);
        rule.lastTriggered = Date.now();
      }
    });

    return triggeredAlerts;
  }

  /**
   * Evaluate a single rule
   */
  evaluateRule(rule, data) {
    switch (rule.type) {
      case 'price':
        return this.evaluatePriceRule(rule, data);
      case 'indicator':
        return this.evaluateIndicatorRule(rule, data);
      case 'performance':
        return this.evaluatePerformanceRule(rule, data);
      case 'risk':
        return this.evaluateRiskRule(rule, data);
      default:
        return false;
    }
  }

  /**
   * Evaluate price-based rule
   */
  evaluatePriceRule(rule, data) {
    const price = data.price?.[rule.symbol] || data.currentPrice;
    if (!price) return false;

    switch (rule.condition) {
      case 'above':
        return price > rule.threshold;
      case 'below':
        return price < rule.threshold;
      case 'crosses_above':
        return data.previousPrice < rule.threshold && price >= rule.threshold;
      case 'crosses_below':
        return data.previousPrice > rule.threshold && price <= rule.threshold;
      case 'change_percent':
        const changePercent = ((price - data.previousPrice) / data.previousPrice) * 100;
        return Math.abs(changePercent) >= rule.threshold;
      default:
        return false;
    }
  }

  /**
   * Evaluate indicator-based rule
   */
  evaluateIndicatorRule(rule, data) {
    const indicator = data.indicators?.[rule.indicator];
    if (indicator === undefined) return false;

    switch (rule.condition) {
      case 'above':
        return indicator > rule.threshold;
      case 'below':
        return indicator < rule.threshold;
      case 'crosses_above':
        return data.previousIndicators?.[rule.indicator] < rule.threshold && indicator >= rule.threshold;
      case 'crosses_below':
        return data.previousIndicators?.[rule.indicator] > rule.threshold && indicator <= rule.threshold;
      default:
        return false;
    }
  }

  /**
   * Evaluate performance-based rule
   */
  evaluatePerformanceRule(rule, data) {
    const metrics = data.metrics;
    if (!metrics) return false;

    const value = metrics[rule.metric];
    if (value === undefined) return false;

    switch (rule.condition) {
      case 'above':
        return value > rule.threshold;
      case 'below':
        return value < rule.threshold;
      default:
        return false;
    }
  }

  /**
   * Evaluate risk-based rule
   */
  evaluateRiskRule(rule, data) {
    const risk = data.risk;
    if (!risk) return false;

    const value = risk[rule.metric];
    if (value === undefined) return false;

    switch (rule.condition) {
      case 'above':
        return value > rule.threshold;
      case 'below':
        return value < rule.threshold;
      default:
        return false;
    }
  }

  /**
   * Create alert from triggered rule
   */
  createAlert(rule, data) {
    const alert = {
      id: this.generateAlertId(),
      ruleId: rule.id,
      ruleName: rule.name,
      type: rule.type,
      symbol: rule.symbol,
      message: this.generateAlertMessage(rule, data),
      severity: this.determineAlertSeverity(rule, data),
      data: data,
      channels: rule.channels,
      timestamp: Date.now(),
      acknowledged: false
    };

    this.alerts.push(alert);
    this.emit('alertTriggered', alert);

    return alert;
  }

  /**
   * Generate alert message
   */
  generateAlertMessage(rule, data) {
    let message = `Alert: ${rule.name}\n`;
    
    switch (rule.type) {
      case 'price':
        const price = data.price?.[rule.symbol] || data.currentPrice;
        message += `${rule.symbol} price ${rule.condition} ${rule.threshold}\n`;
        message += `Current price: ${price?.toFixed(2)}`;
        break;
      
      case 'indicator':
        const indicator = data.indicators?.[rule.indicator];
        message += `${rule.indicator} ${rule.condition} ${rule.threshold}\n`;
        message += `Current value: ${indicator?.toFixed(2)}`;
        break;
      
      case 'performance':
        const perfValue = data.metrics?.[rule.metric];
        message += `${rule.metric} ${rule.condition} ${rule.threshold}\n`;
        message += `Current value: ${perfValue?.toFixed(2)}`;
        break;
      
      case 'risk':
        const riskValue = data.risk?.[rule.metric];
        message += `${rule.metric} ${rule.condition} ${rule.threshold}\n`;
        message += `Current value: ${riskValue?.toFixed(2)}`;
        break;
    }

    return message;
  }

  /**
   * Determine alert severity
   */
  determineAlertSeverity(rule, data) {
    // Simple severity determination - can be enhanced
    if (rule.type === 'risk') {
      return 'high';
    } else if (rule.type === 'performance') {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Send alert through configured channels
   */
  async sendAlert(alert) {
    const promises = [];

    alert.channels.forEach(channel => {
      switch (channel) {
        case 'telegram':
          if (this.config.telegram.enabled) {
            promises.push(this.sendTelegramAlert(alert));
          }
          break;
        
        case 'email':
          if (this.config.email.enabled) {
            promises.push(this.sendEmailAlert(alert));
          }
          break;
        
        case 'notification':
          this.sendBrowserNotification(alert);
          break;
      }
    });

    try {
      await Promise.all(promises);
      alert.sent = true;
    } catch (error) {
      console.error('Error sending alert:', error);
      alert.error = error.message;
    }
  }

  /**
   * Send Telegram alert
   */
  async sendTelegramAlert(alert) {
    if (!this.config.telegram.botToken || !this.config.telegram.chatId) {
      console.warn('Telegram not configured');
      return;
    }

    const url = `https://api.telegram.org/bot${this.config.telegram.botToken}/sendMessage`;
    
    const message = `🚨 *${alert.ruleName}*\n\n${alert.message}\n\n_${new Date(alert.timestamp).toLocaleString()}_`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: this.config.telegram.chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`);
      }

      console.log('Telegram alert sent successfully');
    } catch (error) {
      console.error('Failed to send Telegram alert:', error);
      throw error;
    }
  }

  /**
   * Send Email alert
   */
  async sendEmailAlert(alert) {
    // This is a placeholder - implement with your email service (SendGrid, AWS SES, etc.)
    console.log('Email alert would be sent:', alert);
    
    // Example with a generic email API
    /*
    const response = await fetch('https://api.emailservice.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.email.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: this.config.email.from,
        to: this.config.email.to,
        subject: `Trading Alert: ${alert.ruleName}`,
        text: alert.message,
        html: this.generateEmailHTML(alert)
      })
    });
    */
  }

  /**
   * Send browser notification
   */
  sendBrowserNotification(alert) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(alert.ruleName, {
        body: alert.message,
        icon: '/icon.png',
        badge: '/badge.png',
        tag: alert.id
      });
    }
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedAt = Date.now();
      this.emit('alertAcknowledged', alert);
      return true;
    }
    return false;
  }

  /**
   * Get all alerts
   */
  getAlerts(filter = {}) {
    let filtered = [...this.alerts];

    if (filter.acknowledged !== undefined) {
      filtered = filtered.filter(a => a.acknowledged === filter.acknowledged);
    }

    if (filter.severity) {
      filtered = filtered.filter(a => a.severity === filter.severity);
    }

    if (filter.type) {
      filtered = filtered.filter(a => a.type === filter.type);
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Clear old alerts
   */
  clearOldAlerts(maxAge = 86400000) { // 24 hours default
    const cutoff = Date.now() - maxAge;
    this.alerts = this.alerts.filter(a => a.timestamp > cutoff || !a.acknowledged);
  }

  // Helper methods
  generateRuleId() {
    return `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Event system
  on(event, callback) {
    this.listeners.push({ event, callback });
  }

  emit(event, data) {
    this.listeners
      .filter(l => l.event === event)
      .forEach(l => l.callback(data));
  }
}


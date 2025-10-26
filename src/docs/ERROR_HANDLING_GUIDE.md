# Comprehensive Error Handling Guide

This guide covers the complete error handling strategy implemented in the application, including graceful degradation, user-friendly error messages, offline support, and error logging.

## 🏗️ Architecture Overview

The error handling system is built with multiple layers:

1. **Error Logging Service** - Centralized error tracking and reporting
2. **React Error Boundaries** - Catch and handle React component errors
3. **API Error Handling** - Automatic handling of network and API errors
4. **Validation System** - Comprehensive form and data validation
5. **Offline Support** - Graceful handling of network connectivity issues
6. **User Interface** - Toast notifications, alerts, and error displays

## 📁 File Structure

```
src/
├── lib/
│   ├── errorHandler.js          # Core error handling utilities
│   ├── apiErrorHandler.js       # API-specific error handling
│   └── validation.js            # Form validation system
├── components/errors/
│   ├── ErrorBoundary.jsx        # React error boundary
│   ├── ErrorAlert.jsx           # Alert component for errors
│   ├── ErrorToast.jsx           # Toast notification component
│   ├── ToastManager.jsx         # Toast management system
│   └── OfflineIndicator.jsx     # Network status indicator
├── context/
│   └── ErrorContext.jsx         # Error context provider
├── hooks/
│   └── useOffline.js           # Offline detection hook
└── components/examples/
    └── ErrorHandlingExamples.jsx # Usage examples
```

## 🚀 Quick Start

### 1. Basic Setup

The error handling is already integrated into your app through the `ErrorProvider` in `App.jsx`:

```jsx
import { ErrorProvider } from './context/ErrorContext';
import ErrorBoundary from './components/errors/ErrorBoundary';

function App() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        {/* Your app content */}
      </ErrorBoundary>
    </ErrorProvider>
  );
}
```

### 2. API Error Handling

Use the enhanced API utilities for automatic error handling:

```jsx
import { api, apiWithRetry } from '@/lib/apiErrorHandler';

// Basic API call with error handling
try {
  const data = await api.get('/api/users');
  console.log(data);
} catch (error) {
  // Error is automatically logged and user is notified
  console.log('API call failed:', error);
}

// API call with retry logic
try {
  const data = await apiWithRetry.get('/api/unreliable-endpoint', {
    retries: 3,
    retryDelay: 1000
  });
} catch (error) {
  // Failed after all retry attempts
}
```

### 3. Form Validation

Implement comprehensive form validation:

```jsx
import { useFormValidation, commonSchemas } from '@/lib/validation';

function MyForm() {
  const {
    data,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateForm
  } = useFormValidation(commonSchemas.trading);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateForm();
    
    if (result.isValid) {
      // Submit form
    } else {
      // Show validation errors
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={data.amount || ''}
        onChange={(e) => setFieldValue('amount', e.target.value)}
        onBlur={() => setFieldTouched('amount')}
      />
      <ValidationError error={errors.amount} />
    </form>
  );
}
```

### 4. Toast Notifications

Show user-friendly error messages:

```jsx
// Show error toast
window.showToast({
  type: 'error',
  title: 'Network Error',
  message: 'Unable to connect to the server',
  duration: 5000
});

// Show success toast
window.showToast({
  type: 'success',
  title: 'Success',
  message: 'Data saved successfully',
  duration: 3000
});
```

## 🔧 Advanced Usage

### Custom Error Boundary

Create custom error boundaries for specific components:

```jsx
import ErrorBoundary from '@/components/errors/ErrorBoundary';

const CustomErrorFallback = ({ error, retry, goHome }) => (
  <div className="error-container">
    <h2>Oops! Something went wrong</h2>
    <p>{error.message}</p>
    <button onClick={retry}>Try Again</button>
    <button onClick={goHome}>Go Home</button>
  </div>
);

function MyComponent() {
  return (
    <ErrorBoundary fallback={CustomErrorFallback}>
      <RiskyComponent />
    </ErrorBoundary>
  );
}
```

### Offline Detection

Monitor network status and handle offline scenarios:

```jsx
import { useOffline } from '@/hooks/useOffline';

function NetworkStatus() {
  const { isOffline, connectionQuality } = useOffline();

  return (
    <div>
      {isOffline ? (
        <span>You're offline</span>
      ) : (
        <span>Online ({connectionQuality})</span>
      )}
    </div>
  );
}
```

### Custom Validation Rules

Create custom validation rules:

```jsx
import { validators } from '@/lib/validation';

const customValidators = {
  ...validators,
  customRule: (value, fieldName) => {
    if (value && value.length < 5) {
      return `${fieldName} must be at least 5 characters`;
    }
    return null;
  }
};

const schema = {
  username: [
    validators.required,
    validators.minLength(3),
    customValidators.customRule
  ]
};
```

### Error Recovery Strategies

Implement custom error recovery:

```jsx
import { createErrorRecovery } from '@/lib/errorHandler';

const recoveryStrategies = {
  NETWORK_ERROR: async (error, context) => {
    // Wait for connection to be restored
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (navigator.onLine) {
          resolve('Connection restored');
        } else {
          setTimeout(checkConnection, 1000);
        }
      };
      checkConnection();
    });
  },
  
  API_ERROR: async (error, context) => {
    // Retry with exponential backoff
    await new Promise(resolve => setTimeout(resolve, 2000));
    return 'Retrying request';
  }
};

const errorRecovery = createErrorRecovery(recoveryStrategies);
```

## 🎨 UI Components

### ErrorAlert

Display persistent error messages:

```jsx
import ErrorAlert from '@/components/errors/ErrorAlert';

<ErrorAlert
  type="error"
  title="Connection Failed"
  message="Unable to connect to the server"
  actions={[
    { label: 'Retry', onClick: handleRetry },
    { label: 'Cancel', onClick: handleCancel }
  ]}
/>
```

### ToastManager

Manage multiple toast notifications:

```jsx
import ToastManager from '@/components/errors/ToastManager';

function App() {
  return (
    <ToastManager>
      {/* Your app content */}
    </ToastManager>
  );
}
```

### OfflineIndicator

Show network status:

```jsx
import OfflineIndicator from '@/components/errors/OfflineIndicator';

// Show indicator in bottom-left corner
<OfflineIndicator position="bottom-left" />

// Show indicator when online too
<OfflineIndicator showWhenOnline={true} />
```

## 📊 Error Logging

### Automatic Logging

All errors are automatically logged with context:

- Error type and severity
- Stack trace and component stack
- User context and session data
- URL and user agent
- Timestamp and error ID

### Manual Logging

Log custom errors:

```jsx
import { errorLogger, ERROR_TYPES, ERROR_SEVERITY } from '@/lib/errorHandler';

errorLogger.log({
  type: ERROR_TYPES.CUSTOM,
  severity: ERROR_SEVERITY.MEDIUM,
  message: 'Custom error occurred',
  context: { userId: 123, action: 'purchase' }
});
```

### Error Retrieval

Access logged errors:

```jsx
const errors = errorLogger.getErrors();
console.log('Recent errors:', errors);

// Clear old errors
errorLogger.clearErrors();
```

## 🔒 Error Types and Severity

### Error Types

- `NETWORK_ERROR` - Network connectivity issues
- `API_ERROR` - HTTP/API request failures
- `VALIDATION_ERROR` - Form/data validation failures
- `AUTHENTICATION_ERROR` - Authentication failures
- `PERMISSION_ERROR` - Authorization failures
- `COMPONENT_ERROR` - React component errors
- `UNKNOWN_ERROR` - Unclassified errors

### Severity Levels

- `LOW` - Minor issues, user can continue
- `MEDIUM` - Moderate issues, may affect functionality
- `HIGH` - Serious issues, significant impact
- `CRITICAL` - Critical issues, app may be unusable

## 🌐 Offline Support

### Request Queue

Failed requests are automatically queued when offline:

```jsx
import { requestQueue } from '@/lib/apiErrorHandler';

// Add request to queue
requestQueue.add({
  url: '/api/data',
  options: { method: 'POST', body: JSON.stringify(data) }
});

// Process queue when back online
requestQueue.processQueue();

// Get queued requests
const queued = requestQueue.getQueue();
```

### Offline Detection

Monitor network status:

```jsx
import { setupOfflineHandling } from '@/lib/errorHandler';

// Setup offline handling
const cleanup = setupOfflineHandling();

// Listen for events
window.addEventListener('app-online', () => {
  console.log('App is back online');
});

window.addEventListener('app-offline', () => {
  console.log('App went offline');
});
```

## 🧪 Testing Error Scenarios

Visit `/error-examples` to test all error handling features:

- Network error simulation
- API error handling
- Form validation
- Retry logic
- Offline scenarios
- Error boundary testing

## 🔧 Configuration

### Environment Variables

```bash
# Development mode - errors logged to console
NODE_ENV=development

# Production mode - errors sent to external service
NODE_ENV=production
```

### Custom Configuration

```jsx
// Custom error logger
const customLogger = new ErrorLogger({
  maxErrors: 200,
  externalServiceUrl: '/api/logs/error'
});

// Custom API configuration
const apiConfig = {
  timeout: 15000,
  retries: 5,
  retryDelay: 2000
};
```

## 📈 Best Practices

### 1. Error Boundary Placement

Place error boundaries strategically:

```jsx
// App-level boundary
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Feature-level boundaries
<ErrorBoundary name="TradingModule">
  <TradingInterface />
</ErrorBoundary>

// Component-level boundaries for critical components
<ErrorBoundary name="ChartComponent">
  <TradingChart />
</ErrorBoundary>
```

### 2. User-Friendly Messages

Always provide clear, actionable error messages:

```jsx
// ❌ Bad
window.showToast({
  message: 'Error 500'
});

// ✅ Good
window.showToast({
  title: 'Server Error',
  message: 'We\'re experiencing technical difficulties. Please try again in a few minutes.',
  actions: [{ label: 'Retry', onClick: retryAction }]
});
```

### 3. Graceful Degradation

Provide fallbacks for critical features:

```jsx
function ChartComponent() {
  const [chartError, setChartError] = useState(null);

  if (chartError) {
    return (
      <div className="chart-fallback">
        <h3>Chart Unavailable</h3>
        <p>Please try refreshing the page or contact support.</p>
        <button onClick={() => setChartError(null)}>
          Try Again
        </button>
      </div>
    );
  }

  return <TradingChart onError={setChartError} />;
}
```

### 4. Validation Timing

Validate at appropriate times:

```jsx
const { setFieldTouched, validateField } = useFormValidation(schema);

// Validate on blur (user finished typing)
<input onBlur={() => setFieldTouched('email')} />

// Validate on change (real-time feedback)
<input onChange={(e) => {
  setFieldValue('email', e.target.value);
  if (touched.email) {
    validateField('email', e.target.value);
  }
}} />
```

## 🚨 Common Error Scenarios

### Network Failures

```jsx
// Handle network timeouts
try {
  const data = await api.get('/api/data', {}, { timeout: 10000 });
} catch (error) {
  if (error.type === 'TIMEOUT_ERROR') {
    // Handle timeout specifically
  }
}
```

### API Rate Limiting

```jsx
// Handle rate limiting
try {
  const data = await api.get('/api/data');
} catch (error) {
  if (error.response?.status === 429) {
    // Show rate limit message
    window.showToast({
      type: 'warning',
      title: 'Rate Limited',
      message: 'Too many requests. Please wait a moment.',
      duration: 5000
    });
  }
}
```

### Authentication Errors

```jsx
// Handle auth errors
try {
  const data = await api.get('/api/protected');
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
    window.location.href = '/login';
  }
}
```

## 📚 Additional Resources

- [React Error Boundaries Documentation](https://reactjs.org/docs/error-boundaries.html)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Web APIs - Network Information](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)

## 🆘 Troubleshooting

### Common Issues

1. **Toasts not showing**: Ensure `ToastManager` wraps your app
2. **Errors not logging**: Check console for error logger initialization
3. **Offline detection not working**: Verify event listeners are properly set up
4. **Validation not triggering**: Check if fields are marked as touched

### Debug Mode

Enable debug logging:

```jsx
// In development, all errors are logged to console
// In production, check the error logger for details
const errors = errorLogger.getErrors();
console.log('All logged errors:', errors);
```

---

This comprehensive error handling system provides robust error management, user-friendly feedback, and graceful degradation for your web application. All components work together to ensure a smooth user experience even when things go wrong.

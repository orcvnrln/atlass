import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import ErrorAlert from '@/components/errors/ErrorAlert';
import { useFormValidation, ValidationError, ValidatedField, commonSchemas } from '@/lib/validation';
import { api, apiWithRetry } from '@/lib/apiErrorHandler';

const ErrorHandlingExamples = () => {
  const [showErrorBoundary, setShowErrorBoundary] = useState(false);
  
  // Form validation example
  const {
    data: formData,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateForm,
    reset: resetForm
  } = useFormValidation(commonSchemas.trading);

  // Component that will throw an error for ErrorBoundary demo
  const ErrorThrowingComponent = () => {
    throw new Error('This is a test error for the ErrorBoundary!');
  };

  const handleNetworkError = async () => {
    try {
      await api.get('/api/nonexistent-endpoint');
    } catch (error) {
      // Error is automatically handled by apiRequest
      console.log('Network error handled:', error);
    }
  };

  const handleAPIError = async () => {
    try {
      await api.post('/api/test-error', { test: 'data' });
    } catch (error) {
      // Error is automatically handled
      console.log('API error handled:', error);
    }
  };

  const handleValidationError = () => {
    const result = validateForm();
    if (!result.isValid) {
      console.log('Validation errors:', result.errors);
    }
  };

  const handleRetryRequest = async () => {
    try {
      const result = await apiWithRetry.get('/api/unreliable-endpoint', {
        retries: 3,
        retryDelay: 1000
      });
      console.log('Retry successful:', result);
    } catch (error) {
      console.log('Retry failed after all attempts:', error);
    }
  };

  const handleOfflineTest = () => {
    // Simulate offline scenario
    window.dispatchEvent(new Event('offline'));
    
    // Try to make a request while offline
    setTimeout(() => {
      api.get('/api/test').catch(console.log);
    }, 1000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const result = validateForm();
    
    if (result.isValid) {
      window.showToast?.({
        type: 'success',
        title: 'Form Valid',
        message: 'All validation passed!',
        duration: 3000
      });
    } else {
      window.showToast?.({
        type: 'error',
        title: 'Validation Failed',
        message: 'Please correct the errors and try again.',
        duration: 5000
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Error Handling Examples</h1>

      {/* Error Alert Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Error Alerts</h2>
        
        <ErrorAlert
          type="error"
          title="Network Error"
          message="Unable to connect to the server. Please check your connection."
          actions={[
            { label: 'Retry', onClick: handleNetworkError },
            { label: 'Cancel', onClick: () => console.log('Cancelled') }
          ]}
        />

        <ErrorAlert
          type="warning"
          title="Maintenance Mode"
          message="The system will be under maintenance from 2 AM to 4 AM EST."
          dismissible={false}
        />

        <ErrorAlert
          type="info"
          title="New Feature Available"
          message="Check out our new advanced charting tools in the trading section."
          autoHide={true}
          duration={8000}
        />

        <ErrorAlert
          type="success"
          title="Trade Executed"
          message="Your order has been successfully placed and is now active."
          autoHide={true}
          duration={3000}
        />
      </section>

      {/* Form Validation Example */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Form Validation</h2>
        
        <form onSubmit={handleFormSubmit} className="bg-gray-900 p-6 rounded-lg">
          <ValidatedField
            name="amount"
            error={errors.amount}
            touched={touched.amount}
            required
          >
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={formData.amount || ''}
              onChange={(e) => setFieldValue('amount', e.target.value)}
              onBlur={() => setFieldTouched('amount')}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="Enter amount"
            />
          </ValidatedField>

          <ValidatedField
            name="leverage"
            error={errors.leverage}
            touched={touched.leverage}
            required
          >
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Leverage (1-100x)
            </label>
            <input
              type="number"
              value={formData.leverage || ''}
              onChange={(e) => setFieldValue('leverage', e.target.value)}
              onBlur={() => setFieldTouched('leverage')}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="Enter leverage"
              min="1"
              max="100"
            />
          </ValidatedField>

          <ValidatedField
            name="stopLoss"
            error={errors.stopLoss}
            touched={touched.stopLoss}
          >
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Stop Loss (Optional)
            </label>
            <input
              type="number"
              value={formData.stopLoss || ''}
              onChange={(e) => setFieldValue('stopLoss', e.target.value)}
              onBlur={() => setFieldTouched('stopLoss')}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="Enter stop loss"
              step="0.01"
            />
          </ValidatedField>

          <div className="flex gap-3 mt-6">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Submit Form
            </Button>
            <Button 
              type="button" 
              onClick={resetForm}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Reset
            </Button>
          </div>
        </form>
      </section>

      {/* Error Testing Buttons */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Test Error Scenarios</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={handleNetworkError}
            className="bg-red-600 hover:bg-red-700"
          >
            Test Network Error
          </Button>
          
          <Button 
            onClick={handleAPIError}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Test API Error
          </Button>
          
          <Button 
            onClick={handleValidationError}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Test Validation
          </Button>
          
          <Button 
            onClick={handleRetryRequest}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Test Retry Logic
          </Button>
          
          <Button 
            onClick={handleOfflineTest}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Test Offline
          </Button>
          
          <Button 
            onClick={() => setShowErrorBoundary(true)}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Test Error Boundary
          </Button>
        </div>
      </section>

      {/* Error Boundary Test */}
      {showErrorBoundary && (
        <ErrorThrowingComponent />
      )}

      {/* Instructions */}
      <section className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">How to Use</h2>
        
        <div className="space-y-4 text-gray-300">
          <div>
            <h3 className="font-medium text-white">1. Error Boundaries</h3>
            <p>Wrap components with ErrorBoundary to catch React errors gracefully.</p>
            <code className="block bg-gray-800 p-2 rounded mt-1 text-sm">
              {`<ErrorBoundary fallback={CustomErrorComponent}>
  <YourComponent />
</ErrorBoundary>`}
            </code>
          </div>

          <div>
            <h3 className="font-medium text-white">2. API Error Handling</h3>
            <p>Use the api utilities for automatic error handling and retry logic.</p>
            <code className="block bg-gray-800 p-2 rounded mt-1 text-sm">
              {`import { api } from '@/lib/apiErrorHandler';

const data = await api.get('/api/endpoint');`}
            </code>
          </div>

          <div>
            <h3 className="font-medium text-white">3. Form Validation</h3>
            <p>Use the validation utilities for comprehensive form validation.</p>
            <code className="block bg-gray-800 p-2 rounded mt-1 text-sm">
              {`const { data, errors, validateForm } = useFormValidation(schema);`}
            </code>
          </div>

          <div>
            <h3 className="font-medium text-white">4. Toast Notifications</h3>
            <p>Show user-friendly error messages with toast notifications.</p>
            <code className="block bg-gray-800 p-2 rounded mt-1 text-sm">
              {`window.showToast({
  type: 'error',
  title: 'Error',
  message: 'Something went wrong'
});`}
            </code>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ErrorHandlingExamples;

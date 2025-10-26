/**
 * Validation utilities with comprehensive error handling
 */

import React, { useState, useMemo, useCallback } from 'react';
import { handleValidationError } from './errorHandler';

// Common validation rules
export const validators = {
  required: (value, fieldName = 'Field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value, fieldName = 'Email') => {
    if (!value) return null; // Let required validator handle empty values
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return `${fieldName} must be a valid email address`;
    }
    return null;
  },

  minLength: (min) => (value, fieldName = 'Field') => {
    if (!value) return null;
    
    if (value.length < min) {
      return `${fieldName} must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (max) => (value, fieldName = 'Field') => {
    if (!value) return null;
    
    if (value.length > max) {
      return `${fieldName} must be no more than ${max} characters long`;
    }
    return null;
  },

  min: (min) => (value, fieldName = 'Field') => {
    if (value === null || value === undefined || value === '') return null;
    
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < min) {
      return `${fieldName} must be at least ${min}`;
    }
    return null;
  },

  max: (max) => (value, fieldName = 'Field') => {
    if (value === null || value === undefined || value === '') return null;
    
    const numValue = Number(value);
    if (isNaN(numValue) || numValue > max) {
      return `${fieldName} must be no more than ${max}`;
    }
    return null;
  },

  pattern: (regex, message) => (value, fieldName = 'Field') => {
    if (!value) return null;
    
    if (!regex.test(value)) {
      return message || `${fieldName} format is invalid`;
    }
    return null;
  },

  numeric: (value, fieldName = 'Field') => {
    if (!value) return null;
    
    if (isNaN(Number(value))) {
      return `${fieldName} must be a number`;
    }
    return null;
  },

  url: (value, fieldName = 'URL') => {
    if (!value) return null;
    
    try {
      new URL(value);
      return null;
    } catch {
      return `${fieldName} must be a valid URL`;
    }
  },

  phone: (value, fieldName = 'Phone') => {
    if (!value) return null;
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return `${fieldName} must be a valid phone number`;
    }
    return null;
  },

  password: (value, fieldName = 'Password') => {
    if (!value) return null;
    
    const errors = [];
    
    if (value.length < 8) {
      errors.push('at least 8 characters');
    }
    
    if (!/[A-Z]/.test(value)) {
      errors.push('one uppercase letter');
    }
    
    if (!/[a-z]/.test(value)) {
      errors.push('one lowercase letter');
    }
    
    if (!/\d/.test(value)) {
      errors.push('one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push('one special character');
    }
    
    if (errors.length > 0) {
      return `${fieldName} must contain ${errors.join(', ')}`;
    }
    
    return null;
  },

  confirmPassword: (originalPassword) => (value, fieldName = 'Password confirmation') => {
    if (!value) return null;
    
    if (value !== originalPassword) {
      return `${fieldName} must match the original password`;
    }
    return null;
  },

  custom: (fn) => (value, fieldName = 'Field') => {
    try {
      const result = fn(value, fieldName);
      return result;
    } catch (error) {
      return `Validation error: ${error.message}`;
    }
  }
};

// Form validation class
export class FormValidator {
  constructor(schema = {}) {
    this.schema = schema;
    this.errors = {};
  }

  validateField(fieldName, value) {
    const fieldSchema = this.schema[fieldName];
    if (!fieldSchema) return null;

    const validators = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
    
    for (const validator of validators) {
      const error = validator(value, fieldName);
      if (error) {
        return error;
      }
    }
    
    return null;
  }

  validateForm(data) {
    this.errors = {};
    let isValid = true;

    for (const [fieldName, value] of Object.entries(data)) {
      const error = this.validateField(fieldName, value);
      if (error) {
        this.errors[fieldName] = error;
        isValid = false;
      }
    }

    // Log validation errors
    if (!isValid) {
      handleValidationError(this.errors, {
        formData: data,
        timestamp: new Date().toISOString()
      });
    }

    return {
      isValid,
      errors: this.errors
    };
  }

  getFieldError(fieldName) {
    return this.errors[fieldName] || null;
  }

  clearErrors() {
    this.errors = {};
  }

  setSchema(schema) {
    this.schema = schema;
    this.clearErrors();
  }
}

// Real-time validation hook
export const useFormValidation = (schema, initialData = {}) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validator = useMemo(() => new FormValidator(schema), [schema]);

  const validateField = useCallback((fieldName, value) => {
    const error = validator.validateField(fieldName, value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    return error;
  }, [validator]);

  const validateForm = useCallback(() => {
    const result = validator.validateForm(data);
    setErrors(result.errors);
    return result;
  }, [validator, data]);

  const setFieldValue = useCallback((fieldName, value) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    
    // Validate field if it has been touched
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  }, [touched, validateField]);

  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched(prev => ({ ...prev, [fieldName]: isTouched }));
    
    // Validate field when touched
    if (isTouched && data[fieldName] !== undefined) {
      validateField(fieldName, data[fieldName]);
    }
  }, [data, validateField]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
    validator.clearErrors();
  }, [initialData, validator]);

  return {
    data,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateField,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Validation error display component
export const ValidationError = ({ error, fieldName, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`text-red-400 text-sm mt-1 ${className}`}>
      {error}
    </div>
  );
};

// Field wrapper with validation
export const ValidatedField = ({ 
  children, 
  name, 
  error, 
  touched, 
  required = false,
  className = '' 
}) => {
  const hasError = error && touched;

  return (
    <div className={`mb-4 ${className}`}>
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
      <ValidationError error={error} fieldName={name} />
    </div>
  );
};

// Common validation schemas
export const commonSchemas = {
  login: {
    email: [validators.required, validators.email],
    password: [validators.required]
  },

  registration: {
    firstName: [validators.required, validators.minLength(2)],
    lastName: [validators.required, validators.minLength(2)],
    email: [validators.required, validators.email],
    password: [validators.required, validators.password],
    confirmPassword: [validators.required]
  },

  profile: {
    firstName: [validators.minLength(2)],
    lastName: [validators.minLength(2)],
    email: [validators.email],
    phone: [validators.phone],
    website: [validators.url]
  },

  trading: {
    amount: [validators.required, validators.numeric, validators.min(0.01)],
    stopLoss: [validators.numeric, validators.min(0)],
    takeProfit: [validators.numeric, validators.min(0)],
    leverage: [validators.required, validators.numeric, validators.min(1), validators.max(100)]
  }
};

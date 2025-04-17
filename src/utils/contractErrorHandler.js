import { ethers } from 'ethers';

// Error types
export const ErrorType = {
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  USER_REJECTED: 'USER_REJECTED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Common error codes and their user-friendly messages
const ERROR_MESSAGES = {
  // MetaMask errors
  4001: {
    type: ErrorType.USER_REJECTED,
    message: 'Transaction was rejected by the user'
  },
  // Network errors
  '-32603': {
    type: ErrorType.NETWORK_ERROR,
    message: 'Network error occurred. Please check your connection'
  },
  // Contract errors
  'INSUFFICIENT_FUNDS': {
    type: ErrorType.CONTRACT_ERROR,
    message: 'Insufficient funds to complete the transaction'
  },
  'UNPREDICTABLE_GAS_LIMIT': {
    type: ErrorType.CONTRACT_ERROR,
    message: 'Unable to estimate gas. The transaction may fail'
  },
  // Custom contract errors
  'AUCTION_ENDED': {
    type: ErrorType.CONTRACT_ERROR,
    message: 'This auction has already ended'
  },
  'INVALID_BID': {
    type: ErrorType.CONTRACT_ERROR,
    message: 'Invalid bid amount'
  },
  'UNAUTHORIZED': {
    type: ErrorType.CONTRACT_ERROR,
    message: 'You are not authorized to perform this action'
  }
};

/**
 * Handles contract interaction errors and returns user-friendly messages
 * @param {Error} error - The error object from the contract interaction
 * @param {Object} options - Additional options for error handling
 * @returns {Object} Formatted error object with type and message
 */
export function handleContractError(error, options = {}) {
  console.error('Contract Error:', error);

  // Extract error details
  const errorCode = error.code || (error.error && error.error.code);
  const errorMessage = error.message || (error.error && error.error.message);
  const reason = error.reason || (error.error && error.error.reason);

  // Check for user rejection
  if (errorCode === 4001) {
    return ERROR_MESSAGES[4001];
  }

  // Check for insufficient funds
  if (errorCode === 'INSUFFICIENT_FUNDS' || errorMessage?.includes('insufficient funds')) {
    return ERROR_MESSAGES['INSUFFICIENT_FUNDS'];
  }

  // Check for gas estimation errors
  if (errorCode === 'UNPREDICTABLE_GAS_LIMIT') {
    return ERROR_MESSAGES['UNPREDICTABLE_GAS_LIMIT'];
  }

  // Check for custom contract errors
  if (reason) {
    const customError = parseCustomContractError(reason);
    if (customError) {
      return customError;
    }
  }

  // Check for network errors
  if (errorCode === '-32603') {
    return ERROR_MESSAGES['-32603'];
  }

  // Default error message
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: 'An unexpected error occurred. Please try again'
  };
}

/**
 * Parses custom contract error messages
 * @param {string} errorString - The error string from the contract
 * @returns {Object|null} Formatted error object or null if not recognized
 */
function parseCustomContractError(errorString) {
  // Common contract error patterns
  const errorPatterns = {
    'auction ended': ERROR_MESSAGES['AUCTION_ENDED'],
    'invalid bid': ERROR_MESSAGES['INVALID_BID'],
    'unauthorized': ERROR_MESSAGES['UNAUTHORIZED'],
    'not authorized': ERROR_MESSAGES['UNAUTHORIZED']
  };

  const lowerError = errorString.toLowerCase();
  for (const [pattern, error] of Object.entries(errorPatterns)) {
    if (lowerError.includes(pattern)) {
      return error;
    }
  }

  return null;
}

/**
 * Wraps a contract interaction in error handling
 * @param {Function} action - The async contract interaction function
 * @param {Object} options - Additional options for error handling
 * @returns {Promise} Result of the contract interaction or throws a handled error
 */
export async function withErrorHandling(action, options = {}) {
  try {
    return await action();
  } catch (error) {
    const handledError = handleContractError(error, options);
    throw handledError;
  }
}

/**
 * Estimates gas for a transaction with safety margin
 * @param {Object} tx - The transaction object
 * @param {number} safetyFactor - Multiplier for gas estimate (default: 1.2)
 * @returns {Promise<BigNumber>} Estimated gas limit
 */
export async function estimateGasWithMargin(tx, safetyFactor = 1.2) {
  try {
    const gasEstimate = await tx.estimateGas();
    return ethers.toBigInt(Math.ceil(Number(gasEstimate) * safetyFactor));
  } catch (error) {
    console.error('Gas estimation error:', error);
    throw {
      type: ErrorType.CONTRACT_ERROR,
      message: 'Failed to estimate gas. The transaction may fail'
    };
  }
}

/**
 * Checks if an error is due to user rejection
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error is due to user rejection
 */
export function isUserRejection(error) {
  return error.code === 4001 || error.type === ErrorType.USER_REJECTED;
}

/**
 * Checks if an error is due to network issues
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error is due to network issues
 */
export function isNetworkError(error) {
  return error.type === ErrorType.NETWORK_ERROR || error.code === '-32603';
}

/**
 * Formats transaction error messages for display
 * @param {Error} error - The error object
 * @returns {string} Formatted error message
 */
export function formatErrorMessage(error) {
  if (typeof error === 'string') {
    return error;
  }

  if (error.type && error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Handles errors for specific auction types
 * @param {Error} error - The error object
 * @param {string} auctionType - The type of auction
 * @returns {Object} Formatted error object
 */
export function handleAuctionTypeError(error, auctionType) {
  const baseError = handleContractError(error);
  
  // Add auction-specific context to error message
  switch (auctionType.toLowerCase()) {
    case 'english':
      if (baseError.type === ErrorType.CONTRACT_ERROR && error.message?.includes('bid')) {
        return {
          ...baseError,
          message: 'Bid must be higher than current highest bid'
        };
      }
      break;
    case 'dutch':
      if (baseError.type === ErrorType.CONTRACT_ERROR && error.message?.includes('price')) {
        return {
          ...baseError,
          message: 'Current price has changed. Please try again'
        };
      }
      break;
    case 'sealed':
      if (baseError.type === ErrorType.CONTRACT_ERROR && error.message?.includes('reveal')) {
        return {
          ...baseError,
          message: 'Invalid bid revelation. Please check your bid details'
        };
      }
      break;
  }

  return baseError;
} 
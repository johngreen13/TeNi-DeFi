import { ethers } from 'ethers';

// Constants for validation
export const VALIDATION_CONSTANTS = {
  MIN_DURATION: 60 * 5, // 5 minutes in seconds
  MAX_DURATION: 60 * 60 * 24 * 30, // 30 days in seconds
  MIN_STARTING_PRICE: ethers.parseEther("0.0001"), // Minimum starting price in ETH
  MAX_STARTING_PRICE: ethers.parseEther("1000000"), // Maximum starting price in ETH
  MIN_DECREMENT_INTERVAL: 60, // 1 minute in seconds
  MAX_DECREMENT_INTERVAL: 60 * 60 * 24, // 24 hours in seconds
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_IMAGES: 10,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
};

// Validation error class
export class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
  }
}

// Main validation function
export async function validateAuctionData(auctionData, auctionType) {
  const errors = [];

  try {
    // Common validations
    validateCommonFields(auctionData, errors);

    // Type-specific validations
    switch (auctionType.toLowerCase()) {
      case 'english':
        validateEnglishAuction(auctionData, errors);
        break;
      case 'dutch':
        validateDutchAuction(auctionData, errors);
        break;
      case 'sealed':
        validateSealedAuction(auctionData, errors);
        break;
      case 'fixed':
        validateFixedSwapAuction(auctionData, errors);
        break;
      default:
        errors.push(new ValidationError('auctionType', 'Invalid auction type'));
    }

    // Physical item validations
    if (auctionData.isPhysicalItem) {
      validatePhysicalItem(auctionData, errors);
    }

    // Image validations
    if (auctionData.images && auctionData.images.length > 0) {
      await validateImages(auctionData.images, errors);
    }

  } catch (error) {
    errors.push(new ValidationError('general', 'Validation process failed: ' + error.message));
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Common field validations
function validateCommonFields(auctionData, errors) {
  // Title validation
  if (!auctionData.title) {
    errors.push(new ValidationError('title', 'Title is required'));
  } else if (auctionData.title.length > VALIDATION_CONSTANTS.MAX_TITLE_LENGTH) {
    errors.push(new ValidationError('title', `Title must be less than ${VALIDATION_CONSTANTS.MAX_TITLE_LENGTH} characters`));
  }

  // Description validation
  if (auctionData.description && auctionData.description.length > VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH) {
    errors.push(new ValidationError('description', `Description must be less than ${VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH} characters`));
  }

  // Duration validation
  const duration = Number(auctionData.duration);
  if (isNaN(duration) || duration < VALIDATION_CONSTANTS.MIN_DURATION) {
    errors.push(new ValidationError('duration', `Duration must be at least ${VALIDATION_CONSTANTS.MIN_DURATION} seconds`));
  } else if (duration > VALIDATION_CONSTANTS.MAX_DURATION) {
    errors.push(new ValidationError('duration', `Duration must be less than ${VALIDATION_CONSTANTS.MAX_DURATION} seconds`));
  }

  // Starting price validation
  try {
    const startingPrice = ethers.parseEther(auctionData.startingPrice.toString());
    if (startingPrice < VALIDATION_CONSTANTS.MIN_STARTING_PRICE) {
      errors.push(new ValidationError('startingPrice', `Starting price must be at least ${ethers.formatEther(VALIDATION_CONSTANTS.MIN_STARTING_PRICE)} ETH`));
    } else if (startingPrice > VALIDATION_CONSTANTS.MAX_STARTING_PRICE) {
      errors.push(new ValidationError('startingPrice', `Starting price must be less than ${ethers.formatEther(VALIDATION_CONSTANTS.MAX_STARTING_PRICE)} ETH`));
    }
  } catch (error) {
    errors.push(new ValidationError('startingPrice', 'Invalid starting price format'));
  }
}

// English auction specific validations
function validateEnglishAuction(auctionData, errors) {
  // Minimum bid increment validation
  if (auctionData.minBidIncrement) {
    try {
      const minIncrement = ethers.parseEther(auctionData.minBidIncrement.toString());
      if (minIncrement <= 0) {
        errors.push(new ValidationError('minBidIncrement', 'Minimum bid increment must be greater than 0'));
      }
    } catch (error) {
      errors.push(new ValidationError('minBidIncrement', 'Invalid minimum bid increment format'));
    }
  }
}

// Dutch auction specific validations
function validateDutchAuction(auctionData, errors) {
  // Decrement amount validation
  if (!auctionData.decrementAmount) {
    errors.push(new ValidationError('decrementAmount', 'Decrement amount is required for Dutch auctions'));
  } else {
    try {
      const decrementAmount = ethers.parseEther(auctionData.decrementAmount.toString());
      if (decrementAmount <= 0) {
        errors.push(new ValidationError('decrementAmount', 'Decrement amount must be greater than 0'));
      }
    } catch (error) {
      errors.push(new ValidationError('decrementAmount', 'Invalid decrement amount format'));
    }
  }

  // Decrement interval validation
  if (!auctionData.decrementInterval) {
    errors.push(new ValidationError('decrementInterval', 'Decrement interval is required for Dutch auctions'));
  } else {
    const interval = Number(auctionData.decrementInterval);
    if (isNaN(interval) || interval < VALIDATION_CONSTANTS.MIN_DECREMENT_INTERVAL) {
      errors.push(new ValidationError('decrementInterval', `Decrement interval must be at least ${VALIDATION_CONSTANTS.MIN_DECREMENT_INTERVAL} seconds`));
    } else if (interval > VALIDATION_CONSTANTS.MAX_DECREMENT_INTERVAL) {
      errors.push(new ValidationError('decrementInterval', `Decrement interval must be less than ${VALIDATION_CONSTANTS.MAX_DECREMENT_INTERVAL} seconds`));
    }
  }

  // Reserve price validation
  if (auctionData.reservePrice) {
    try {
      const reservePrice = ethers.parseEther(auctionData.reservePrice.toString());
      const startingPrice = ethers.parseEther(auctionData.startingPrice.toString());
      if (reservePrice >= startingPrice) {
        errors.push(new ValidationError('reservePrice', 'Reserve price must be less than starting price for Dutch auctions'));
      }
    } catch (error) {
      errors.push(new ValidationError('reservePrice', 'Invalid reserve price format'));
    }
  }
}

// Sealed bid auction specific validations
function validateSealedAuction(auctionData, errors) {
  // Reveal duration validation
  if (!auctionData.revealDuration) {
    errors.push(new ValidationError('revealDuration', 'Reveal duration is required for Sealed Bid auctions'));
  } else {
    const revealDuration = Number(auctionData.revealDuration);
    if (isNaN(revealDuration) || revealDuration < VALIDATION_CONSTANTS.MIN_DURATION) {
      errors.push(new ValidationError('revealDuration', `Reveal duration must be at least ${VALIDATION_CONSTANTS.MIN_DURATION} seconds`));
    }
  }
}

// Fixed swap auction specific validations
function validateFixedSwapAuction(auctionData, errors) {
  // Quantity validation
  if (!auctionData.quantity || auctionData.quantity <= 0) {
    errors.push(new ValidationError('quantity', 'Quantity must be greater than 0 for Fixed Swap auctions'));
  }

  // Maximum purchase amount validation
  if (auctionData.maxPurchaseAmount) {
    if (auctionData.maxPurchaseAmount <= 0 || auctionData.maxPurchaseAmount > auctionData.quantity) {
      errors.push(new ValidationError('maxPurchaseAmount', 'Maximum purchase amount must be greater than 0 and less than or equal to total quantity'));
    }
  }
}

// Physical item validations
function validatePhysicalItem(auctionData, errors) {
  const requiredFields = ['name', 'condition', 'dimensions', 'weight'];
  
  if (!auctionData.itemDetails) {
    errors.push(new ValidationError('itemDetails', 'Item details are required for physical items'));
    return;
  }

  for (const field of requiredFields) {
    if (!auctionData.itemDetails[field]) {
      errors.push(new ValidationError(`itemDetails.${field}`, `${field} is required for physical items`));
    }
  }

  // Weight validation
  if (auctionData.itemDetails.weight && isNaN(parseFloat(auctionData.itemDetails.weight))) {
    errors.push(new ValidationError('itemDetails.weight', 'Weight must be a valid number'));
  }
}

// Image validations
async function validateImages(images, errors) {
  if (images.length > VALIDATION_CONSTANTS.MAX_IMAGES) {
    errors.push(new ValidationError('images', `Maximum ${VALIDATION_CONSTANTS.MAX_IMAGES} images allowed`));
    return;
  }

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    
    // Size validation
    if (image.size > VALIDATION_CONSTANTS.MAX_IMAGE_SIZE) {
      errors.push(new ValidationError('images', `Image ${i + 1} exceeds maximum size of ${VALIDATION_CONSTANTS.MAX_IMAGE_SIZE / (1024 * 1024)}MB`));
    }

    // Type validation
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type)) {
      errors.push(new ValidationError('images', `Image ${i + 1} must be JPEG, PNG, or WebP format`));
    }
  }
}

// Format validation errors for display
export function formatValidationErrors(errors) {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {});
} 
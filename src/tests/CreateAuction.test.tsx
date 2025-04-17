import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateAuction from '../pages/CreateAuction';
import { createAuction } from '../utils/auction';

// Mock the auction service
jest.mock('../utils/auction');

describe('CreateAuction Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should render the auction type selection step', () => {
    renderWithRouter(<CreateAuction />);
    
    expect(screen.getByText('Select Auction Type')).toBeInTheDocument();
    expect(screen.getByText('Fixed Swap Auction')).toBeInTheDocument();
    expect(screen.getByText('Dutch Auction')).toBeInTheDocument();
    expect(screen.getByText('English Auction')).toBeInTheDocument();
    expect(screen.getByText('Sealed-Bid Auction')).toBeInTheDocument();
    expect(screen.getByText('This is a physical item')).toBeInTheDocument();
  });

  it('should show physical item fields when physical item is selected', async () => {
    renderWithRouter(<CreateAuction />);
    
    // Check the physical item checkbox
    const physicalItemCheckbox = screen.getByText('This is a physical item');
    fireEvent.click(physicalItemCheckbox);
    
    // Click continue
    fireEvent.click(screen.getByText('Continue'));
    
    // Verify physical item fields are shown
    expect(screen.getByText('Physical Item Details')).toBeInTheDocument();
    expect(screen.getByLabelText('Item Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Condition')).toBeInTheDocument();
    expect(screen.getByLabelText('Dimensions')).toBeInTheDocument();
    expect(screen.getByLabelText('Weight (in grams)')).toBeInTheDocument();
    expect(screen.getByLabelText('Shipping Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Item Images')).toBeInTheDocument();
  });

  it('should handle physical item form submission', async () => {
    renderWithRouter(<CreateAuction />);
    
    // Fill in the form
    fireEvent.click(screen.getByText('This is a physical item'));
    fireEvent.click(screen.getByText('Continue'));
    
    // Fill in physical item details
    fireEvent.change(screen.getByLabelText('Item Name'), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByLabelText('Condition'), { target: { value: 'new' } });
    fireEvent.change(screen.getByLabelText('Dimensions'), { target: { value: '10x5x3' } });
    fireEvent.change(screen.getByLabelText('Weight (in grams)'), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText('Shipping Address'), { target: { value: '123 Test St' } });
    
    // Fill in auction details
    fireEvent.change(screen.getByLabelText('Auction Title'), { target: { value: 'Test Auction' } });
    fireEvent.change(screen.getByLabelText('Starting Price (ETH)'), { target: { value: '1.0' } });
    fireEvent.change(screen.getByLabelText('Duration'), { target: { value: '24' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });
    
    // Click continue to review
    fireEvent.click(screen.getByText('Continue'));
    
    // Verify review page shows correct information
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('new')).toBeInTheDocument();
    expect(screen.getByText('10x5x3')).toBeInTheDocument();
    expect(screen.getByText('1000g')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('Test Auction')).toBeInTheDocument();
    expect(screen.getByText('1.0 ETH')).toBeInTheDocument();
    expect(screen.getByText('24 hours')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    
    // Submit the form
    fireEvent.click(screen.getByText('Create Auction'));
    
    // Verify the auction service was called with correct data
    await waitFor(() => {
      expect(createAuction).toHaveBeenCalledWith({
        title: 'Test Auction',
        description: 'Test description',
        startingPrice: '1.0',
        duration: '24',
        isPhysicalItem: true,
        itemDetails: {
          name: 'Test Item',
          description: 'Test description',
          condition: 'new',
          dimensions: '10x5x3',
          weight: '1000',
          shippingAddress: '123 Test St',
          isPhysical: true
        },
        images: []
      });
    });
  });

  it('should show escrow fee notice for physical items', () => {
    renderWithRouter(<CreateAuction />);
    
    // Select physical item and go to review
    fireEvent.click(screen.getByText('This is a physical item'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Continue'));
    
    // Verify escrow fee notice
    expect(screen.getByText(/2% fee will be charged for the escrow service/)).toBeInTheDocument();
  });

  it('should handle image upload', async () => {
    renderWithRouter(<CreateAuction />);
    
    // Select physical item and go to form
    fireEvent.click(screen.getByText('This is a physical item'));
    fireEvent.click(screen.getByText('Continue'));
    
    // Create a mock file
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText('Item Images');
    
    // Simulate file upload
    fireEvent.change(input, { target: { files: [file] } });
    
    // Verify image count is shown
    expect(screen.getByText('1 image(s) selected')).toBeInTheDocument();
  });
}); 
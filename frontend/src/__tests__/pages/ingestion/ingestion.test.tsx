import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import IngestionPage from '../../../app/ingestion/page';
import { getIngestionsAPI, createIngestionsAPI } from '../../../apis/ingestion';

jest.mock('../../../apis/ingestion', () => ({
  getIngestionsAPI: jest.fn(),
  createIngestionsAPI: jest.fn()
}));

describe('IngestionPage Component', () => {
  const mockIngestions = [
    {
      id: 1,
      file: 'invoice1.pdf',
      vendor: 'Vendor A',
      invoiceDate: '2024-12-01T00:00:00.000Z',
      amount: 150.5,
      status: 'Processed',
      error: null,
      createdAt: '2024-12-02T10:00:00.000Z'
    },
    {
      id: 2,
      file: 'invoice2.pdf',
      vendor: null,
      invoiceDate: null,
      amount: null,
      status: 'Failed',
      error: 'Invalid format',
      createdAt: '2024-12-03T11:00:00.000Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays ingestions on mount', async () => {
    (getIngestionsAPI as jest.Mock).mockResolvedValue(mockIngestions);

    render(<IngestionPage />);

    expect(screen.getByText('Loading ingestions...')).toBeInTheDocument();

    await waitFor(() => {
      expect(getIngestionsAPI).toHaveBeenCalled();
      expect(screen.getByText('invoice1.pdf')).toBeInTheDocument();
      expect(screen.getByText('Vendor A')).toBeInTheDocument();
      expect(screen.getByText('$150.50')).toBeInTheDocument();
      expect(screen.getByText('Processed')).toBeInTheDocument();
      expect(screen.getByText('invoice2.pdf')).toBeInTheDocument();
      expect(screen.getByText('Invalid format')).toBeInTheDocument();
    });
  });

  it('handles no ingestions', async () => {
    (getIngestionsAPI as jest.Mock).mockResolvedValue([]);

    render(<IngestionPage />);

    await waitFor(() => {
      expect(screen.getByText('No ingestions found.')).toBeInTheDocument();
    });
  });

  it('triggers ingestion and updates the table', async () => {
    (getIngestionsAPI as jest.Mock).mockResolvedValueOnce([]).mockResolvedValueOnce(mockIngestions);
    (createIngestionsAPI as jest.Mock).mockResolvedValue({});

    render(<IngestionPage />);

    const triggerBtn = screen.getByRole('button', { name: /trigger ingestion/i });
    fireEvent.click(triggerBtn);

    await waitFor(() => {
      expect(createIngestionsAPI).toHaveBeenCalled();
      expect(getIngestionsAPI).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Ingestion complete!')).toBeInTheDocument();
      expect(screen.getByText('invoice1.pdf')).toBeInTheDocument();
    });
  });

  it('handles ingestion trigger error', async () => {
    (getIngestionsAPI as jest.Mock).mockResolvedValue([]);
    (createIngestionsAPI as jest.Mock).mockRejectedValue(new Error('Ingestion failed'));
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<IngestionPage />);

    const triggerBtn = screen.getByRole('button', { name: /trigger ingestion/i });
    fireEvent.click(triggerBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Ingestion failed');
      expect(createIngestionsAPI).toHaveBeenCalled();
      expect(screen.getByText('Ingestion failed')).toBeInTheDocument();
    });
  });

  it('handles ingestion fetch error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (getIngestionsAPI as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<IngestionPage />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error fetching ingestions');
    });

    consoleSpy.mockRestore();
  });
});

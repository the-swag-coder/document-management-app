import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocumentsPage from '../../../app/documents/page';
import {
  getDocumentsAPI,
  uploadDocumentAPI,
  deleteDocumentAPI
} from '../../../apis/documents';

jest.mock('../../../apis/documents', () => ({
  getDocumentsAPI: jest.fn(),
  uploadDocumentAPI: jest.fn(),
  deleteDocumentAPI: jest.fn()
}));

const mockDocuments = [
  { id: 1, file: 'test1.pdf', url: 'http://localhost/test1.pdf', userId: 123 },
  { id: 2, file: 'test2.docx', url: 'http://localhost/test2.docx', userId: 123 }
];

describe('DocumentsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and fetches documents on mount', async () => {
    (getDocumentsAPI as jest.Mock).mockResolvedValue(mockDocuments);

    render(<DocumentsPage />);

    expect(getDocumentsAPI).toHaveBeenCalled();

    expect(await screen.findByText('test1.pdf')).toBeInTheDocument();
    expect(await screen.findByText('test2.docx')).toBeInTheDocument();
  });

  it('uploads a document and displays it', async () => {
    const file = new File(['dummy content'], 'newfile.txt', { type: 'text/plain' });
    (getDocumentsAPI as jest.Mock).mockResolvedValue([]);
    (uploadDocumentAPI as jest.Mock).mockResolvedValue({
      id: 3,
      file: 'newfile.txt',
      url: 'http://localhost/newfile.txt',
      userId: 1
    });

    render(<DocumentsPage />);

    const fileInput = screen.getByLabelText(/upload file/i) as HTMLInputElement;
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(uploadDocumentAPI).toHaveBeenCalled();
    });

    expect(await screen.findByText('newfile.txt')).toBeInTheDocument();
  });

  it('deletes a document after confirmation', async () => {
    (getDocumentsAPI as jest.Mock).mockResolvedValue(mockDocuments);
    (deleteDocumentAPI as jest.Mock).mockResolvedValue({});

    global.confirm = jest.fn(() => true);

    render(<DocumentsPage />);

    expect(await screen.findByText('test1.pdf')).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: '✕' });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteDocumentAPI).toHaveBeenCalledWith(1);
    });
  });

  it('does not delete if user cancels confirm dialog', async () => {
    (getDocumentsAPI as jest.Mock).mockResolvedValue(mockDocuments);
    global.confirm = jest.fn(() => false);

    render(<DocumentsPage />);

    expect(await screen.findByText('test1.pdf')).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: '✕' });
    await userEvent.click(deleteButtons[0]);

    expect(deleteDocumentAPI).not.toHaveBeenCalled();
  });

  it('handles upload error', async () => {
    const file = new File(['fail'], 'fail.txt', { type: 'text/plain' });
    (getDocumentsAPI as jest.Mock).mockResolvedValue([]);
    (uploadDocumentAPI as jest.Mock).mockRejectedValue(new Error('Upload failed'));

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<DocumentsPage />);

    const fileInput = screen.getByLabelText(/upload file/i) as HTMLInputElement;
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(uploadDocumentAPI).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Failed to upload');
    });
  });

  it('handles delete error', async () => {
    (getDocumentsAPI as jest.Mock).mockResolvedValue(mockDocuments);
    (deleteDocumentAPI as jest.Mock).mockRejectedValue(new Error('Delete failed'));

    global.confirm = jest.fn(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<DocumentsPage />);

    expect(await screen.findByText('test1.pdf')).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: '✕' });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteDocumentAPI).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Failed to delete');
    });
  });
});

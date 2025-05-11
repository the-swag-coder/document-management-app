'use client';
import { useState, useEffect } from 'react';
import { createIngestionsAPI, getIngestionsAPI } from '../../apis/ingestion';

interface Ingestion {
  id: number;
  file: string;
  vendor: string | null;
  invoiceDate: string | null;
  amount: number | null;
  status: string;
  error: string | null;
  createdAt: string;
}

export default function IngestionPage() {
  const [status, setStatus] = useState<string>('Idle');
  const [ingestions, setIngestions] = useState<Ingestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getIngestions = async () => {
    try {
      setLoading(true);
      const res = await getIngestionsAPI();
      setIngestions(res);
    } catch (err) {
      console.error('Error fetching ingestions', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerIngestion = async () => {
    try {
      setStatus('Triggering ingestion...');
      await createIngestionsAPI();
      setStatus('Ingestion triggered. Fetching updated data...');
      const res = await getIngestionsAPI();
      setIngestions(res);
      setStatus('Ingestion complete!');
    } catch (err) {
      console.error('Ingestion failed', err);
      setStatus('Ingestion failed');
    }
  };

  useEffect(() => {
    getIngestions();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ingestion</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded cursor-pointer"
          onClick={triggerIngestion}
        >
          Trigger Ingestion
        </button>
      </div>

      <div className="mb-4">
        <span className="font-semibold">Status:</span> {status}
      </div>

      {loading ? (
        <p>Loading ingestions...</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">File</th>
              <th className="px-4 py-2 border">Vendor</th>
              <th className="px-4 py-2 border">Invoice Date</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Error</th>
              <th className="px-4 py-2 border">Created At</th>
            </tr>
            </thead>
            <tbody>
            {ingestions.map((item) => (
              <tr key={item.id} className="text-sm">
                <td className="px-4 py-2 border">{item.file}</td>
                <td className="px-4 py-2 border">{item.vendor || '—'}</td>
                <td className="px-4 py-2 border">
                  {item.invoiceDate
                    ? new Date(item.invoiceDate).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-4 py-2 border">
                  {item.amount !== null ? `$${item.amount.toFixed(2)}` : '—'}
                </td>
                <td className="px-4 py-2 border">{item.status}</td>
                <td className="px-4 py-2 border">{item.error || '—'}</td>
                <td className="px-4 py-2 border">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {ingestions.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No ingestions found.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

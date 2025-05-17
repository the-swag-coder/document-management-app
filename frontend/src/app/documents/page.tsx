'use client';
import { useEffect, useState } from 'react';
import { deleteDocumentAPI, getDocumentsAPI, uploadDocumentAPI } from '../../apis/documents';

type DocumentType = {
  id: number;
  file: string;
  url: string;
  userId: number;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDocuments = async () => {
    try {
      const res = await getDocumentsAPI();
      setDocuments(res);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);

    try {
      const res = await uploadDocumentAPI(formData);
      setDocuments((prev) => [...prev, res]);
    } catch (err) {
      alert('Failed to upload');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    setLoading(true);
    try {
      await deleteDocumentAPI(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      alert('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document</h1>
        <label className="bg-black text-white px-4 py-2 rounded cursor-pointer">
          {loading ? 'Uploading...' : 'Upload File'}
          <input
            type="file"
            className="hidden"
            data-testid="file-input"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border rounded-lg shadow p-4 relative hover:shadow-lg transition"
          >
            <div
              className="cursor-pointer flex flex-col items-center"
              onClick={() => window.open(doc.url, '_blank')}
            >
              <div className="text-4xl">📄</div>
              <p
                className="mt-2 text-center text-sm w-full max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                {doc.file}
              </p>
            </div>
            <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(doc.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

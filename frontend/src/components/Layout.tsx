// src/components/Layout.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Upload from './Upload';

const Layout: React.FC = ({ children }) => {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [responses, setResponses] = useState<string[]>([]);

  const handleFileUpload = (fileName: string) => {
    setUploadedFileName(fileName);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileName || !message) return;

    try {
      const response = await axios.post('/api/chat', {
        fileName: uploadedFileName,
        message,
      });
      setResponses((prevResponses) => [...prevResponses, response.data.response]);
      setMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <div className="bg-gray-900 text-white w-64 p-4">
          <div className="mb-4">
            <Upload onFileUpload={handleFileUpload} />
          </div>
          <div className="mb-4">
            <h2 className="text-lg">Chats</h2>
            <ul>
              <li className="mt-2">
                <div className="bg-gray-800 p-2 rounded">
                  {uploadedFileName ? uploadedFileName : 'No file uploaded'}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1 bg-gray-800 text-white p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl">Chat with Document</h1>
            <input
              type="text"
              placeholder="Search your document"
              className="bg-gray-700 text-white px-4 py-2 rounded"
            />
          </div>
          <div className="flex-1 bg-gray-700 p-4 rounded overflow-auto">
            {responses.map((response, index) => (
              <div key={index} className="bg-gray-900 p-2 rounded mb-2">
                {response}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="mt-4 flex">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Type your message here..."
              className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-l"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Layout;

// frontend/pages/index.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query);

    try {
      const res = await axios.post('http://localhost:8000/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>PDF Chatter</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Ask a question about the PDF" 
        />
        <button type="submit">Upload and Ask</button>
      </form>
      {response && <p>Response: {response}</p>}
    </div>
  );
}

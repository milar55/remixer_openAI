'use client';

import { useState } from 'react';

export default function Remixer() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemix = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remix content');
      }

      setOutputText(data.result);
      setError(null);
    } catch (error) {
      console.error('Error remixing content:', error);
      setError(error instanceof Error ? error.message : 'Failed to remix content');
      setOutputText('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
          Input Text
        </label>
        <textarea
          id="input"
          className="w-full h-40 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter the text you want to remix..."
        />
      </div>

      <button
        onClick={handleRemix}
        disabled={isLoading || !inputText.trim()}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Remixing...' : 'Remix Content'}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="output" className="block text-sm font-medium text-gray-700 mb-2">
          Remixed Output
        </label>
        <textarea
          id="output"
          className="w-full h-40 p-3 border rounded-lg shadow-sm bg-gray-50"
          value={outputText}
          readOnly
          placeholder="Remixed content will appear here..."
        />
      </div>
    </div>
  );
} 
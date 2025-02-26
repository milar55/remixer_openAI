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
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8 gradient-text">
        Content Remixer
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <label htmlFor="input" className="block text-sm font-medium text-purple-700">
            Original Text
          </label>
          <textarea
            id="input"
            className="input-field h-[300px]"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here to transform it into something creative..."
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="output" className="block text-sm font-medium text-purple-700">
            Remixed Version
          </label>
          <textarea
            id="output"
            className="input-field h-[300px] bg-white/50"
            value={outputText}
            readOnly
            placeholder="Your remixed content will appear here..."
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={handleRemix}
          disabled={isLoading || !inputText.trim()}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 
                    text-white font-medium shadow-lg hover:shadow-xl 
                    transform hover:-translate-y-0.5 transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
                    focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Remixing...
            </span>
          ) : (
            'Transform Content'
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg 
                        text-red-600 text-sm max-w-md mx-auto text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 
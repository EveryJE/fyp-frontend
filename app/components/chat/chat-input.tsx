// src/components/Chat/ChatInput.tsx
import React, { useState } from 'react';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Logic to send the message
    console.log('Sending:', message);
    setMessage('');
  };

  return (
    <div className="bg-white/10 border border-gray-300 backdrop-blur-sm rounded-2xl shadow-xs dark:bg-neutral-800/10 dark:border-neutral-600">
      <div className="pb-2 px-2">
        <textarea
          id="hs-pro-aimt"
          className="max-h-36  mt-2 pt-4 pb-2 ps-2 pe-4 block w-full bg-transparent border-transparent resize-none text-gray-800 placeholder-gray-500 focus:outline-hidden focus:border-transparent focus:ring-transparent dark:text-neutral-200 dark:placeholder-neutral-500"
          placeholder="Ask anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          data-hs-textarea-auto-height
        />

        <div className="pt-2 flex justify-between items-center gap-x-1">
          {/* Button Group for adding media, tools, etc. */}
          <div className="flex items-center gap-x-1">
            {/* These can be further extracted into their own components */}
            <button className="flex justify-center items-center size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-lg dark:text-neutral-400 dark:hover:bg-neutral-700">
              <svg className="shrink-0 size-4.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            </button>
            <button className="flex justify-center items-center size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-lg dark:text-neutral-400 dark:hover:bg-neutral-700">
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
            </button>
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            className="inline-flex shrink-0 justify-center items-center size-8 text-sm font-medium rounded-lg text-white bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 disabled:pointer-events-none"
            disabled={!message.trim()}
          >
            <span className="sr-only">Send</span>
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
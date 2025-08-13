// src/components/Chat/ChatContainer.tsx
import React from 'react';
import ChatInput from './chat-input';
import Suggestions from './chat-suggestions';

const ChatContainer: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-between sm:justify-center max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* This area will eventually display the conversation history. */}
      {/* For now, it shows the initial prompt. */}
      <div className="flex flex-col justify-center items-center grow sm:flex-none">
        <h1 className="mb-8 text-3xl text-center text-gray-800 dark:text-neutral-200">
          What can I help with?
        </h1>
      </div>

      {/* This div wraps the input and suggestions at the bottom */}
      <div>
        <ChatInput />
        <Suggestions />
      </div>
    </div>
  );
};

export default ChatContainer;
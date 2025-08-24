
import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-center items-center mb-4">
        <svg className="animate-spin h-10 w-10 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p className="text-xl font-semibold text-gray-700">
        AI 영양사 선생님이 열심히 분석하고 있어요... 🧐
      </p>
      <p className="text-gray-500 mt-2">잠시만 기다려 주세요!</p>
    </div>
  );
};

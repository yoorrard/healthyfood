
import React from 'react';

export const WelcomeMessage: React.FC = () => {
  return (
    <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200 animate-fade-in">
      <div className="text-6xl mb-4">🥕</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        무엇이든 물어보세요!
      </h2>
      <p className="text-gray-600 text-lg">
        평소에 궁금했던 음식 이름을 위에 입력하고 <br/>
        '알려주세요!' 버튼을 눌러보세요.
      </p>
    </div>
  );
};

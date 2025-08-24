import React from 'react';
import { HealthScoreAnalysis } from '../types';

interface HealthScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  scoreData: HealthScoreAnalysis | null;
  error: string | null;
}

export const HealthScoreModal: React.FC<HealthScoreModalProps> = ({ isOpen, onClose, isLoading, scoreData, error }) => {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return {
        text: 'text-green-600',
        circle: 'text-green-500',
        bg: 'bg-green-50',
        border: 'border-green-200',
      };
    }
    if (score >= 50) {
      return {
        text: 'text-yellow-600',
        circle: 'text-yellow-500',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
      };
    }
    return {
      text: 'text-red-600',
      circle: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-200',
    };
  };

  const scoreColors = scoreData ? getScoreColor(scoreData.score) : getScoreColor(0);


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md text-center transform transition-all duration-300 ease-out animate-fade-in-scale relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6 sm:p-8 pb-4 flex-shrink-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">
                AI 건강 점수 분석 📝
            </h2>
        </div>

        <div className="overflow-y-auto px-6 sm:px-8">
            {isLoading && (
            <div>
                <div className="flex justify-center items-center my-8">
                <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                </div>
                <p className="text-lg text-gray-600">레시피를 꼼꼼히 분석하고 있어요...</p>
            </div>
            )}

            {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg my-4">
                <p className="font-bold">앗, 오류가 발생했어요!</p>
                <p>{error}</p>
            </div>
            )}

            {scoreData && (
            <div className="animate-fade-in">
                <div className="my-6">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                        <circle 
                        className={scoreColors.circle} 
                        strokeWidth="8" 
                        strokeDasharray={2 * Math.PI * 45} 
                        strokeDashoffset={2 * Math.PI * 45 * (1 - (scoreData.score || 0) / 100)}
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="45" 
                        cx="50" 
                        cy="50"
                        style={{ transition: 'stroke-dashoffset 1s ease-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                        />
                    </svg>
                    <div className="flex items-baseline">
                        <span className={`text-5xl sm:text-6xl font-extrabold ${scoreColors.text} transition-colors duration-300`}>{scoreData.score}</span>
                        <span className="text-2xl sm:text-3xl font-bold text-gray-500 ml-1">점</span>
                    </div>
                </div>
                </div>
                <div className={`${scoreColors.bg} p-4 rounded-lg border ${scoreColors.border}`}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">⭐ 총평</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{scoreData.comment}</p>
                </div>
            </div>
            )}
        </div>
        
        <div className="p-6 sm:p-8 pt-4 flex-shrink-0">
            <button 
                onClick={onClose}
                className="w-full px-6 py-3 text-lg font-bold text-white bg-gray-500 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300"
            >
                닫기
            </button>
        </div>
      </div>
    </div>
  );
};

const styleId = 'modal-animations';
if (!document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in-scale {
      animation: fadeInScale 0.3s ease-out forwards;
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}
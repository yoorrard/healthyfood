import React from 'react';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { UpgradedRecipe } from '../types';

interface RecipeDisplayProps {
  recipe: UpgradedRecipe;
  onGoHome: () => void;
  onResetRecipe: () => void;
  onCheckHealthScore: () => void;
}

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
);

const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
);

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, onGoHome, onResetRecipe, onCheckHealthScore }) => {
  return (
    <div className="animate-fade-in mt-8">
      <div className="bg-green-50 p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-green-200 text-left">
        <header className="text-center mb-8">
          <h3 className="flex items-center justify-center text-3xl font-bold text-green-700">
            <ChefHatIcon className="h-9 w-9 mr-3" />
            {recipe.recipeName}
          </h3>
          <p className="mt-3 text-lg text-gray-600 italic">"{recipe.description}"</p>
        </header>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">📋 준비물</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg">
              {recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">🍳 만드는 방법</h4>
            <ol className="list-decimal list-outside space-y-4 text-gray-700 text-lg ml-6">
              {recipe.steps.map((step, index) => (
                <li key={index} className="pl-2 leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>

          {recipe.tip && (
            <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <h4 className="text-lg font-bold text-yellow-800">💡 꿀팁!</h4>
              <p className="text-yellow-700 mt-1">{recipe.tip}</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={onCheckHealthScore}
          className="px-8 py-4 text-xl font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          건강 점수 확인 🩺
        </button>
      </div>
      
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onResetRecipe}
          className="w-full sm:w-auto px-6 py-3 text-lg font-bold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <RefreshIcon className="h-5 w-5" />
          다른 재료로 만들기
        </button>
        <button
          onClick={onGoHome}
          className="w-full sm:w-auto px-6 py-3 text-lg font-bold text-orange-800 bg-orange-200 rounded-full hover:bg-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <HomeIcon className="h-5 w-5" />
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};
import React from 'react';
import { NutritionAnalysis } from '../types';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { BasketIcon } from './icons/BasketIcon';
import { NutritionFactsDisplay } from './NutritionFactsDisplay';

interface ResultsDisplayProps {
  analysis: NutritionAnalysis;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);


const ResultCard: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => {
  const colorVariants: { [key: string]: { border: string; bg: string; text: string; iconBg: string } } = {
    green: { border: 'border-green-500', bg: 'bg-white', text: 'text-green-800', iconBg: 'bg-green-100' },
    red: { border: 'border-red-500', bg: 'bg-white', text: 'text-red-800', iconBg: 'bg-red-100' },
    blue: { border: 'border-blue-500', bg: 'bg-white', text: 'text-blue-800', iconBg: 'bg-blue-100' },
    orange: { border: 'border-orange-500', bg: 'bg-white', text: 'text-orange-800', iconBg: 'bg-orange-100' },
  };

  const selectedColor = colorVariants[color] || colorVariants.green;

  return (
    <div className={`${selectedColor.bg} border-t-4 ${selectedColor.border} p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}>
      <h3 className={`flex items-center text-2xl font-bold ${selectedColor.text} mb-4`}>
        <span className={`p-2 rounded-full mr-3 ${selectedColor.iconBg}`}>{icon}</span>
        {title}
      </h3>
      <ul className="space-y-3 text-gray-700 text-lg">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
             <CheckIcon className={`h-6 w-6 mr-3 mt-1 flex-shrink-0 ${selectedColor.text}`} />
             <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ analysis }) => {
  return (
    <div className="animate-fade-in space-y-8">
      <h2 className="text-center text-3xl font-bold text-gray-700">
        <span className="text-yellow-500">{analysis.foodName}</span>, 알려줄게요!
      </h2>

      <ResultCard 
        title="주요 재료" 
        items={analysis.ingredients} 
        icon={<BasketIcon className="h-7 w-7" />}
        color="orange" 
      />

      <NutritionFactsDisplay facts={analysis.nutritionFacts} />

      <ResultCard 
        title="좋은 점" 
        items={analysis.pros} 
        icon={<ThumbsUpIcon className="h-7 w-7" />}
        color="green" 
      />
      <ResultCard 
        title="아쉬운 점" 
        items={analysis.cons} 
        icon={<ThumbsDownIcon className="h-7 w-7" />}
        color="red"
      />
      <ResultCard 
        title="건강 꿀팁" 
        items={analysis.tips} 
        icon={<LightBulbIcon className="h-7 w-7" />}
        color="blue"
      />
    </div>
  );
};

// Add custom animation to tailwind config if possible, or use a style tag for simplicity.
// For this single-file setup, we add it directly for keyframes.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.7s ease-in-out forwards;
}
`;
document.head.appendChild(style);
import React, { useState, useEffect } from 'react';
import { NutritionFacts } from '../types';

interface NutritionFactsProps {
  facts: NutritionFacts;
}

const NutritionBar: React.FC<{ label: string; value: string; barGradient: string; textColor: string; icon: string; percentage: number; delay: string; }> = ({ label, value, barGradient, textColor, icon, percentage, delay }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
      // Set a timeout to trigger the animation after the component has mounted.
      const timer = setTimeout(() => {
        setWidth(percentage);
      }, 100); // Small delay to ensure CSS transition is applied
      return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-lg font-bold text-gray-700 flex items-center">{icon}<span className="ml-2">{label}</span></span>
                <span className={`text-lg font-bold ${textColor}`}>{value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner overflow-hidden">
                <div 
                    className={`${barGradient} h-5 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-1000 ease-out`}
                    style={{ width: `${width}%`, transitionDelay: delay }}
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="progressbar"
                    aria-label={`${label} percentage`}
                >
                  {width > 15 && `${Math.round(percentage)}%`}
                </div>
            </div>
        </div>
    );
};


export const NutritionFactsDisplay: React.FC<NutritionFactsProps> = ({ facts }) => {
  const { calories, carbs, protein, fat, vitamins } = facts;

  // Ensure values are numbers and handle null/undefined
  const numCarbs = Number(carbs) || 0;
  const numProtein = Number(protein) || 0;
  const numFat = Number(fat) || 0;

  const totalMacronutrients = numCarbs + numProtein + numFat;

  const carbPercent = totalMacronutrients > 0 ? (numCarbs / totalMacronutrients) * 100 : 0;
  const proteinPercent = totalMacronutrients > 0 ? (numProtein / totalMacronutrients) * 100 : 0;
  const fatPercent = totalMacronutrients > 0 ? (numFat / totalMacronutrients) * 100 : 0;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-t-4 border-gray-300 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <h3 className="flex items-center text-2xl font-bold text-gray-700 mb-6">
        <span className="text-3xl mr-3">🔬</span>
        영양 성분 돋보기
      </h3>
      <div className="space-y-6">
        <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
            <span className="text-lg font-bold text-gray-700 flex items-center">🔥<span className="ml-2">열량</span></span>
            <span className={`text-xl font-bold text-red-600`}>{calories}</span>
        </div>

        <NutritionBar label="탄수화물" value={`${numCarbs}g`} barGradient="bg-gradient-to-r from-yellow-400 to-orange-500" textColor="text-orange-600" icon="🍚" percentage={carbPercent} delay="0s" />
        <NutritionBar label="단백질" value={`${numProtein}g`} barGradient="bg-gradient-to-r from-green-400 to-teal-500" textColor="text-teal-600" icon="💪" percentage={proteinPercent} delay="0.2s" />
        <NutritionBar label="지방" value={`${numFat}g`} barGradient="bg-gradient-to-r from-blue-400 to-indigo-500" textColor="text-indigo-600" icon="🥑" percentage={fatPercent} delay="0.4s" />
        
        <div className="pt-4">
             <h4 className="text-xl font-bold text-purple-700 mb-2 flex items-center">
                <span className="text-2xl mr-2">🌟</span>
                비타민 & 무기질
             </h4>
             <p className="text-gray-700 text-lg bg-purple-50 p-4 rounded-lg border border-purple-200">{vitamins}</p>
        </div>
      </div>
    </div>
  );
};
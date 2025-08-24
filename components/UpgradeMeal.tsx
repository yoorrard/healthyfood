import React, { useState, useEffect, useCallback } from 'react';
import { RecipeDisplay } from './RecipeDisplay';
import { UpgradedRecipe } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface UpgradeMealProps {
  originalFoodName: string;
  onGenerateRecipe: (ingredients: string[]) => void;
  isLoading: boolean;
  recipe: UpgradedRecipe | null;
  error: string | null;
  onBackToAnalysis: () => void;
  onGoHome: () => void;
  onResetRecipe: () => void;
  onCheckHealthScore: () => void;
}

const allIngredients = [
    // 채소 (Vegetables)
    "버섯 🍄", "브로콜리 🥦", "파프리카 🌈", "양파 🧅", "토마토 🍅", "옥수수 🌽",
    "시금치 🌿", "마늘 🧄", "감자 🥔", "고구마 🍠", "오이 🥒", "가지 🍆",
    "단호박 🎃", "양배추 🥬", "애호박 🥒", "당근 🥕", "청경채 🥬", "콩나물 🌱",
    "숙주나물 🌱", "깻잎 🍃", "아스파라거스 🥢", "파 🌿", "무 ⚪️", "비트 🟣",
    "완두콩 🟢", "피망 🫑", "김치 🌶️", "상추 🥬", "샐러리 🌿",

    // 단백질 (Proteins)
    "닭가슴살 🐔", "두부 🤍", "계란 🥚", "새우 🍤", "연어 🐟", "소고기 🥩",
    "해산물 🦀", "오리고기 🦆", "돼지고기 🐷", "퀴노아 🌾", "병아리콩 🌰",
    "렌틸콩 🫘", "오징어 🦑", "베이컨 🥓", "햄 🍖", "참치캔 🥫", "소시지 🌭",
    "미트볼 🧆", "콩 🫘", "게맛살 🦀", "고등어 🐟",

    // 유제품 및 기타 (Dairy & Misc)
    "치즈 🧀", "그릭요거트 🍦", "아보카도 🥑", "올리브 🫒", "우유 🥛", 
    "모짜렐라 치즈 🧀", "체다치즈 🧀", "김 🍙", "옥수수콘 🌽",

    // 견과류 및 씨앗 (Nuts & Seeds)
    "아몬드 🌰", "호두 🧠", "해바라기씨 🌻", "참깨 ✨", "땅콩 🥜",

    // 과일 (Fruits)
    "파인애플 🍍", "사과 🍎", "레몬 🍋", "딸기 🍓", "바나나 🍌", "블루베리 🫐",
    "오렌지 🍊", "키위 🥝", "망고 🥭", "포도 🍇", "복숭아 🍑",

    // 곡물 (Grains)
    "현미밥 🍚", "귀리 🥣", "파스타면 🍝", "라면 🍜", "식빵 🍞", "또띠아 🌮",
    
    // 소스 및 양념 (Sauces & Seasonings)
    "케첩 🥫", "마요네즈 🥚", "꿀 🍯"
];


const shuffleArray = (array: string[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


export const UpgradeMeal: React.FC<UpgradeMealProps> = ({ 
    originalFoodName, 
    onGenerateRecipe, 
    isLoading, 
    recipe, 
    error, 
    onBackToAnalysis, 
    onGoHome, 
    onResetRecipe, 
    onCheckHealthScore 
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [displayedIngredients, setDisplayedIngredients] = useState<string[]>([]);

  const recommendIngredients = useCallback(() => {
    const shuffled = shuffleArray(allIngredients);
    setDisplayedIngredients(shuffled.slice(0, 12));
    setSelectedIngredients([]);
  }, []);

  useEffect(() => {
    recommendIngredients();
  }, [recommendIngredients]);


  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(item => item !== ingredient);
      } else if (prev.length < 3) {
        return [...prev, ingredient];
      }
      return prev;
    });
  };

  const handleRecipeSubmit = () => {
    const ingredientsForPrompt = selectedIngredients.map(item => item.split(' ')[0]);
    onGenerateRecipe(ingredientsForPrompt);
  };
  
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 animate-fade-in">
      {!recipe && !isLoading && (
        <div className="mb-6">
          <button
            onClick={onBackToAnalysis}
            className="flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors duration-200"
            aria-label="분석 결과로 돌아가기"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            뒤로 가기
          </button>
        </div>
      )}

      {!recipe && !isLoading && (
        <>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-700">
              <span className="text-orange-500">{originalFoodName}</span> 건강하게 Level Up!
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              어떤 재료를 추가해서 더 맛있고 건강하게 만들어 볼까요?
            </p>
            <p className="mt-2 text-sm text-gray-500">
              (최대 3개까지 선택할 수 있어요!)
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-8">
            {displayedIngredients.map(ingredient => {
              const isSelected = selectedIngredients.includes(ingredient);
              const isDisabled = !isSelected && selectedIngredients.length >= 3;
              return (
                <button
                  key={ingredient}
                  onClick={() => handleIngredientToggle(ingredient)}
                  disabled={isDisabled}
                  className={`p-4 text-lg font-semibold border-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                    isSelected
                      ? 'bg-yellow-400 border-yellow-500 text-white shadow-md'
                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-yellow-100'
                  } ${ isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
                >
                  {ingredient}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
             <button
              onClick={recommendIngredients}
              className="w-full sm:w-auto px-6 py-4 text-lg font-bold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300"
            >
              다시 추천받기 🔄
            </button>
            <button
              onClick={handleRecipeSubmit}
              disabled={selectedIngredients.length === 0 || isLoading}
              className="w-full sm:w-auto px-10 py-4 text-xl font-bold text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? '요리 중... 🍳' : '요리 시작!'}
            </button>
          </div>
        </>
      )}

      {isLoading && (
        <div className="text-center p-8">
            <div className="flex justify-center items-center mb-4">
                <svg className="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <p className="text-xl font-semibold text-gray-700">
                맛있는 레시피를 만들고 있어요!
            </p>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mt-6" role="alert">
          <p className="font-bold">오류!</p>
          <p>{error}</p>
        </div>
      )}

      {recipe && !isLoading && <RecipeDisplay 
        recipe={recipe} 
        onResetRecipe={onResetRecipe} 
        onGoHome={onGoHome} 
        onCheckHealthScore={onCheckHealthScore}
      />}

    </div>
  );
};


import React from 'react';

interface FoodInputFormProps {
  foodName: string;
  setFoodName: (name: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isLoading: boolean;
}

export const FoodInputForm: React.FC<FoodInputFormProps> = ({ foodName, setFoodName, handleSubmit, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        placeholder="예) 떡볶이, 피자, 김치"
        className="flex-grow w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-yellow-500 transition-shadow duration-300"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-8 py-3 text-lg font-bold text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
        disabled={isLoading}
      >
        {isLoading ? '분석 중...' : '알려주세요!'}
      </button>
    </form>
  );
};
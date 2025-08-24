import React, { useState, useCallback, useEffect } from 'react';
import { NutritionAnalysis, UpgradedRecipe, HealthScoreAnalysis } from './types';
import { fetchNutritionInfo } from './services/geminiService';
import { FoodInputForm } from './components/FoodInputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingIndicator } from './components/LoadingIndicator';
import { WelcomeMessage } from './components/WelcomeMessage';
import { UpgradeMeal } from './components/UpgradeMeal';
import { HealthScoreModal } from './components/HealthScoreModal';

const App: React.FC = () => {
  const [foodName, setFoodName] = useState<string>('');
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Upgrade feature states
  const [upgradeViewVisible, setUpgradeViewVisible] = useState<boolean>(false);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [upgradedRecipe, setUpgradedRecipe] = useState<UpgradedRecipe | null>(null);

  // Health Score states
  const [isCheckingHealthScore, setIsCheckingHealthScore] = useState<boolean>(false);
  const [healthScore, setHealthScore] = useState<HealthScoreAnalysis | null>(null);
  const [healthScoreError, setHealthScoreError] = useState<string | null>(null);
  const [isHealthScoreModalOpen, setIsHealthScoreModalOpen] = useState<boolean>(false);

  const resetHealthScoreStates = () => {
    setIsCheckingHealthScore(false);
    setHealthScore(null);
    setHealthScoreError(null);
    setIsHealthScoreModalOpen(false);
  };

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!foodName.trim()) {
      setError('음식 이름을 입력해주세요!');
      return;
    }

    setIsLoading(true);
    setAnalysis(null);
    setError(null);
    setUpgradeViewVisible(false);
    setUpgradedRecipe(null);
    resetHealthScoreStates(); // Reset on new search

    try {
      const result = await fetchNutritionInfo(foodName);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setError('정보를 가져오는 데 실패했어요. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [foodName]);

  const handleGenerateRecipe = useCallback(async (ingredients: string[]) => {
    if (!analysis) return;
    
    setIsUpgrading(true);
    setUpgradedRecipe(null);
    setError(null);
    resetHealthScoreStates(); // Reset when generating a new recipe

    try {
      const { generateUpgradedRecipe } = await import('./services/geminiService');
      const recipe = await generateUpgradedRecipe(analysis.foodName, ingredients);
      setUpgradedRecipe(recipe);
    } catch (e) {
      setError('레시피를 만드는 데 실패했어요. 다시 시도해 주세요.');
    } finally {
      setIsUpgrading(false);
    }
  }, [analysis]);
  
  const handleCheckHealthScore = useCallback(async () => {
    if (!upgradedRecipe) return;

    setIsHealthScoreModalOpen(true);
    setIsCheckingHealthScore(true);
    setHealthScore(null);
    setHealthScoreError(null);

    try {
        const { fetchHealthScore } = await import('./services/geminiService');
        const score = await fetchHealthScore(upgradedRecipe);
        setHealthScore(score);
    } catch (e) {
        setHealthScoreError('건강 점수를 계산하는 데 실패했어요. 다시 시도해 주세요.');
    } finally {
        setIsCheckingHealthScore(false);
    }
  }, [upgradedRecipe]);

  const handleCloseHealthScoreModal = useCallback(() => {
    setIsHealthScoreModalOpen(false);
    setTimeout(() => {
      setHealthScore(null);
      setHealthScoreError(null);
    }, 300);
  }, []);

  const handleBackToAnalysis = useCallback(() => {
    setUpgradeViewVisible(false);
    setUpgradedRecipe(null);
    setError(null);
    resetHealthScoreStates();
  }, []);
  
  const handleGoHome = useCallback(() => {
    setFoodName('');
    setAnalysis(null);
    setError(null);
    setUpgradeViewVisible(false);
    setUpgradedRecipe(null);
    resetHealthScoreStates();
  }, []);

  const handleResetRecipe = useCallback(() => {
    setUpgradedRecipe(null);
    setError(null);
    resetHealthScoreStates();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 text-gray-800">
      <header className="text-center my-8 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-800 pb-2 flex items-center justify-center gap-x-3">
          <span>🥗</span>
          <span className="bg-gradient-to-r from-green-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
            AI 영양 선생님
          </span>
          <span>🧑‍🏫</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          궁금한 음식의 영양 정보를 쉽고 재미있게 알아봐요!
        </p>
      </header>

      <main className="w-full max-w-3xl mx-auto">
        {!upgradeViewVisible && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
            <FoodInputForm
              foodName={foodName}
              setFoodName={setFoodName}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        )}

        <div className="mt-8">
          {isLoading && <LoadingIndicator />}
          {error && !isUpgrading && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
              <p className="font-bold">오류!</p>
              <p>{error}</p>
            </div>
          )}
          
          {analysis && !isLoading && !upgradeViewVisible && (
            <div className="animate-fade-in">
              <ResultsDisplay analysis={analysis} />
              <div className="text-center mt-10">
                <button
                  onClick={() => setUpgradeViewVisible(true)}
                  className="px-8 py-4 text-xl font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  건강 식단으로 Upgrade! 🚀
                </button>
              </div>
            </div>
          )}

          {analysis && upgradeViewVisible && (
            <UpgradeMeal 
              originalFoodName={analysis.foodName}
              onGenerateRecipe={handleGenerateRecipe}
              isLoading={isUpgrading}
              recipe={upgradedRecipe}
              error={error}
              onBackToAnalysis={handleBackToAnalysis}
              onGoHome={handleGoHome}
              onResetRecipe={handleResetRecipe}
              onCheckHealthScore={handleCheckHealthScore}
            />
          )}

          {!isLoading && !error && !analysis && <WelcomeMessage />}
        </div>
      </main>
      
      <footer className="text-center text-gray-500 text-sm mt-12 pb-4">
        <p>&copy; 2025 AI 영양 선생님. All Rights Reserved.</p>
      </footer>

      {isHealthScoreModalOpen && (
        <HealthScoreModal 
            isOpen={isHealthScoreModalOpen}
            onClose={handleCloseHealthScoreModal}
            isLoading={isCheckingHealthScore}
            scoreData={healthScore}
            error={healthScoreError}
        />
      )}
    </div>
  );
};

export default App;
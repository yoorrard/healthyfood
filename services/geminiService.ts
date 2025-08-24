import { NutritionAnalysis, UpgradedRecipe, HealthScoreAnalysis } from '../types';

// The new secure endpoint for our Vercel serverless function
const apiEndpoint = '/api/gemini';

/**
 * A helper function to call our secure serverless function.
 * @param action - The specific action to perform (e.g., 'fetchNutritionInfo').
 * @param payload - The data needed for that action.
 * @returns The JSON response from the function.
 */
async function callApi<T>(action: string, payload: object): Promise<T> {
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '서버와 통신하는 데 실패했어요.' }));
      throw new Error(errorData.message || '알 수 없는 오류가 발생했어요.');
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`Error calling API for action "${action}":`, error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error('API 요청 중 문제가 발생했어요.');
  }
}

export async function fetchNutritionInfo(foodName: string): Promise<NutritionAnalysis> {
  return callApi<NutritionAnalysis>('fetchNutritionInfo', { foodName });
}

export async function generateUpgradedRecipe(originalFoodName: string, ingredients: string[]): Promise<UpgradedRecipe> {
  return callApi<UpgradedRecipe>('generateUpgradedRecipe', { originalFoodName, ingredients });
}

export async function fetchHealthScore(recipe: UpgradedRecipe): Promise<HealthScoreAnalysis> {
  return callApi<HealthScoreAnalysis>('fetchHealthScore', { recipe });
}
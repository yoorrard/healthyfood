export interface NutritionFacts {
  calories: string;
  carbs: number;
  protein: number;
  fat: number;
  vitamins: string;
}

export interface NutritionAnalysis {
  foodName: string;
  ingredients: string[];
  nutritionFacts: NutritionFacts;
  pros: string[];
  cons: string[];
  tips: string[];
}

export interface UpgradedRecipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tip?: string;
}

export interface HealthScoreAnalysis {
  score: number;
  comment: string;
}

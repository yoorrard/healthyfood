// This file is designed to run securely on Vercel's serverless environment.
// It cannot be bundled with the frontend code.
// Ensure you have added your Google AI API key as an environment variable named `API_KEY` in your Vercel project settings.

import { GoogleGenAI, Type } from "@google/genai";

// --- Type definitions (copied from types.ts to make the function self-contained) ---

interface NutritionFacts {
  calories: string;
  carbs: number;
  protein: number;
  fat: number;
  vitamins: string;
}

interface NutritionAnalysis {
  foodName: string;
  ingredients: string[];
  nutritionFacts: NutritionFacts;
  pros: string[];
  cons: string[];
  tips: string[];
}

interface UpgradedRecipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tip?: string;
}

interface HealthScoreAnalysis {
  score: number;
  comment: string;
}

// --- Gemini API Initialization (runs securely on the server) ---

// This will only work if the API_KEY environment variable is set in Vercel
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

// --- Handlers for each action ---

async function handleFetchNutritionInfo(payload: { foodName: string }): Promise<NutritionAnalysis> {
  const { foodName } = payload;
  const prompt = `'${foodName}'라는 음식에 대해 알려줘. 이 음식의 주요 재료, 대표적인 영양 성분(열량은 kcal 단위 문자열로, 탄수화물, 단백질, 지방 함량은 1인분 기준 g(그램) 단위의 숫자로), 영양학적인 좋은 점, 아쉬운 점, 그리고 이 음식을 더 건강하게 즐길 수 있는 방법을 각각 2~3가지씩 목록 형태로 알려줘.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "너는 초등학생을 위한 친절하고 상냥한 AI 영양사야. 아이들의 눈높이에 맞춰서 아주 쉽고 재미있게 설명해줘. 문장 끝에 이모지를 적절하게 사용해서 설명을 더 친근하게 만들어줘. 예를 들어, '비타민 C가 많아서 감기 예방에 좋아요! 🍊' 처럼 말이야.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodName: { type: Type.STRING, description: "분석한 음식의 이름" },
          ingredients: { type: Type.ARRAY, description: "음식의 주요 재료 목록", items: { type: Type.STRING } },
          nutritionFacts: {
            type: Type.OBJECT,
            description: "음식의 주요 영양 성분 정보",
            properties: {
              calories: { type: Type.STRING, description: "열량 (예: '350kcal')" },
              carbs: { type: Type.NUMBER, description: "탄수화물 함량 (g 단위 숫자)" },
              protein: { type: Type.NUMBER, description: "단백질 함량 (g 단위 숫자)" },
              fat: { type: Type.NUMBER, description: "지방 함량 (g 단위 숫자)" },
              vitamins: { type: Type.STRING, description: "주요 비타민 및 무기질에 대한 설명" },
            },
            required: ["calories", "carbs", "protein", "fat", "vitamins"]
          },
          pros: { type: Type.ARRAY, description: "음식의 영양학적 좋은 점 목록", items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, description: "음식의 영양학적 아쉬운 점 목록", items: { type: Type.STRING } },
          tips: { type: Type.ARRAY, description: "음식을 더 건강하게 먹는 방법에 대한 팁 목록", items: { type: Type.STRING } }
        },
        required: ["foodName", "ingredients", "nutritionFacts", "pros", "cons", "tips"],
        propertyOrdering: ["foodName", "ingredients", "nutritionFacts", "pros", "cons", "tips"],
      }
    }
  });
  return JSON.parse(response.text.trim());
}

async function handleGenerateUpgradedRecipe(payload: { originalFoodName: string; ingredients: string[] }): Promise<UpgradedRecipe> {
  const { originalFoodName, ingredients } = payload;
  const prompt = `초등학생 고학년이 '${originalFoodName}'에 '${ingredients.join(', ')}' 재료를 추가해서 만들 수 있는 요리 레시피를 제안해줘. 결과는 아래 JSON 형식에 맞춰서 제공해줘.
  - recipeName: 창의적이고 흥미로운 요리 이름
  - description: 아이들이 흥미를 느낄 만한 간단한 요리 설명
  - ingredients: 기존 재료와 추가된 재료를 모두 포함한 전체 준비물 목록
  - steps: 요리 과정을 단계별로 명확하고 간결하게 설명 (5단계 이내). 각 단계 설명 앞에 번호를 붙이지 마세요.
  - tip: 요리를 더 재미있게 만들거나 맛있게 먹을 수 있는 꿀팁 (선택 사항)`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "너는 어린이를 위한 요리 레시피 전문가야. 초등학생 고학년 수준에 맞춰 안전하고 이해하기 쉬운 용어를 사용해줘. 유치한 말투나 과도한 이모지 사용은 자제하고, 명확하고 친절한 설명을 제공해줘.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipeName: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          tip: { type: Type.STRING }
        },
        required: ["recipeName", "description", "ingredients", "steps"]
      }
    }
  });
  return JSON.parse(response.text.trim());
}

async function handleFetchHealthScore(payload: { recipe: UpgradedRecipe }): Promise<HealthScoreAnalysis> {
  const { recipe } = payload;
  const prompt = `다음 요리 레시피를 영양학적 관점에서 분석하고 100점 만점의 '건강 점수'와 간단한 '총평'을 제공해줘. 점수는 재료의 균형, 조리법의 건강성 등을 종합적으로 고려해서 매겨줘.
  - 요리 이름: ${recipe.recipeName}
  - 재료: ${recipe.ingredients.join(', ')}
  - 만드는 법: ${recipe.steps.join(' ')}
  결과는 아래 JSON 형식에 맞춰서 제공해줘. 총평은 전문가의 관점에서 핵심만 간결하게 작성하되, 초등학생 고학년이 이해할 수 있도록 쉬운 용어를 사용해줘. 유치한 말투나 과도한 이모지 사용은 자제해줘.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "너는 전문 영양사야. 레시피를 분석하고, 그 결과를 바탕으로 100점 만점의 건강 점수와 전문적인 총평을 제공해줘. 답변은 초등학생 고학년도 이해할 수 있도록 쉽고 명확해야 해.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "100점 만점의 건강 점수" },
          comment: { type: Type.STRING, description: "레시피에 대한 전반적인 총평" }
        },
        required: ["score", "comment"]
      }
    }
  });
  return JSON.parse(response.text.trim());
}

// --- Main Vercel Serverless Function Handler ---

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  if (!process.env.API_KEY) {
    return res.status(500).json({ message: 'API key is not configured on the server.' });
  }

  try {
    // Vercel automatically parses the JSON body, so no JSON.parse() is needed.
    const { action, payload } = req.body;
    let result;

    switch (action) {
      case 'fetchNutritionInfo':
        result = await handleFetchNutritionInfo(payload);
        break;
      case 'generateUpgradedRecipe':
        result = await handleGenerateUpgradedRecipe(payload);
        break;
      case 'fetchHealthScore':
        result = await handleFetchHealthScore(payload);
        break;
      default:
        return res.status(400).json({ message: 'Invalid action specified' });
    }
    
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in Vercel function:', error);
    const message = error instanceof Error ? error.message : 'An internal server error occurred.';
    return res.status(500).json({ message: `서버에서 오류가 발생했어요: ${message}` });
  }
}
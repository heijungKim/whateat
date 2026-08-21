export interface RecipeIngredient {
  name: string
  essential: boolean
}

export interface Recipe {
  id: string
  name: string
  emoji: string
  category: string
  time: number
  difficulty: '쉬움' | '보통' | '어려움'
  ingredients: RecipeIngredient[]
  steps: string[]
}

export interface MatchedIngredient extends RecipeIngredient {
  owned: boolean
  pantry: boolean
}

export interface RecipeMatch {
  recipe: Recipe
  percent: number
  essentialPercent: number
  owned: MatchedIngredient[]
  missing: MatchedIngredient[]
  cookable: boolean
}

export type Screen = 'home' | 'analyzing' | 'ingredients' | 'recipes' | 'detail'

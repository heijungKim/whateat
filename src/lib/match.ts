import type { Recipe, RecipeMatch, MatchedIngredient } from '../types'
import { RECIPES, PANTRY_ITEMS } from '../data/recipes'
import { isSameIngredient } from './normalize'

export function matchRecipes(ownedIngredients: string[], usePantry: boolean): RecipeMatch[] {
  return RECIPES.map((recipe) => matchOne(recipe, ownedIngredients, usePantry))
    .sort((a, b) => b.percent - a.percent || a.recipe.time - b.recipe.time)
}

function matchOne(recipe: Recipe, ownedIngredients: string[], usePantry: boolean): RecipeMatch {
  const matched: MatchedIngredient[] = recipe.ingredients.map((ing) => {
    const fromFridge = ownedIngredients.some((own) => isSameIngredient(own, ing.name))
    const fromPantry = usePantry && PANTRY_ITEMS.some((p) => isSameIngredient(p, ing.name))
    return { ...ing, owned: fromFridge || fromPantry, pantry: !fromFridge && fromPantry }
  })

  const owned = matched.filter((m) => m.owned)
  const missing = matched.filter((m) => !m.owned)
  const essentials = matched.filter((m) => m.essential)
  const ownedEssentials = essentials.filter((m) => m.owned)

  const percent = Math.round((owned.length / matched.length) * 100)
  const essentialPercent =
    essentials.length === 0 ? 100 : Math.round((ownedEssentials.length / essentials.length) * 100)

  return {
    recipe,
    percent,
    essentialPercent,
    owned,
    missing,
    cookable: essentialPercent === 100,
  }
}

export function coupangLink(ingredient: string): string {
  // TODO: 쿠팡 파트너스 가입 후 제휴 링크로 교체
  return `https://www.coupang.com/np/search?q=${encodeURIComponent(ingredient)}`
}

export function kurlyLink(ingredient: string): string {
  return `https://www.kurly.com/search?sword=${encodeURIComponent(ingredient)}`
}

export function youtubeLink(recipeName: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(recipeName + ' 레시피')}`
}

export function recipeSearchLink(recipeName: string): string {
  return `https://www.10000recipe.com/recipe/list.html?q=${encodeURIComponent(recipeName)}`
}

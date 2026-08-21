import type { RecipeMatch } from '../types'

interface Props {
  matches: RecipeMatch[]
  usePantry: boolean
  onTogglePantry: (v: boolean) => void
  onSelect: (m: RecipeMatch) => void
}

export default function RecipeList({ matches, usePantry, onTogglePantry, onSelect }: Props) {
  return (
    <div className="recipe-list">
      <h2 className="section-title">추천 요리 🍳</h2>
      <label className="pantry-toggle">
        <input
          type="checkbox"
          checked={usePantry}
          onChange={(e) => onTogglePantry(e.target.checked)}
        />
        기본 양념(소금·간장·식용유 등) 보유
      </label>

      {matches.map((m) => (
        <button key={m.recipe.id} className="recipe-card" onClick={() => onSelect(m)}>
          <span className="recipe-emoji">{m.recipe.emoji}</span>
          <span className="recipe-info">
            <span className="recipe-name">
              {m.recipe.name}
              {m.cookable && <span className="badge-cookable">바로 가능!</span>}
            </span>
            <span className="recipe-meta">
              {m.recipe.category} · {m.recipe.time}분 · {m.recipe.difficulty}
            </span>
            <span className="percent-bar">
              <span
                className={`percent-fill ${m.percent >= 70 ? 'high' : m.percent >= 40 ? 'mid' : 'low'}`}
                style={{ width: `${m.percent}%` }}
              />
            </span>
          </span>
          <span className={`percent-num ${m.percent >= 70 ? 'high' : m.percent >= 40 ? 'mid' : 'low'}`}>
            {m.percent}%
            <small>보유</small>
          </span>
        </button>
      ))}
    </div>
  )
}

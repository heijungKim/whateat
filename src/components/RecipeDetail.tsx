import type { RecipeMatch } from '../types'
import { coupangLink, kurlyLink, youtubeLink, recipeSearchLink } from '../lib/match'

interface Props {
  match: RecipeMatch
}

export default function RecipeDetail({ match }: Props) {
  const { recipe, percent, owned, missing, cookable } = match

  return (
    <div className="recipe-detail">
      <div className="detail-hero">
        <span className="detail-emoji">{recipe.emoji}</span>
        <h2 className="detail-name">{recipe.name}</h2>
        <p className="recipe-meta">
          {recipe.category} · {recipe.time}분 · {recipe.difficulty}
        </p>
        <div className={`detail-percent ${cookable ? 'high' : ''}`}>
          재료 보유율 <strong>{percent}%</strong>
          {cookable && ' · 필수 재료 완비 ✅'}
        </div>
      </div>

      <section className="detail-section">
        <h3>보유한 재료 ✅</h3>
        <ul className="ing-list">
          {owned.map((ing) => (
            <li key={ing.name} className="ing-owned">
              {ing.name}
              {ing.essential && <span className="tag-essential">필수</span>}
              {ing.pantry && <span className="tag-pantry">기본양념</span>}
            </li>
          ))}
          {owned.length === 0 && <li className="empty">보유한 재료가 없어요</li>}
        </ul>
      </section>

      {missing.length > 0 && (
        <section className="detail-section">
          <h3>부족한 재료 🛒</h3>
          <ul className="ing-list">
            {missing.map((ing) => (
              <li key={ing.name} className="ing-missing">
                <span>
                  {ing.name}
                  {ing.essential && <span className="tag-essential">필수</span>}
                </span>
                <span className="buy-links">
                  <a href={coupangLink(ing.name)} target="_blank" rel="noreferrer" className="buy-btn coupang">
                    쿠팡
                  </a>
                  <a href={kurlyLink(ing.name)} target="_blank" rel="noreferrer" className="buy-btn kurly">
                    컬리
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="detail-section">
        <h3>만드는 법 👨‍🍳</h3>
        <ol className="steps">
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="detail-section">
        <h3>더 알아보기 🔗</h3>
        <a href={youtubeLink(recipe.name)} target="_blank" rel="noreferrer" className="link-btn youtube">
          ▶️ 유튜브 레시피 영상 보기
        </a>
        <a href={recipeSearchLink(recipe.name)} target="_blank" rel="noreferrer" className="link-btn recipe-site">
          📖 만개의레시피에서 자세히 보기
        </a>
      </section>
    </div>
  )
}

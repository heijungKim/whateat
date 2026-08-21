import { useState } from 'react'

interface Props {
  ingredients: string[]
  onChange: (next: string[]) => void
  onAddPhoto: () => void
  onDone: () => void
}

export default function IngredientEditor({ ingredients, onChange, onAddPhoto, onDone }: Props) {
  const [input, setInput] = useState('')

  const addManual = () => {
    const name = input.trim()
    if (!name) return
    if (!ingredients.includes(name)) onChange([...ingredients, name])
    setInput('')
  }

  return (
    <div className="ingredient-editor">
      <h2 className="section-title">내 재료 🥕</h2>
      <p className="section-desc">잘못된 재료는 ✕를 눌러 지우고, 빠진 재료는 직접 추가하세요</p>

      <div className="chips">
        {ingredients.map((ing) => (
          <span key={ing} className="chip">
            {ing}
            <button
              className="chip-remove"
              onClick={() => onChange(ingredients.filter((i) => i !== ing))}
              aria-label={`${ing} 삭제`}
            >
              ✕
            </button>
          </span>
        ))}
        {ingredients.length === 0 && <p className="empty">아직 재료가 없어요</p>}
      </div>

      <div className="add-row">
        <input
          className="input"
          value={input}
          placeholder="재료 직접 추가 (예: 계란)"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addManual()}
        />
        <button className="btn-small" onClick={addManual}>
          추가
        </button>
      </div>

      <button className="btn-secondary" onClick={onAddPhoto}>
        📷 사진 더 찍기
      </button>
      <button className="btn-primary" onClick={onDone} disabled={ingredients.length === 0}>
        🍳 만들 수 있는 요리 보기
      </button>
    </div>
  )
}

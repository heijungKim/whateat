import { useEffect, useMemo, useRef, useState } from 'react'
import type { RecipeMatch, Screen } from './types'
import { matchRecipes } from './lib/match'
import { compressImage, recognizeIngredients, friendlyApiError } from './lib/vision'
import { normalize } from './lib/normalize'
import IngredientEditor from './components/IngredientEditor'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import SettingsModal from './components/SettingsModal'

const LS_KEY_API = 'whateat.apiKey'
const LS_KEY_INGREDIENTS = 'whateat.ingredients'
const LS_KEY_PANTRY = 'whateat.usePantry'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_KEY_API) ?? '')
  const [ingredients, setIngredients] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY_INGREDIENTS) ?? '[]')
    } catch {
      return []
    }
  })
  const [usePantry, setUsePantry] = useState(() => localStorage.getItem(LS_KEY_PANTRY) !== 'false')
  const [selected, setSelected] = useState<RecipeMatch | null>(null)
  const [error, setError] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    localStorage.setItem(LS_KEY_INGREDIENTS, JSON.stringify(ingredients))
  }, [ingredients])
  useEffect(() => {
    localStorage.setItem(LS_KEY_PANTRY, String(usePantry))
  }, [usePantry])

  const saveApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem(LS_KEY_API, key)
  }

  const matches = useMemo(
    () => (ingredients.length > 0 ? matchRecipes(ingredients, usePantry) : []),
    [ingredients, usePantry],
  )

  const onPhotoPicked = async (file: File) => {
    if (!apiKey) {
      setShowSettings(true)
      return
    }
    setError('')
    setScreen('analyzing')
    try {
      const base64 = await compressImage(file)
      const recognized = await recognizeIngredients(apiKey, base64)
      const merged = [...ingredients]
      for (const item of recognized) {
        if (!merged.some((m) => normalize(m) === normalize(item))) merged.push(item)
      }
      setIngredients(merged)
      setScreen('ingredients')
    } catch (e) {
      setError(friendlyApiError(e))
      setScreen('home')
    }
  }

  const openCamera = () => fileInputRef.current?.click()

  return (
    <div className="app">
      <header className="header">
        {screen !== 'home' && screen !== 'analyzing' ? (
          <button
            className="icon-btn"
            onClick={() => {
              if (screen === 'detail') setScreen('recipes')
              else if (screen === 'recipes') setScreen('ingredients')
              else setScreen('home')
            }}
            aria-label="뒤로"
          >
            ←
          </button>
        ) : (
          <span className="icon-btn" />
        )}
        <h1 className="title" onClick={() => setScreen('home')}>
          오늘 뭐먹지? 🍽️
        </h1>
        <button className="icon-btn" onClick={() => setShowSettings(true)} aria-label="설정">
          ⚙️
        </button>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) onPhotoPicked(file)
        }}
      />

      <main className="main">
        {screen === 'home' && (
          <div className="home">
            <div className="home-hero">
              <div className="home-emoji">📸🧊</div>
              <p className="home-desc">
                냉장고 사진을 찍으면
                <br />
                만들 수 있는 요리를 찾아드려요
              </p>
            </div>
            {error && <p className="error">{error}</p>}
            <button className="btn-primary" onClick={openCamera}>
              📷 냉장고 사진 찍기
            </button>
            <button className="btn-secondary" onClick={() => setScreen('ingredients')}>
              {ingredients.length > 0
                ? `🥕 내 재료 보기 (${ingredients.length}개)`
                : '✍️ 재료 직접 입력하기 (무료)'}
            </button>
            {!apiKey && (
              <p className="hint" onClick={() => setShowSettings(true)}>
                사진 인식은 설정(⚙️)에 Claude API 키를 등록해야 동작해요
                <br />
                키 없이도 재료 직접 입력으로 모든 기능을 쓸 수 있어요
              </p>
            )}
          </div>
        )}

        {screen === 'analyzing' && (
          <div className="analyzing">
            <div className="spinner" />
            <p>냉장고 속 재료를 분석하고 있어요...</p>
          </div>
        )}

        {screen === 'ingredients' && (
          <IngredientEditor
            ingredients={ingredients}
            onChange={setIngredients}
            onAddPhoto={openCamera}
            onDone={() => setScreen('recipes')}
          />
        )}

        {screen === 'recipes' && (
          <RecipeList
            matches={matches}
            usePantry={usePantry}
            onTogglePantry={setUsePantry}
            onSelect={(m) => {
              setSelected(m)
              setScreen('detail')
            }}
          />
        )}

        {screen === 'detail' && selected && (
          <RecipeDetail
            match={matches.find((m) => m.recipe.id === selected.recipe.id) ?? selected}
          />
        )}
      </main>

      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          onSave={saveApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

import { useState } from 'react'

interface Props {
  apiKey: string
  onSave: (key: string) => void
  onClose: () => void
}

export default function SettingsModal({ apiKey, onSave, onClose }: Props) {
  const [value, setValue] = useState(apiKey)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>설정 ⚙️</h2>
        <label className="field-label">사진 인식 API 키 (Gemini 또는 Claude)</label>
        <input
          className="input"
          type="password"
          value={value}
          placeholder="AIza... 또는 sk-ant-..."
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="hint">
          🆓 <strong>무료로 쓰려면</strong>:{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
            Google AI Studio
          </a>
          에서 구글 계정으로 Gemini 키를 발급받으세요 (카드 등록 불필요, AIza로 시작)
          <br />
          💎 정확도 우선(유료):{' '}
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
            Claude 키
          </a>{' '}
          (sk-ant-로 시작)
          <br />키 종류는 자동으로 구분되며, 이 기기의 브라우저에만 저장됩니다.
        </p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            닫기
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              onSave(value.trim())
              onClose()
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}

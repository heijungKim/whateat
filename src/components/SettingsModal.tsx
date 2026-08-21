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
        <label className="field-label">Claude API 키</label>
        <input
          className="input"
          type="password"
          value={value}
          placeholder="sk-ant-..."
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="hint">
          키는 이 기기의 브라우저에만 저장되며 Anthropic API 호출에만 사용됩니다.{' '}
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
            키 발급받기
          </a>
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

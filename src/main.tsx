import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { detectProvider } from './lib/vision'
import './index.css'

// 주소 뒤에 #key=API키 를 붙여 접속하면 키를 자동 저장한다.
// 예: https://.../whateat/#key=AIza...  — 한 번 접속하면 이 브라우저에 저장되어
// 이후에는 일반 주소로도 동작한다. 키는 주소창에서 즉시 지워 기록에 남지 않게 한다.
const hashMatch = window.location.hash.match(/key=([^&]+)/)
if (hashMatch) {
  const key = decodeURIComponent(hashMatch[1]).trim()
  if (detectProvider(key)) {
    localStorage.setItem('whateat.apiKey', key)
  }
  history.replaceState(null, '', window.location.pathname + window.location.search)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

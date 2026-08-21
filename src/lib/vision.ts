import Anthropic from '@anthropic-ai/sdk'

const PROMPT = `이 사진은 냉장고 내부(또는 식재료) 사진입니다. 사진에서 식별할 수 있는 식재료를 모두 찾아주세요.

규칙:
- 한국어 재료명으로 답하세요 (예: 계란, 대파, 돼지고기, 김치)
- 구체적인 브랜드명 대신 일반 재료명을 쓰세요 (예: "스팸" 대신 "햄")
- 확실하지 않은 것은 제외하세요
- 반드시 아래 JSON 형식으로만 답하세요. 다른 텍스트는 쓰지 마세요.

{"ingredients": ["재료1", "재료2", ...]}`

// 사진을 긴 변 1024px 이하 JPEG로 압축해 토큰/전송량을 줄인다
export async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const maxSide = 1024
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
  return dataUrl.split(',')[1]
}

export async function recognizeIngredients(apiKey: string, imageBase64: string): Promise<string[]> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.beta.messages.create({
    model: 'claude-opus-5',
    max_tokens: 2048,
    output_config: { effort: 'low' },
    betas: ['server-side-fallback-2026-06-01'],
    fallbacks: [{ model: 'claude-opus-4-8' }],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
          },
          { type: 'text', text: PROMPT },
        ],
      },
    ],
  })

  if (response.stop_reason === 'refusal') {
    throw new Error('사진을 분석할 수 없습니다. 냉장고 사진인지 확인 후 다시 시도해주세요.')
  }

  const text = response.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')

  return parseIngredients(text)
}

function parseIngredients(text: string): string[] {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('재료를 인식하지 못했습니다. 다시 시도해주세요.')
  try {
    const parsed = JSON.parse(jsonMatch[0])
    if (!Array.isArray(parsed.ingredients)) throw new Error()
    return parsed.ingredients
      .filter((i: unknown): i is string => typeof i === 'string')
      .map((i: string) => i.trim())
      .filter((i: string) => i.length > 0)
  } catch {
    throw new Error('재료 인식 결과를 읽을 수 없습니다. 다시 시도해주세요.')
  }
}

export function friendlyApiError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    return 'API 키가 올바르지 않습니다. 설정에서 키를 확인해주세요.'
  }
  if (error instanceof Anthropic.RateLimitError) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return '네트워크 연결을 확인해주세요.'
  }
  if (error instanceof Anthropic.APIError) {
    return `API 오류가 발생했습니다 (${error.status}). 잠시 후 다시 시도해주세요.`
  }
  if (error instanceof Error) return error.message
  return '알 수 없는 오류가 발생했습니다.'
}

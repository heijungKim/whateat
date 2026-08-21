# 오늘 뭐먹지? 🍽️

냉장고 사진을 찍으면 만들 수 있는 요리를 찾아주는 모바일 웹앱.

**▶ 라이브: https://heijungkim.github.io/whateat/**

## 주요 기능

1. **냉장고 사진 촬영** → Claude API 비전으로 식재료 자동 인식 (잘못 인식된 재료는 수동 수정 가능)
2. **레시피 매칭** → 로컬 레시피 DB와 대조해 **재료 보유율 %** 계산, 높은 순으로 정렬
   - 필수 재료를 모두 갖추면 "바로 가능!" 배지
   - "기본 양념 보유" 토글: 소금·간장·식용유 등은 보유한 것으로 간주
3. **부족한 재료 구매** → 쿠팡 / 마켓컬리 검색 링크 (제휴 링크로 교체 가능)
4. **레시피 참고** → 유튜브 레시피 영상 검색, 만개의레시피 링크

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드 (dist/)
npm run deploy   # 빌드 후 gh-pages 브랜치로 GitHub Pages 배포
```

> 참고: 현재 gh CLI 토큰에 `workflow` 권한이 없어 GitHub Actions 자동 배포 대신
> `npm run deploy` 수동 배포를 사용합니다. 자동 배포를 원하면
> `gh auth refresh -h github.com -s workflow`로 권한을 추가한 뒤
> Pages 공식 워크플로(.github/workflows)를 추가하세요.

앱 실행 후 설정(⚙️)에서 [Claude API 키](https://console.anthropic.com/settings/keys)를 등록해야
사진 인식이 동작합니다. 키는 브라우저 localStorage에만 저장됩니다.

스마트폰에서 테스트하려면 `npm run dev -- --host`로 띄우고 같은 와이파이에서 접속하세요.
(카메라 촬영은 HTTPS 또는 localhost에서만 동작하는 브라우저가 있으니, 실배포는 GitHub Pages 등
HTTPS 환경을 권장합니다.)

## 구조

```
src/
  App.tsx                    # 화면 전환(홈/분석중/재료/레시피/상세) + 상태 관리
  data/recipes.ts            # 한식 레시피 DB (26종) + 기본 양념 목록
  lib/vision.ts              # Claude API 비전 호출 (이미지 압축 → 재료 JSON 인식)
  lib/normalize.ts           # 재료명 별칭 정규화 (달걀=계란, 삼겹살→돼지고기 등)
  lib/match.ts               # 보유율 계산 + 구매/영상 링크 생성
  components/
    IngredientEditor.tsx     # 인식된 재료 편집 (칩 UI)
    RecipeList.tsx           # 보유율 % 정렬 카드 목록
    RecipeDetail.tsx         # 보유/부족 재료, 구매 링크, 조리법, 영상 링크
    SettingsModal.tsx        # API 키 설정
```

## 확장 아이디어

- **제휴 수익화**: `lib/match.ts`의 `coupangLink()`를 쿠팡 파트너스 딥링크로 교체
- **레시피 추가**: `data/recipes.ts`에 항목만 추가하면 자동 매칭
- **API 키 보호**: 사용자가 많아지면 서버리스 프록시(Vercel Functions 등)로 키를 서버에 숨기기
- **재료 유통기한 관리**, 촬영 이력 저장 등

## 기술 스택

- React 18 + TypeScript + Vite
- `@anthropic-ai/sdk` — 브라우저에서 직접 호출 (`dangerouslyAllowBrowser`),
  모델 `claude-opus-5`, 거부 시 `claude-opus-4-8`로 서버측 폴백

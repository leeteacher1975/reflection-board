# 팀 리플렉션 보드 (Netlify 버전)

STOP / START / AMPLIFY 형식으로 팀원들이 의견을 등록하고 서로 실시간으로 확인하는 워크숍 보드입니다.
데이터는 Netlify가 제공하는 자체 저장소인 **Netlify Blobs**에 저장됩니다 (별도로 디비 서비스에 가입할 필요 없음).

## 구성

- `public/index.html` — 화면 (정적 파일)
- `netlify/functions/entries.js` — 의견 저장/조회/초기화를 처리하는 서버 함수
- `netlify.toml` — Netlify 배포 설정
- `package.json` — 함수가 사용하는 `@netlify/blobs` 패키지 정보

이 프로젝트는 서버 함수(Functions)가 포함되어 있어서 **드래그 앤 드롭(파일을 끌어다 놓는) 배포로는 작동하지 않습니다.**
아래처럼 Netlify CLI(명령줄 도구)로 배포해야 합니다. 한 번만 설정하면 이후에는 명령어 한 줄로 재배포할 수 있습니다.

## 배포 방법

### 1. Node.js 설치 확인
터미널(맥: 터미널 앱, 윈도우: PowerShell)에서 아래 명령을 입력해 버전이 나오는지 확인합니다. 없다면 https://nodejs.org 에서 설치하세요 (LTS 버전 권장).
```
node -v
```

### 2. 프로젝트 폴더 열기
압축을 푼 뒤, 터미널에서 이 폴더로 이동합니다.
```
cd team-reflection-board-netlify
```

### 3. 패키지 설치
```
npm install
```

### 4. Netlify CLI 설치 (최초 1회만)
```
npm install -g netlify-cli
```

### 5. 로그인
```
netlify login
```
브라우저가 열리면 Netlify 계정으로 로그인/승인합니다.

### 6. 사이트 연결 또는 새로 만들기 (최초 1회만)
```
netlify init
```
안내에 따라 "새 사이트 만들기"를 선택하면 됩니다. (기존에 만들어둔 사이트가 있다면 연결도 가능합니다.)

### 7. 배포
```
netlify deploy --prod
```
완료되면 `https://xxxx.netlify.app` 형태의 실제 주소가 출력됩니다. 이 주소를 팀원들에게 공유하면 됩니다.

이후 코드를 수정했을 때는 `netlify deploy --prod` 한 줄만 다시 실행하면 재배포됩니다.

### (선택, 권장) 관리자 비밀번호를 서버 환경변수로 설정하기
지금은 기본 비밀번호가 `1234`로 `netlify/functions/entries.js`에 들어 있습니다. 코드에 있는 값이라도 클라이언트(브라우저)로는 전송되지 않고 서버에서만 비교하므로, 이전 버전(비밀번호가 화면 코드에 그대로 노출)보다는 안전합니다.
더 안전하게 쓰려면 Netlify 대시보드에서:
1. 해당 사이트 → **Site configuration → Environment variables**
2. `ADMIN_PASSWORD` 이름으로 원하는 비밀번호 값 추가
3. `netlify deploy --prod` 로 재배포

이렇게 하면 환경변수 값이 코드보다 우선 적용되고, 소스 코드에는 비밀번호가 남지 않습니다.

## 로컬에서 미리 테스트하기 (선택)
배포 전에 내 컴퓨터에서 먼저 확인하고 싶다면:
```
netlify dev
```
안내된 주소(보통 http://localhost:8888)로 접속하면 Functions와 Blobs 저장까지 로컬에서 그대로 동작합니다.

## 참고
- 데이터는 이 사이트 전용 Netlify Blobs 저장소에 보관되며, 다른 사이트나 앱과 공유되지 않습니다.
- "전체 데이터 초기화"는 되돌릴 수 없습니다. 초기화 전 "전체 데이터 다운로드"로 CSV를 먼저 받아두는 것을 권장합니다.
- 화면 하단 저작권 표기: © 2026 Joanna Lee. All rights reserved.

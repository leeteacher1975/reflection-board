// 팀 리플렉션 보드 - 데이터 API
// GET  -> 전체 의견 목록 조회
// POST { category, name, text }        -> 의견 등록
// POST { action: 'clear', password }   -> 관리자 비밀번호 확인 후 전체 삭제
const { getStore } = require('@netlify/blobs');

// 관리자 비밀번호. Netlify 사이트의 환경변수 ADMIN_PASSWORD를 설정하면 그 값이 우선 사용되고,
// 설정하지 않으면 아래 기본값(1234)이 쓰입니다. 운영 시에는 대시보드에서 환경변수로 바꾸는 것을 권장합니다.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1234';

const STORE_NAME = 'reflection-board';
const KEY = 'entries';
const VALID_CATEGORIES = ['stop', 'start', 'amplify'];

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async (event) => {
  const store = getStore(STORE_NAME);

  if (event.httpMethod === 'OPTIONS') {
    return json(204, {});
  }

  if (event.httpMethod === 'GET') {
    const entries = (await store.get(KEY, { type: 'json' })) || [];
    return json(200, { entries });
  }

  if (event.httpMethod === 'POST') {
    let payload;
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (e) {
      return json(400, { error: '잘못된 요청입니다.' });
    }

    // 관리자 초기화
    if (payload.action === 'clear') {
      if (payload.password !== ADMIN_PASSWORD) {
        return json(401, { error: '비밀번호가 올바르지 않습니다.' });
      }
      await store.setJSON(KEY, []);
      return json(200, { entries: [] });
    }

    // 의견 등록
    const category = payload.category;
    const text = (payload.text || '').toString().trim();
    const name = (payload.name || '익명').toString().trim().slice(0, 20) || '익명';

    if (!VALID_CATEGORIES.includes(category)) {
      return json(400, { error: '카테고리가 올바르지 않습니다.' });
    }
    if (!text) {
      return json(400, { error: '내용을 입력해주세요.' });
    }

    const entries = (await store.get(KEY, { type: 'json' })) || [];
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      category,
      name,
      text: text.slice(0, 2000),
      ts: Date.now()
    };
    entries.push(entry);
    await store.setJSON(KEY, entries);
    return json(200, { entry });
  }

  return json(405, { error: '지원하지 않는 요청입니다.' });
};

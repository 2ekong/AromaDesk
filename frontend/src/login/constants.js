// API 관련 상수
export const API_ENDPOINTS = {
  LOGIN: '/api/login',
  LOGOUT: '/api/logout',
  USER_INFO: '/api/user/info',
  GOOGLE_CALLBACK: '/api/auth/google/callback',
  KAKAO_CALLBACK: '/api/auth/kakao/callback'
};

// 소셜 로그인 설정
export const SOCIAL_LOGIN_CONFIG = {
  GOOGLE: {
    CLIENT_ID: "dummy-client-id", // 실제 사용 안하니까 더미 값
    REDIRECT_URI: "http://localhost:3000", // 돌아올 주소 (임의)
    SCOPE: "email profile",
    AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth"
  },
  KAKAO: {
    CLIENT_ID: "your-kakao-client-id", // 실제 카카오 클라이언트 ID로 변경 필요
    REDIRECT_URI: "http://localhost:3000/auth/kakao/callback",
    AUTH_URL: "https://kauth.kakao.com/oauth/authorize"
  }
};

// 에러 메시지
export const ERROR_MESSAGES = {
  LOGIN_FAILED: '로그인에 실패했습니다.',
  LOGOUT_FAILED: '로그아웃에 실패했습니다.',
  USER_INFO_FAILED: '사용자 정보 조회에 실패했습니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
  INVALID_INPUT: '아이디와 비밀번호를 입력해주세요.',
  GOOGLE_LOGIN_ERROR: 'Google 로그인 처리 중 오류가 발생했습니다.',
  KAKAO_LOGIN_ERROR: 'Kakao 로그인 처리 중 오류가 발생했습니다.'
};

// 성공 메시지
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '로그인에 성공했습니다.',
  LOGOUT_SUCCESS: '로그아웃에 성공했습니다.'
};

// 로딩 상태 메시지
export const LOADING_MESSAGES = {
  LOGIN: '로그인 중...',
  LOGOUT: '로그아웃 중...',
  LOADING: '로딩 중...'
}; 
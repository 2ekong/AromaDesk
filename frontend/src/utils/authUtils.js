import { authManager } from '../api/authApi';

// 사용자 인증 확인 공통 함수 (ProtectedRoute에서 사용)
export const checkUserAuth = async () => {
  try {
    const result = await authManager.getUserInfo();
    if (result.success && result.data && result.data.id) {
      return { success: true, user: result.data };
    } else {
      return { success: false, error: '로그인이 필요합니다.' };
    }
  } catch (error) {
    console.error('사용자 인증 확인 실패:', error);
    return { success: false, error: '사용자 정보 확인 실패' };
  }
};

// 사용자 ID 가져오기 (인증 확인 포함)
export const getUserId = async () => {
  const authResult = await checkUserAuth();
  return authResult.success ? authResult.user.id : null;
}; 
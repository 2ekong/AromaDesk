import apiClient from './axiosConfig';
import { handleApiError, handleApiSuccess } from './errorHandler';

// 중앙 집중식 사용자 정보 관리
export const authManager = {
  // 캐시된 사용자 정보 (메모리 캐시)
  _cachedUser: null,
  _cacheTimestamp: null,
  _cacheExpiry: 5 * 60 * 1000, // 5분

  // localStorage에서 사용자 정보 가져오기
  getLocalUser: () => {
    try {
      const cusUserRaw = localStorage.getItem('CusUser');
      if (!cusUserRaw) return null;
      
      const user = JSON.parse(cusUserRaw);
      return user;
    } catch (e) {
      console.error('localStorage 사용자 정보 파싱 오류:', e);
      localStorage.removeItem('CusUser');
      return null;
    }
  },

  // 사용자 정보 조회 (캐시 우선, 필요시 API 호출)
  getUserInfo: async (forceRefresh = false) => {
    try {
      console.log('=== getUserInfo 호출 시작 ===');
      console.log('forceRefresh:', forceRefresh);
      
      // 1. 캐시 확인 (강제 새로고침이 아니고, 캐시가 유효한 경우)
      if (!forceRefresh && authManager._cachedUser && authManager._cacheTimestamp) {
        const now = Date.now();
        if (now - authManager._cacheTimestamp < authManager._cacheExpiry) {
          console.log('캐시된 사용자 정보 사용');
          return { success: true, data: authManager._cachedUser };
        }
      }

      // 2. localStorage 확인 (forceRefresh가 아닌 경우에만)
      if (!forceRefresh) {
        const localUser = authManager.getLocalUser();
        if (localUser) {
          console.log('localStorage 사용자 정보 사용');
          authManager._cachedUser = localUser;
          authManager._cacheTimestamp = Date.now();
          return { success: true, data: localUser };
        }
      }

      // 3. API 호출
      console.log('API에서 사용자 정보 조회 시작');
      console.log('요청 URL:', '/api/members/me');
      console.log('withCredentials:', true);
      
      const response = await apiClient.get('/api/members/me');
      console.log('API 응답 성공:', response);
      console.log('응답 데이터:', response.data);
      
      const userData = handleApiSuccess(response);
      
      // 캐시 업데이트
      authManager._cachedUser = userData;
      authManager._cacheTimestamp = Date.now();
      
      // localStorage 업데이트
      localStorage.setItem('CusUser', JSON.stringify(userData));
      
      console.log('사용자 정보 조회 완료:', userData);
      return { success: true, data: userData };
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      console.error('에러 응답:', error.response);
      console.error('에러 상태:', error.response?.status);
      console.error('에러 데이터:', error.response?.data);
      
      // API 실패 시 실패로 처리 (localStorage 정보 반환하지 않음)
      return { 
        success: false, 
        error: handleApiError(error).message 
      };
    }
  },

  // 사용자 정보 업데이트
  updateUserInfo: async (updateData) => {
    try {
      console.log('사용자 정보 업데이트:', updateData);
      const user = authManager.getLocalUser();
      const response = await apiClient.post(`/api/members/${user.id}`, updateData);
      const updatedUser = handleApiSuccess(response);
      
      // 캐시 및 localStorage 업데이트
      authManager._cachedUser = updatedUser;
      authManager._cacheTimestamp = Date.now();
      localStorage.setItem('CusUser', JSON.stringify(updatedUser));
      
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      return { 
        success: false, 
        error: handleApiError(error).message 
      };
    }
  },

  // 현재 비밀번호 확인
  verifyCurrentPassword: async (currentPassword) => {
    try {
      console.log('현재 비밀번호 확인:', currentPassword);
      const user = authManager.getLocalUser();
      const response = await apiClient.post(`/api/members/${user.id}/changePassword`, {
        currentPassword: currentPassword,
        newPassword: currentPassword, // 임시로 같은 값 전송
        confirmPassword: currentPassword
      });
      
      // 성공하면 현재 비밀번호가 맞는 것
      return { success: true };
    } catch (error) {
      console.error('현재 비밀번호 확인 실패:', error);
      if (error.response && error.response.status === 400) {
        return { 
          success: false, 
          error: "현재 비밀번호가 일치하지 않습니다." 
        };
      }
      return { 
        success: false, 
        error: handleApiError(error).message 
      };
    }
  },

  // 비밀번호 변경
  changePassword: async (passwordData) => {
    try {
      console.log('비밀번호 변경:', passwordData);
      const user = authManager.getLocalUser();
      const response = await apiClient.post(`/api/members/${user.id}/changePassword`, passwordData);
      const result = handleApiSuccess(response);
      
      return { success: true, data: result };
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      return { 
        success: false, 
        error: handleApiError(error).message 
      };
    }
  },

  // 세션 상태 확인 (실제 백엔드 세션)
  checkSession: async () => {
    try {
      console.log('세션 상태 확인 시작');
      const response = await apiClient.get('/api/members/me');
      console.log('세션 확인 성공:', response.status);
      return { success: true, isValid: true };
    } catch (error) {
      console.log('세션 확인 실패:', error.response?.status, error.response?.data);
      if (error.response && error.response.status === 401) {
        return { success: true, isValid: false };
      }
      return { success: false, error: handleApiError(error).message };
    }
  },

  // 세션 만료 처리
  handleSessionExpired: () => {
    console.log('세션 만료 처리');
    authManager._cachedUser = null;
    authManager._cacheTimestamp = null;
    localStorage.removeItem('CusUser');
  },

  // 캐시 무효화
  invalidateCache: () => {
    authManager._cachedUser = null;
    authManager._cacheTimestamp = null;
  }
};

// 로그인 상태 확인 및 동기화
export const checkAndSyncLoginStatus = async () => {
  const result = await authManager.getUserInfo();
  return {
    success: result.success,
    isLoggedIn: result.success && result.data,
    user: result.data
  };
}; 
import apiClient from './axiosConfig';
import { handleApiError, handleApiSuccess } from './errorHandler';

// 로그인 API
export const loginAPI = {
  // 로그인
  login: async (memberId, password) => {
    try {
      console.log('로그인 시도:', { memberId });
      const response = await apiClient.post('/api/members/login', {
        memberId,
        password
      });
      
      console.log('로그인 성공:', response);
      const data = handleApiSuccess(response);
      return { success: true, data };
    } catch (error) {
      console.error('로그인 실패:', error);
      return { 
        success: false, 
        error: handleApiError(error).message 
      };
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      console.log('로그아웃 시도');
      const response = await apiClient.post('/api/members/logout');
      console.log('로그아웃 성공:', response);
      return { success: true };
    } catch (error) {
      console.error('로그아웃 실패:', error);
      return { 
        success: false, 
        error: handleApiError(error).message 
      };
    }
  },

  // 사용자 정보 조회
  getUserInfo: async () => {
    try {
      console.log('사용자 정보 조회 시도');
      const response = await apiClient.get('/api/members/me');
      console.log('사용자 정보 조회 성공:', response);
      const data = handleApiSuccess(response);
      return { success: true, data };
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      return { 
        success: false, 
        error: handleApiError(error).message 
      };
    }
  }
};

export default loginAPI;
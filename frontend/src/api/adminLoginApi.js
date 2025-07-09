import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

export const adminLoginAPI = {
  // 관리자 로그인
  login: async (username, password) => {
    try {
      console.log('관리자 로그인 요청:', { username });

      const response = await apiClient.post('/admin/login', {
        username: username,
        password: password
      });

      const data = handleApiSuccess(response);
      console.log('관리자 로그인 응답:', data);
      
      // 백엔드에서 AdminUser로 전달한 세션키값 저장 (localStorage 백업용)
      if (data.AdminUser) {
        localStorage.setItem('AdminSessionId', data.AdminUser);
        console.log('관리자 세션키 저장됨 (localStorage):', data.AdminUser);
      }
      
      return { success: true, data: data };
    } catch (error) {
      console.error('관리자 로그인 API 에러:', error);
      const errorMessage = handleApiError(error).message;
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // 관리자 로그아웃
  logout: async () => {
    try {
      
      // 관리자 세션키 삭제 (localStorage)
      localStorage.removeItem('AdminSessionId');
      localStorage.removeItem('AdminUser');
      console.log('관리자 세션키 삭제됨 (localStorage)');
      
    } catch (error) {
      const errorMessage = handleApiError(error).message;
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // 관리자 정보 조회 (localStorage에서)
  getAdminInfo: async () => {
    try {
      const adminInfo = localStorage.getItem('AdminUser');
      const sessionId = localStorage.getItem('AdminSessionId');
      
      if (adminInfo && sessionId) {
        const admin = JSON.parse(adminInfo);
        return { 
          success: true, 
          data: { ...admin, sessionId: sessionId } 
        };
      } else {
        return { success: false, error: '로그인된 관리자 정보가 없습니다.' };
      }
    } catch (error) {
      const errorMessage = handleApiError(error).message;
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // 관리자 세션키 조회 (localStorage에서)
  getSessionId: () => {
    return localStorage.getItem('AdminSessionId');
  },

  // 세션 유효성 확인 (localStorage 기반)
  checkSession: async () => {
    try {
      const sessionId = localStorage.getItem('AdminSessionId');
      if (!sessionId) {
        return { success: false, error: '세션이 없습니다.' };
      }
      
      return { success: true, data: { sessionId: sessionId } };
    } catch (error) {
      return { success: false, error: '세션 확인 실패' };
    }
  }
}; 
import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

// 회원가입 API 함수
export const signUpAPI = async (signUpData) => {
  try {
    const response = await apiClient.post('/api/signin', signUpData);
    return {
      success: true,
      data: handleApiSuccess(response)
    };
  } catch (error) {
    console.error('회원가입 API 오류:', error);
    const errorMessage = handleApiError(error).message;
    return {
      success: false,
      error: errorMessage
    };
  }
};

// 아이디 중복 확인 API (백엔드에 없는 기능이므로 클라이언트에서 처리)
export const checkMemberIdAPI = async (memberId) => {
  try {
    const response = await apiClient.get(`/api/signin/check-id?memberId=${memberId}`);
    const isAvailable = response.data.available;
    return { success: true, isAvailable };
  } catch (error) {
    const errorMessage = handleApiError(error).message;
    return { success: false, error: errorMessage };
  }
};


// 이메일 중복 확인 API (백엔드에 없는 기능이므로 클라이언트에서 처리)
export const checkEmailAPI = async (email) => {
  try {
    const response = await apiClient.get(`/api/signin/check-email?email=${email}`);
    const isAvailable = response.data.available;
    return { success: true, isAvailable };
  } catch (error) {
    const errorMessage = handleApiError(error).message;
    return { success: false, error: errorMessage };
  }
};
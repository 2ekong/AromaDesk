import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

// 마이페이지 정보 조회
export const getMyPageInfo = async (userId) => {
  try {
    const response = await apiClient.get(`/api/members/${userId}`);
    return handleApiSuccess(response);
  } catch (error) {
    console.error("마이페이지 정보 조회 오류:", error);
    throw handleApiError(error);
  }
};

// 마이페이지 정보 수정
export const updateMyPageInfo = async (userId, updateData) => {
  try {
    const response = await apiClient.post(`/api/members/${userId}`, updateData);
    return { success: true, data: handleApiSuccess(response) };
  } catch (error) {
    console.error("마이페이지 정보 수정 오류:", error);
    const errorMessage = handleApiError(error).message;
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

// 비밀번호 확인 (클라이언트에서 처리)
export const checkPassword = async (userId, password) => {
  try {
    const userInfo = localStorage.getItem('CusUser');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.password === password) {
        return { success: true, data: { isValid: true } };
      } else {
        return { success: false, error: "현재 비밀번호가 일치하지 않습니다." };
      }
    } else {
      return { success: false, error: "사용자 정보를 찾을 수 없습니다." };
    }
  } catch (error) {
    console.error("비밀번호 확인 오류:", error);
    const errorMessage = handleApiError(error).message;
    return { success: false, error: errorMessage };
  }
};

// 비밀번호 변경 (클라이언트에서 처리)
export const changePassword = async (userId, newPassword) => {
  try {
    const userInfo = localStorage.getItem('CusUser');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      user.password = newPassword;
      localStorage.setItem("CusUser", JSON.stringify(user));
      return { success: true, data: { message: "비밀번호가 변경되었습니다." } };
    } else {
      return { success: false, error: '사용자 정보를 찾을 수 없습니다.' };
    }
  } catch (error) {
    console.error("비밀번호 변경 오류:", error);
    const errorMessage = handleApiError(error).message;
    return { success: false, error: errorMessage };
  }
};

// 로그인한 사용자의 주문 목록 조회
export const getMyOrders = async () => {
  try {
    const response = await apiClient.get('/api/orders');
    return handleApiSuccess(response);
  } catch (error) {
    console.error('주문 내역 조회 오류:', error);
    throw handleApiError(error);
  }
};

// 특정 주문의 배송 상태 조회
export const getDeliveryStatus = async (orderId) => {
  try {
    const response = await apiClient.get(`/api/orders/${orderId}/delivery`);
    return handleApiSuccess(response);
  } catch (error) {
    console.error('배송 상태 조회 오류:', error);
    throw handleApiError(error);
  }
};

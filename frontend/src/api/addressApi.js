import axios from "./axiosConfig";
import { handleApiError } from "./errorHandler";

// 현재 배송지 정보 조회 (authManager 사용)
import { authManager } from "./authApi";

export const getCurrentAddress = async () => {
  try {
    console.log('=== 배송지 조회 시작 ===');

    const result = await authManager.getUserInfo();

    if (result.success) {
      const userData = result.data;
      console.log('사용자 정보:', userData);

      return {
        success: true,
        data: {
          address: userData.address || '',
          zipCode: userData.zipCode || '',
          addressDetail: userData.addressDetail || ''
        }
      };
    } else {
      return {
        success: false,
        error: result.error
      };
    }
  } catch (error) {
    console.error('배송지 조회 오류:', error);
    return {
      success: false,
      error: handleApiError(error).message
    };
  }
};

// 주소만 수정 (authManager 사용 안 함)
export const updateAddress = async (memberId, addressData) => {
  try {
    console.log('=== 주소 수정 시작 ===');
    console.log('보낼 데이터:', addressData);

    const response = await axios.patch(`/api/members/${memberId}/address`, addressData);

    console.log('주소 수정 성공:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('주소 수정 오류:', error);
    return {
      success: false,
      error: handleApiError(error).message
    };
  }
};

// 로그인한 사용자 DB 최신 정보 조회
export const getCurrentUser = async () => {
  try {
    console.log('=== 현재 사용자 정보 조회 ===');
    const response = await axios.get("/auth/me");   

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return {
      success: false,
      error: handleApiError(error).message
    };
  }
};

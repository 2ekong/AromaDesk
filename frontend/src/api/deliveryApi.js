import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

// 배송관리 관련 API 함수들 (관리자용)
export const deliveryApi = {
  // 배송 목록 조회
  getDeliveries: async () => {
    try {
      const response = await apiClient.get("/api/deliveries");
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 배송 상세 조회
  getDeliveryById: async (deliveryId) => {
    try {
      const response = await apiClient.get(`/api/deliveries/${deliveryId}`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 배송 정보 생성
  createDelivery: async (deliveryData) => {
    try {
      const response = await apiClient.post("/api/deliveries", deliveryData);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 배송 상태 변경 (관리자용 - 드롭다운 UI 연동)
  updateDeliveryStatus: async (deliveryId, status, trackingNumber) => {
    try {
      const response = await apiClient.put(`/api/deliveries/${deliveryId}`, {
        status,
        trackingNumber,
      });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 배송 정보 수정
  updateDelivery: async (deliveryId, deliveryData) => {
    try {
      const response = await apiClient.put(
        `/api/deliveries/${deliveryId}`,
        deliveryData
      );
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 배송 정보 삭제
  deleteDelivery: async (deliveryId) => {
    try {
      const response = await apiClient.delete(`/api/deliveries/${deliveryId}`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// 개별 함수로도 export (기존 코드 호환성)
export const getDeliveries = deliveryApi.getDeliveries;
export const getDeliveryById = deliveryApi.getDeliveryById;
export const createDelivery = deliveryApi.createDelivery;
export const updateDelivery = deliveryApi.updateDelivery;
export const updateDeliveryStatus = deliveryApi.updateDeliveryStatus;
export const deleteDelivery = deliveryApi.deleteDelivery;

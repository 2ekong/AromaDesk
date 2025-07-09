import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

export const orderApi = {
  /**
   * 장바구니 기반 주문 생성
   * @param {Object} cartOrderData - { cartItemIds: number[], deliveryId: number, paymentMethod: string }
   */
  createOrderFromCart: async (cartOrderData) => {
    try {
      const response = await apiClient.post("/api/orders/from-cart", cartOrderData);
      return { success: true, data: handleApiSuccess(response) };
    } catch (error) {
      return { success: false, error: handleApiError(error).message };
    }
  },

  /**
   * 단일 상품 주문 생성 (상품 상세에서 직접 구매)
   * @param {Object} singleOrderData - OrderRequestDto 형식
   */
  createSingleOrder: async (singleOrderData) => {
    try {
      const response = await apiClient.post("/api/orders/single", singleOrderData);
      return { success: true, data: handleApiSuccess(response) };
    } catch (error) {
      return { success: false, error: handleApiError(error).message };
    }
  },

  /**
   * 결제 완료 처리 (MOCK 결제 전용)
   * @param {number} orderId
   */
  payOrder: async (orderId) => {
    try {
      const response = await apiClient.post(`/api/orders/${orderId}/pay`);
      return { success: true, data: handleApiSuccess(response) };
    } catch (error) {
      return { success: false, error: handleApiError(error).message };
    }
  },

  /**
   * 주문 단건 조회
   * @param {number} orderId
   */
  getOrder: async (orderId) => {
    try {
      const response = await apiClient.get(`/api/orders/${orderId}`);
      return { success: true, data: handleApiSuccess(response) };
    } catch (error) {
      return { success: false, error: handleApiError(error).message };
    }
  },

  /**
   * 로그인한 회원의 전체 주문 목록 조회
   */
  getMyOrders: async () => {
    try {
      const response = await apiClient.get("/api/orders");
      return { success: true, data: handleApiSuccess(response) };
    } catch (error) {
      return { success: false, error: handleApiError(error).message };
    }
  },

 /**
   * 주문 취소
   * @param {number} orderId
   */
  cancelOrder: async (orderId) => {
    try {
      const response = await apiClient.post(`/api/orders/${orderId}/cancel`);
      return { success: true, data: handleApiSuccess(response) };
    } catch (error) {
      return { success: false, error: handleApiError(error).message };
    }
  },
};

export default orderApi;
import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

// 장바구니 관련 API 함수들
export const cartApi = {
  // 장바구니 전체 조회
  getCartItems: async (memberId) => {
    try {
      const response = await apiClient.get(`/api/cart/${memberId}`);
      const result = handleApiSuccess(response);

      // 백엔드에서 List<CartResponseDto>를 직접 반환하므로 result가 바로 배열
      if (!result) {
        return [];
      }

      // 배열이 아니면 빈 배열 반환
      return Array.isArray(result) ? result : [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 장바구니에 상품 추가 (중복 시 수량 증가)
  addToCart: async (memberId, productId, quantity) => {
    try {
      const response = await apiClient.post(`/api/members/${memberId}/cart`, {
        productId,
        quantity,
      });
      const result = handleApiSuccess(response);

      // 백엔드에서 CartResponseDto를 직접 반환하므로 result가 바로 cartItem
      if (!result) {
        throw new Error("장바구니 추가 응답이 올바르지 않습니다.");
      }

      const cartItem = result; // result.data가 아닌 result 사용

      // 필수 필드 검증 및 기본값 설정
      return {
        cartItemId: cartItem.cartItemId || null,
        productId: cartItem.productId || productId,
        name: cartItem.name || "상품명 없음",
        imageUrl: cartItem.imageUrl || "",
        price: cartItem.price || 0,
        quantity: cartItem.quantity || quantity || 1,
      };
    } catch (error) {
      // 재고 부족 오류를 더 명확하게 처리
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message;
        if (errorMessage && errorMessage.includes("재고")) {
          throw new Error(`재고 부족: ${errorMessage}`);
        }
      }
      throw handleApiError(error);
    }
  },

  // 장바구니 상품 수량 변경
  updateQuantity: async (memberId, productId, quantity) => {
    try {
      const response = await apiClient.put(
        `/api/members/${memberId}/cart/${productId}`,
        { quantity }
      );
      const result = handleApiSuccess(response);

      // 백엔드에서 CartResponseDto를 직접 반환하므로 result가 바로 cartItem
      if (!result) {
        throw new Error("수량 변경 응답이 올바르지 않습니다.");
      }

      const cartItem = result; // result.data가 아닌 result 사용

      // 필수 필드 검증 및 기본값 설정
      return {
        cartItemId: cartItem.cartItemId,
        productId: cartItem.productId || productId,
        name: cartItem.name || "상품명 없음",
        imageUrl: cartItem.imageUrl || "",
        price: cartItem.price || 0,
        quantity: cartItem.quantity || quantity || 1,
      };
    } catch (error) {
      // 재고 부족 오류를 더 명확하게 처리
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message;
        if (errorMessage && errorMessage.includes("재고")) {
          throw new Error(`재고 부족: ${errorMessage}`);
        }
      }
      throw handleApiError(error);
    }
  },

  // 장바구니에서 상품 삭제
  removeFromCart: async (memberId, productId) => {
    try {
      await apiClient.delete(`/api/members/${memberId}/cart/${productId}`);
      return productId; // 삭제된 productId 반환
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export const getCartItems = cartApi.getCartItems;
export const addToCart = cartApi.addToCart;
export const updateQuantity = cartApi.updateQuantity;
export const removeFromCart = cartApi.removeFromCart;

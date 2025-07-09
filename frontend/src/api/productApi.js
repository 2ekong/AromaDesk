import apiClient from "./axiosConfig";
import { handleApiError, handleApiSuccess } from "./errorHandler";

// 상품 관련 API 함수들
export const productApi = {
  // 필터링된 상품 목록 조회 (페이징 포함)
  getFilteredProducts: async (params = {}) => {
    try {
      const {
        brand,
        gender,
        volume,
        keyword,
        statuses,
        maxPrice,
        page = 1,
        size = 10,
      } = params;

      // 백엔드 API 엔드포인트와 파라미터 구조 맞춤
      const queryParams = {};
      if (brand) queryParams.brand = brand;
      if (gender) queryParams.gender = gender;
      if (volume) queryParams.volume = volume;
      if (keyword) queryParams.keyword = keyword;
      if (statuses) queryParams.statuses = statuses;
      if (page) queryParams.page = page;
      if (size) queryParams.size = size;

      const response = await apiClient.get("/api/products", {
        params: queryParams,
      });

      // 백엔드 응답 구조: { content: [], totalElements: number, page: number, size: number, totalPages: number }
      let result = handleApiSuccess(response);

      // 응답 구조 검증 및 기본값 설정
      if (!result) {
        result = {
          content: [],
          totalElements: 0,
          page: 1,
          size: 10,
          totalPages: 0,
        };
      }

      // content가 배열이 아닌 경우 처리
      if (!Array.isArray(result.content)) {
        if (Array.isArray(result)) {
          // 배열로 직접 반환된 경우 (기존 호환성)
          result = {
            content: result,
            totalElements: result.length,
            page: 1,
            size: result.length,
            totalPages: 1,
          };
        } else {
          // 단일 객체인 경우
          result = {
            content: [result],
            totalElements: 1,
            page: 1,
            size: 1,
            totalPages: 1,
          };
        }
      }

      // 프론트엔드에서 추가 필터링 처리 (클라이언트 사이드)
      if (result.content && maxPrice) {
        let filteredContent = result.content;

        // 가격 필터링 (maxPrice)
        if (maxPrice) {
          filteredContent = filteredContent.filter(
              (product) => product.price <= parseInt(maxPrice)
          );
        }

        // 필터링된 결과로 업데이트 (페이징 정보는 원본 유지)
        result = {
          ...result,
          content: filteredContent,
          // 클라이언트 필터링이 적용된 경우 totalElements 업데이트
          totalElements: filteredContent.length,
          totalPages: Math.ceil(filteredContent.length / result.size),
        };
      }

      return result;
    } catch (error) {
      console.error("검색 API 오류:", error);
      throw handleApiError(error);
    }
  },

  // 상품 상세 조회
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/api/products/${productId}`);
      const result = handleApiSuccess(response);

      // 단일 상품 응답 검증
      if (!result) {
        throw new Error("상품을 찾을 수 없습니다.");
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 상품 생성 (관리자용)
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post("/api/products", productData);
      const result = handleApiSuccess(response);

      if (!result) {
        throw new Error("상품 생성에 실패했습니다.");
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 상품 수정 (관리자용)
  updateProduct: async (productId, productData) => {
    try {
      const response = await apiClient.put(
          `/api/products/${productId}`,
          productData
      );
      const result = handleApiSuccess(response);

      if (!result) {
        throw new Error("상품 수정에 실패했습니다.");
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 상품 삭제 (관리자용)
  deleteProduct: async (productId) => {
    try {
      const response = await apiClient.delete(`/api/products/${productId}`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * 단일 상품 주문 생성 (바로 구매)
   * @param {Object} orderData - { items: [{ productId, quantity }], deliveryId, paymentMethod }
   */
  createSingleOrder: async (orderData) => {
    try {
      const response = await apiClient.post("/api/orders/single", orderData);
      const result = handleApiSuccess(response);

      if (!result) {
        throw new Error("주문 생성에 실패했습니다.");
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * 장바구니 기반 주문 생성
   * @param {Object} orderData - { cartItemIds: number[], deliveryId: number, paymentMethod: string }
   */
  createOrderFromCart: async (orderData) => {
    try {
      const response = await apiClient.post("/api/orders/from-cart", orderData);
      const result = handleApiSuccess(response);

      if (!result) {
        throw new Error("주문 생성에 실패했습니다.");
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// 개별 함수로도 export (기존 코드 호환성)
export const getFilteredProducts = productApi.getFilteredProducts;
export const getProductById = productApi.getProductById;
export const createProduct = productApi.createProduct;
export const updateProduct = productApi.updateProduct;
export const deleteProduct = productApi.deleteProduct;
export const createSingleOrder = productApi.createSingleOrder;
export const createOrderFromCart = productApi.createOrderFromCart;

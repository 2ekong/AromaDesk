import axios from "./axiosConfig";

// 관리자 상품 API
export const adminProductApi = {
  // 상품 목록 조회 (필터 파라미터, 페이징 지원)
  getProducts: async (params = {}) => {
    const response = await axios.get("/api/admin/products", { params });
    return response.data;
  },

  // 브랜드 목록 조회
  getBrands: async () => {
    const response = await axios.get("/api/admin/products/brands");
    return response.data;
  },

  // 상품 생성
  createProduct: async (productData) => {
    try {
      const response = await axios.post("/api/admin/products", productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 상품 수정
  updateProduct: async (productId, productData) => {
    try {
      const response = await axios.put(
        `/api/admin/products/${productId}`,
        productData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 상품 삭제
  deleteProduct: async (productId) => {
    try {
      const response = await axios.delete(`/api/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// 개별 함수로도 export (기존 코드 호환성)
export const fetchAdminProducts = adminProductApi.getProducts;
export const createProduct = adminProductApi.createProduct;
export const updateProduct = adminProductApi.updateProduct;
export const deleteProduct = adminProductApi.deleteProduct;

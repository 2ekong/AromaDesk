// API 모듈 통합 export
export * from "./cartApi";
export * from "./productApi";
export * from "./deliveryApi";

// API 클라이언트 및 에러 핸들러
export { default as apiClient } from "./axiosConfig";
export { handleApiError, handleApiSuccess } from "./errorHandler";

// API 객체들 export (네임스페이스 방식)
export {
  productApi,
  getFilteredProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productApi";
export {
  cartApi,
  getCartItems,
  addToCart,
  updateQuantity,
  removeFromCart,
} from "./cartApi";
export {
  deliveryApi,
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  updateDeliveryStatus,
  deleteDelivery,
} from "./deliveryApi";

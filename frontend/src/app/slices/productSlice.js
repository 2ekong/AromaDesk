import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "../../api/productApi";

// 비동기 액션들
export const fetchFilteredProducts = createAsyncThunk(
  "product/fetchFilteredProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productApi.getFilteredProducts(params);
      return { ...response, append: params.append };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductById(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProductAction = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productApi.createProduct(productData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProductAction = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await productApi.updateProduct(productId, productData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProductAction = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await productApi.deleteProduct(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    filters: {
      brand: null,
      category: null,
      minPrice: null,
      gender: null,
    },
    pagination: {
      page: 1,
      size: 10,
      total: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action) => {
      const { type, value } = action.payload;
      state.filters[type] = value;
      // 필터 변경 시 페이지를 1로 리셋
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        brand: null,
        category: null,
        minPrice: null,
        gender: null,
      };
      state.pagination.page = 1;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFilteredProducts
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.loading = false;

        // 응답 데이터 검증 및 안전한 처리
        if (!action.payload) {
          console.warn("API 응답이 비어있습니다");
          state.products = [];
          state.pagination.total = 0;
          state.pagination.page = 1;
          state.pagination.size = 10;
          return;
        }

        const { append, ...payload } = action.payload;

        // 백엔드 응답 구조: { content: [], totalElements: number, page: number, size: number, totalPages: number }
        if (payload.content && Array.isArray(payload.content)) {
          if (append && state.products.length > 0) {
            // 무한 스크롤: 기존 상품에 새로운 상품 추가
            // 빈 배열이 반환되면 더 이상 로드할 상품이 없음을 의미
            if (payload.content.length === 0) {
              // 빈 배열이 반환되었지만 기존 상품이 있으면 hasMore를 false로 설정할 수 있도록
              // pagination 정보는 업데이트하지 않음
              return;
            }
            state.products = [...state.products, ...payload.content];
          } else {
            // 일반 로드: 기존 상품 교체
            state.products = payload.content;
          }
          state.pagination.total = payload.totalElements || 0;
          state.pagination.page = payload.page || 1;
          state.pagination.size = payload.size || 10;
          state.pagination.totalPages =
            payload.totalPages ||
            Math.ceil((payload.totalElements || 0) / (payload.size || 10));
        } else if (Array.isArray(payload)) {
          // 배열로 직접 반환된 경우 (기존 호환성)
          if (append && state.products.length > 0) {
            if (payload.length === 0) {
              // 빈 배열이 반환되면 더 이상 로드할 상품이 없음
              return;
            }
            state.products = [...state.products, ...payload];
          } else {
            state.products = payload;
          }
          state.pagination.total = payload.length;
          state.pagination.page = 1;
          state.pagination.size = payload.length;
          state.pagination.totalPages = 1;
        } else if (payload && typeof payload === "object") {
          // 단일 객체인 경우
          if (append && state.products.length > 0) {
            state.products = [...state.products, payload];
          } else {
            state.products = [payload];
          }
          state.pagination.total = 1;
          state.pagination.page = 1;
          state.pagination.size = 1;
          state.pagination.totalPages = 1;
        } else {
          // 예상치 못한 응답 구조
          console.warn("예상치 못한 응답 구조:", payload);
          state.products = [];
          state.pagination.total = 0;
          state.pagination.page = 1;
          state.pagination.size = 10;
          state.pagination.totalPages = 0;
        }
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        // ProductResponseDTO 구조: id, name, brand, genderCategory, volumeCategory, price, imageUrl, description, createdAt
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createProductAction
      .addCase(createProductAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductAction.fulfilled, (state, action) => {
        state.loading = false;
        // 새 상품을 목록에 추가
        state.products.push(action.payload);
      })
      .addCase(createProductAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateProductAction
      .addCase(updateProductAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductAction.fulfilled, (state, action) => {
        state.loading = false;
        // 상품 목록에서 해당 상품 업데이트
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        // 현재 상품이 업데이트된 상품이라면 함께 업데이트
        if (
          state.currentProduct &&
          state.currentProduct.id === action.payload.id
        ) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProductAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteProductAction
      .addCase(deleteProductAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductAction.fulfilled, (state, action) => {
        state.loading = false;
        // 상품 목록에서 해당 상품 제거
        state.products = state.products.filter((p) => p.id !== action.payload);
        // 현재 상품이 삭제된 상품이라면 null로 설정
        if (
          state.currentProduct &&
          state.currentProduct.id === action.payload
        ) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProductAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setFilter,
  clearFilters,
  clearCurrentProduct,
  setPage,
} = productSlice.actions;

export default productSlice.reducer;

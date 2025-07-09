"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.setPage = exports.clearCurrentProduct = exports.clearFilters = exports.setFilter = exports.clearError = exports.deleteProductAction = exports.updateProductAction = exports.createProductAction = exports.fetchProductById = exports.fetchFilteredProducts = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _productApi = require("../../api/productApi");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 비동기 액션들
var fetchFilteredProducts = (0, _toolkit.createAsyncThunk)("product/fetchFilteredProducts", function _callee() {
  var params,
      _ref,
      rejectWithValue,
      response,
      _args = arguments;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          params = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
          _ref = _args.length > 1 ? _args[1] : undefined, rejectWithValue = _ref.rejectWithValue;
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(_productApi.productApi.getFilteredProducts(params));

        case 5:
          response = _context.sent;
          return _context.abrupt("return", _objectSpread({}, response, {
            append: params.append
          }));

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](2);
          return _context.abrupt("return", rejectWithValue(_context.t0.message));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 9]]);
});
exports.fetchFilteredProducts = fetchFilteredProducts;
var fetchProductById = (0, _toolkit.createAsyncThunk)("product/fetchProductById", function _callee2(productId, _ref2) {
  var rejectWithValue, response;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          rejectWithValue = _ref2.rejectWithValue;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_productApi.productApi.getProductById(productId));

        case 4:
          response = _context2.sent;
          return _context2.abrupt("return", response);

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          return _context2.abrupt("return", rejectWithValue(_context2.t0.message));

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
exports.fetchProductById = fetchProductById;
var createProductAction = (0, _toolkit.createAsyncThunk)("product/createProduct", function _callee3(productData, _ref3) {
  var rejectWithValue, response;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          rejectWithValue = _ref3.rejectWithValue;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_productApi.productApi.createProduct(productData));

        case 4:
          response = _context3.sent;
          return _context3.abrupt("return", response);

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          return _context3.abrupt("return", rejectWithValue(_context3.t0.message));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
exports.createProductAction = createProductAction;
var updateProductAction = (0, _toolkit.createAsyncThunk)("product/updateProduct", function _callee4(_ref4, _ref5) {
  var productId, productData, rejectWithValue, response;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          productId = _ref4.productId, productData = _ref4.productData;
          rejectWithValue = _ref5.rejectWithValue;
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(_productApi.productApi.updateProduct(productId, productData));

        case 5:
          response = _context4.sent;
          return _context4.abrupt("return", response);

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](2);
          return _context4.abrupt("return", rejectWithValue(_context4.t0.message));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 9]]);
});
exports.updateProductAction = updateProductAction;
var deleteProductAction = (0, _toolkit.createAsyncThunk)("product/deleteProduct", function _callee5(productId, _ref6) {
  var rejectWithValue;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          rejectWithValue = _ref6.rejectWithValue;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(_productApi.productApi.deleteProduct(productId));

        case 4:
          return _context5.abrupt("return", productId);

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](1);
          return _context5.abrupt("return", rejectWithValue(_context5.t0.message));

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 7]]);
});
exports.deleteProductAction = deleteProductAction;
var productSlice = (0, _toolkit.createSlice)({
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
      gender: null
    },
    pagination: {
      page: 1,
      size: 10,
      total: 0
    }
  },
  reducers: {
    clearError: function clearError(state) {
      state.error = null;
    },
    setFilter: function setFilter(state, action) {
      var _action$payload = action.payload,
          type = _action$payload.type,
          value = _action$payload.value;
      state.filters[type] = value; // 필터 변경 시 페이지를 1로 리셋

      state.pagination.page = 1;
    },
    clearFilters: function clearFilters(state) {
      state.filters = {
        brand: null,
        category: null,
        minPrice: null,
        gender: null
      };
      state.pagination.page = 1;
    },
    clearCurrentProduct: function clearCurrentProduct(state) {
      state.currentProduct = null;
    },
    setPage: function setPage(state, action) {
      state.pagination.page = action.payload;
    }
  },
  extraReducers: function extraReducers(builder) {
    builder // fetchFilteredProducts
    .addCase(fetchFilteredProducts.pending, function (state) {
      state.loading = true;
      state.error = null;
    }).addCase(fetchFilteredProducts.fulfilled, function (state, action) {
      state.loading = false; // 응답 데이터 검증 및 안전한 처리

      if (!action.payload) {
        console.warn("API 응답이 비어있습니다");
        state.products = [];
        state.pagination.total = 0;
        state.pagination.page = 1;
        state.pagination.size = 10;
        return;
      }

      var _action$payload2 = action.payload,
          append = _action$payload2.append,
          payload = _objectWithoutProperties(_action$payload2, ["append"]); // 백엔드 응답 구조: { content: [], totalElements: number, page: number, size: number, totalPages: number }


      if (payload.content && Array.isArray(payload.content)) {
        if (append && state.products.length > 0) {
          // 무한 스크롤: 기존 상품에 새로운 상품 추가
          // 빈 배열이 반환되면 더 이상 로드할 상품이 없음을 의미
          if (payload.content.length === 0) {
            // 빈 배열이 반환되었지만 기존 상품이 있으면 hasMore를 false로 설정할 수 있도록
            // pagination 정보는 업데이트하지 않음
            return;
          }

          state.products = [].concat(_toConsumableArray(state.products), _toConsumableArray(payload.content));
        } else {
          // 일반 로드: 기존 상품 교체
          state.products = payload.content;
        }

        state.pagination.total = payload.totalElements || 0;
        state.pagination.page = payload.page || 1;
        state.pagination.size = payload.size || 10;
        state.pagination.totalPages = payload.totalPages || Math.ceil((payload.totalElements || 0) / (payload.size || 10));
      } else if (Array.isArray(payload)) {
        // 배열로 직접 반환된 경우 (기존 호환성)
        if (append && state.products.length > 0) {
          if (payload.length === 0) {
            // 빈 배열이 반환되면 더 이상 로드할 상품이 없음
            return;
          }

          state.products = [].concat(_toConsumableArray(state.products), _toConsumableArray(payload));
        } else {
          state.products = payload;
        }

        state.pagination.total = payload.length;
        state.pagination.page = 1;
        state.pagination.size = payload.length;
        state.pagination.totalPages = 1;
      } else if (payload && _typeof(payload) === "object") {
        // 단일 객체인 경우
        if (append && state.products.length > 0) {
          state.products = [].concat(_toConsumableArray(state.products), [payload]);
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
    }).addCase(fetchFilteredProducts.rejected, function (state, action) {
      state.loading = false;
      state.error = action.payload;
    }) // fetchProductById
    .addCase(fetchProductById.pending, function (state) {
      state.loading = true;
      state.error = null;
    }).addCase(fetchProductById.fulfilled, function (state, action) {
      state.loading = false; // ProductResponseDTO 구조: id, name, brand, genderCategory, volumeCategory, price, imageUrl, description, createdAt

      state.currentProduct = action.payload;
    }).addCase(fetchProductById.rejected, function (state, action) {
      state.loading = false;
      state.error = action.payload;
    }) // createProductAction
    .addCase(createProductAction.pending, function (state) {
      state.loading = true;
      state.error = null;
    }).addCase(createProductAction.fulfilled, function (state, action) {
      state.loading = false; // 새 상품을 목록에 추가

      state.products.push(action.payload);
    }).addCase(createProductAction.rejected, function (state, action) {
      state.loading = false;
      state.error = action.payload;
    }) // updateProductAction
    .addCase(updateProductAction.pending, function (state) {
      state.loading = true;
      state.error = null;
    }).addCase(updateProductAction.fulfilled, function (state, action) {
      state.loading = false; // 상품 목록에서 해당 상품 업데이트

      var index = state.products.findIndex(function (p) {
        return p.id === action.payload.id;
      });

      if (index !== -1) {
        state.products[index] = action.payload;
      } // 현재 상품이 업데이트된 상품이라면 함께 업데이트


      if (state.currentProduct && state.currentProduct.id === action.payload.id) {
        state.currentProduct = action.payload;
      }
    }).addCase(updateProductAction.rejected, function (state, action) {
      state.loading = false;
      state.error = action.payload;
    }) // deleteProductAction
    .addCase(deleteProductAction.pending, function (state) {
      state.loading = true;
      state.error = null;
    }).addCase(deleteProductAction.fulfilled, function (state, action) {
      state.loading = false; // 상품 목록에서 해당 상품 제거

      state.products = state.products.filter(function (p) {
        return p.id !== action.payload;
      }); // 현재 상품이 삭제된 상품이라면 null로 설정

      if (state.currentProduct && state.currentProduct.id === action.payload) {
        state.currentProduct = null;
      }
    }).addCase(deleteProductAction.rejected, function (state, action) {
      state.loading = false;
      state.error = action.payload;
    });
  }
});
var _productSlice$actions = productSlice.actions,
    clearError = _productSlice$actions.clearError,
    setFilter = _productSlice$actions.setFilter,
    clearFilters = _productSlice$actions.clearFilters,
    clearCurrentProduct = _productSlice$actions.clearCurrentProduct,
    setPage = _productSlice$actions.setPage;
exports.setPage = setPage;
exports.clearCurrentProduct = clearCurrentProduct;
exports.clearFilters = clearFilters;
exports.setFilter = setFilter;
exports.clearError = clearError;
var _default = productSlice.reducer;
exports["default"] = _default;
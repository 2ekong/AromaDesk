"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrderFromCart = exports.createSingleOrder = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getFilteredProducts = exports.productApi = void 0;

var _axiosConfig = _interopRequireDefault(require("./axiosConfig"));

var _errorHandler = require("./errorHandler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 상품 관련 API 함수들
var productApi = {
  // 필터링된 상품 목록 조회 (페이징 포함)
  getFilteredProducts: function getFilteredProducts() {
    var params,
        brand,
        gender,
        volume,
        keyword,
        maxPrice,
        _params$page,
        page,
        _params$size,
        size,
        queryParams,
        response,
        result,
        filteredContent,
        _args = arguments;

    return regeneratorRuntime.async(function getFilteredProducts$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
            _context.prev = 1;
            brand = params.brand, gender = params.gender, volume = params.volume, keyword = params.keyword, maxPrice = params.maxPrice, _params$page = params.page, page = _params$page === void 0 ? 1 : _params$page, _params$size = params.size, size = _params$size === void 0 ? 10 : _params$size; // 백엔드 API 엔드포인트와 파라미터 구조 맞춤

            queryParams = {};
            if (brand) queryParams.brand = brand;
            if (gender) queryParams.gender = gender;
            if (volume) queryParams.volume = volume;
            if (keyword) queryParams.keyword = keyword;
            if (page) queryParams.page = page;
            if (size) queryParams.size = size;
            _context.next = 12;
            return regeneratorRuntime.awrap(_axiosConfig["default"].get("/api/products", {
              params: queryParams
            }));

          case 12:
            response = _context.sent;
            // 백엔드 응답 구조: { content: [], totalElements: number, page: number, size: number, totalPages: number }
            result = (0, _errorHandler.handleApiSuccess)(response); // 응답 구조 검증 및 기본값 설정

            if (!result) {
              result = {
                content: [],
                totalElements: 0,
                page: 1,
                size: 10,
                totalPages: 0
              };
            } // content가 배열이 아닌 경우 처리


            if (!Array.isArray(result.content)) {
              if (Array.isArray(result)) {
                // 배열로 직접 반환된 경우 (기존 호환성)
                result = {
                  content: result,
                  totalElements: result.length,
                  page: 1,
                  size: result.length,
                  totalPages: 1
                };
              } else {
                // 단일 객체인 경우
                result = {
                  content: [result],
                  totalElements: 1,
                  page: 1,
                  size: 1,
                  totalPages: 1
                };
              }
            } // 프론트엔드에서 추가 필터링 처리 (클라이언트 사이드)


            if (result.content && maxPrice) {
              filteredContent = result.content; // 가격 필터링 (maxPrice)

              if (maxPrice) {
                filteredContent = filteredContent.filter(function (product) {
                  return product.price <= parseInt(maxPrice);
                });
              } // 필터링된 결과로 업데이트 (페이징 정보는 원본 유지)


              result = _objectSpread({}, result, {
                content: filteredContent,
                // 클라이언트 필터링이 적용된 경우 totalElements 업데이트
                totalElements: filteredContent.length,
                totalPages: Math.ceil(filteredContent.length / result.size)
              });
            }

            return _context.abrupt("return", result);

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](1);
            console.error("검색 API 오류:", _context.t0);
            throw (0, _errorHandler.handleApiError)(_context.t0);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 20]]);
  },
  // 상품 상세 조회
  getProductById: function getProductById(productId) {
    var response, result;
    return regeneratorRuntime.async(function getProductById$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(_axiosConfig["default"].get("/api/products/".concat(productId)));

          case 3:
            response = _context2.sent;
            result = (0, _errorHandler.handleApiSuccess)(response); // 단일 상품 응답 검증

            if (result) {
              _context2.next = 7;
              break;
            }

            throw new Error("상품을 찾을 수 없습니다.");

          case 7:
            return _context2.abrupt("return", result);

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            throw (0, _errorHandler.handleApiError)(_context2.t0);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  // 상품 생성 (관리자용)
  createProduct: function createProduct(productData) {
    var response, result;
    return regeneratorRuntime.async(function createProduct$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(_axiosConfig["default"].post("/api/products", productData));

          case 3:
            response = _context3.sent;
            result = (0, _errorHandler.handleApiSuccess)(response);

            if (result) {
              _context3.next = 7;
              break;
            }

            throw new Error("상품 생성에 실패했습니다.");

          case 7:
            return _context3.abrupt("return", result);

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            throw (0, _errorHandler.handleApiError)(_context3.t0);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  // 상품 수정 (관리자용)
  updateProduct: function updateProduct(productId, productData) {
    var response, result;
    return regeneratorRuntime.async(function updateProduct$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap(_axiosConfig["default"].put("/api/products/".concat(productId), productData));

          case 3:
            response = _context4.sent;
            result = (0, _errorHandler.handleApiSuccess)(response);

            if (result) {
              _context4.next = 7;
              break;
            }

            throw new Error("상품 수정에 실패했습니다.");

          case 7:
            return _context4.abrupt("return", result);

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            throw (0, _errorHandler.handleApiError)(_context4.t0);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  // 상품 삭제 (관리자용)
  deleteProduct: function deleteProduct(productId) {
    var response;
    return regeneratorRuntime.async(function deleteProduct$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return regeneratorRuntime.awrap(_axiosConfig["default"]["delete"]("/api/products/".concat(productId)));

          case 3:
            response = _context5.sent;
            return _context5.abrupt("return", (0, _errorHandler.handleApiSuccess)(response));

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            throw (0, _errorHandler.handleApiError)(_context5.t0);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 7]]);
  },

  /**
   * 단일 상품 주문 생성 (바로 구매)
   * @param {Object} orderData - { items: [{ productId, quantity }], deliveryId, paymentMethod }
   */
  createSingleOrder: function createSingleOrder(orderData) {
    var response, result;
    return regeneratorRuntime.async(function createSingleOrder$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return regeneratorRuntime.awrap(_axiosConfig["default"].post("/api/orders/single", orderData));

          case 3:
            response = _context6.sent;
            result = (0, _errorHandler.handleApiSuccess)(response);

            if (result) {
              _context6.next = 7;
              break;
            }

            throw new Error("주문 생성에 실패했습니다.");

          case 7:
            return _context6.abrupt("return", result);

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](0);
            throw (0, _errorHandler.handleApiError)(_context6.t0);

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },

  /**
   * 장바구니 기반 주문 생성
   * @param {Object} orderData - { cartItemIds: number[], deliveryId: number, paymentMethod: string }
   */
  createOrderFromCart: function createOrderFromCart(orderData) {
    var response, result;
    return regeneratorRuntime.async(function createOrderFromCart$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return regeneratorRuntime.awrap(_axiosConfig["default"].post("/api/orders/from-cart", orderData));

          case 3:
            response = _context7.sent;
            result = (0, _errorHandler.handleApiSuccess)(response);

            if (result) {
              _context7.next = 7;
              break;
            }

            throw new Error("주문 생성에 실패했습니다.");

          case 7:
            return _context7.abrupt("return", result);

          case 10:
            _context7.prev = 10;
            _context7.t0 = _context7["catch"](0);
            throw (0, _errorHandler.handleApiError)(_context7.t0);

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, null, null, [[0, 10]]);
  }
}; // 개별 함수로도 export (기존 코드 호환성)

exports.productApi = productApi;
var getFilteredProducts = productApi.getFilteredProducts;
exports.getFilteredProducts = getFilteredProducts;
var getProductById = productApi.getProductById;
exports.getProductById = getProductById;
var createProduct = productApi.createProduct;
exports.createProduct = createProduct;
var updateProduct = productApi.updateProduct;
exports.updateProduct = updateProduct;
var deleteProduct = productApi.deleteProduct;
exports.deleteProduct = deleteProduct;
var createSingleOrder = productApi.createSingleOrder;
exports.createSingleOrder = createSingleOrder;
var createOrderFromCart = productApi.createOrderFromCart;
exports.createOrderFromCart = createOrderFromCart;
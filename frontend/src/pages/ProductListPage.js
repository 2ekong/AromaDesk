import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredProducts } from "../app/slices/productSlice";
import ProductCard from "../components/common/ProductCard";
import Pagination from "../components/common/Pagination";
import "./ProductListPage.css";

const ProductListPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error, filters, pagination } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    // 초기 상품 목록 로드
    dispatch(fetchFilteredProducts());
  }, [dispatch]);

  // 필터 변경 핸들러
  const handleFilterChange = (filterType, value) => {
    dispatch(fetchFilteredProducts({ ...filters, [filterType]: value }));
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    dispatch(fetchFilteredProducts({ ...filters, page: newPage }));
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">오류: {error}</div>;

  return (
    <div className="product-list-page">
      <div className="product-list-header">
        <h2>향수 상품 목록</h2>

        {/* 필터 섹션 */}
        <div className="filters">
          <select
            value={filters.brand || ""}
            onChange={(e) =>
              handleFilterChange("brand", e.target.value || null)
            }
            className="filter-select"
          >
            <option value="">브랜드 전체</option>
            <option value="CHANEL">CHANEL</option>
            <option value="DIOR">DIOR</option>
            <option value="HERMES">HERMES</option>
            <option value="JO MALONE">JO MALONE</option>
            <option value="TOM FORD">TOM FORD</option>
          </select>

          <select
            value={filters.category || ""}
            onChange={(e) =>
              handleFilterChange("category", e.target.value || null)
            }
            className="filter-select"
          >
            <option value="">용량 전체</option>
            <option value="UNDER_30ML">30ml</option>
            <option value="UNDER_50ML">50ml</option>
            <option value="LARGE">대용량</option>
          </select>

          <select
            value={filters.gender || ""}
            onChange={(e) =>
              handleFilterChange("gender", e.target.value || null)
            }
            className="filter-select"
          >
            <option value="">성별 전체</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
            <option value="UNISEX">남녀공용</option>
          </select>

          <select
            value={filters.minPrice || ""}
            onChange={(e) =>
              handleFilterChange("minPrice", e.target.value || null)
            }
            className="filter-select"
          >
            <option value="">가격 전체</option>
            <option value="50000">5만원 이상</option>
            <option value="100000">10만원 이상</option>
            <option value="150000">15만원 이상</option>
            <option value="200000">20만원 이상</option>
          </select>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="product-grid">
        {products.length === 0 ? (
          <div className="no-products">
            <p>조건에 맞는 상품이 없습니다.</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* 페이징 */}
      {pagination.total > pagination.size && (
        <Pagination
          currentPage={pagination.page}
          totalPages={Math.ceil(pagination.total / pagination.size)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductListPage;

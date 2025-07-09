import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredProducts } from "../app/slices/productSlice";
import { fetchCartItems } from "../app/slices/cartSlice";
import ProductCard from "../components/common/ProductCard";
import MainVisualSlider from "../components/MainVisualSlider";

const MainPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error, pagination } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastResponseSize, setLastResponseSize] = useState(0);

  // 초기 로드
  useEffect(() => {
    dispatch(
      fetchFilteredProducts({
        page: 1,
        size: 20, // 한 번에 20개씩 로드
        statuses: ['HOT'],
      })
    );
    
    // 로그인한 사용자가 있을 때만 장바구니 불러오기
    if (user && user.memberId) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user]);

  // 무한 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 스크롤이 하단 100px 전에 도달하면 다음 페이지 로드
    if (scrollTop + windowHeight >= documentHeight - 100) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      dispatch(
        fetchFilteredProducts({
          page: nextPage,
          size: 20,
          append: true, // 기존 상품에 추가
          statuses: ['HOT'],
          status: 'HOT',
        })
      );
    }
  }, [loading, hasMore, currentPage, dispatch]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 더 많은 상품이 있는지 확인 (개선된 로직)
  useEffect(() => {
    if (pagination) {
      // 방법 1: totalPages 기반 확인
      if (pagination.totalPages !== undefined) {
        setHasMore(currentPage < pagination.totalPages);
      }
      // 방법 2: 총 상품 수와 현재 로드된 상품 수 비교
      else if (pagination.total !== undefined) {
        setHasMore(products.length < pagination.total);
      }
      // 방법 3: 마지막 응답 크기로 확인 (빈 배열이면 더 이상 없음)
      else if (lastResponseSize === 0 && currentPage > 1) {
        setHasMore(false);
      }
    }
  }, [pagination, currentPage, products.length, lastResponseSize]);

  // 응답된 상품 개수 추적
  useEffect(() => {
    if (products.length > 0) {
      const currentResponseSize = products.length - (currentPage - 1) * 20;
      setLastResponseSize(currentResponseSize);

      // 응답된 상품이 요청한 size보다 적으면 더 이상 없음
      if (currentResponseSize < 20 && currentPage > 1) {
        setHasMore(false);
      }
    }
  }, [products.length, currentPage]);

  return (
    <main className="flex-grow-1">
      {/* 메인 비주얼 슬라이더 */}
      <section style={{ margin: '0' }}>
        <MainVisualSlider />
      </section>

      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">
            인기 상품
          </h2>
          {hasMore && (
            <small className="text-muted">
              스크롤하여 더 많은 상품을 확인하세요
            </small>
          )}
        </div>

        {error ? (
          <div className="alert alert-danger">
            <strong>오류가 발생했습니다:</strong> {error}
          </div>
        ) : (
          <div className="row g-4">
            {products.length === 0 && !loading ? (
              <div className="col-12 text-center text-muted py-5">
                <h4>상품이 없습니다</h4>
                <p>현재 등록된 상품이 없습니다.</p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                  key={product.id}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        )}

        {/* 로딩 인디케이터 */}
        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">로딩 중...</span>
            </div>
            <p className="mt-2">상품을 불러오는 중...</p>
          </div>
        )}

        {/* 더 이상 로드할 상품이 없을 때 */}
        {/*{!hasMore && products.length > 0 && (*/}
        {/*  <div className="text-center py-4">*/}
        {/*    <p className="text-muted">모든 상품을 불러왔습니다.</p>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </main>
  );
};

export default MainPage;

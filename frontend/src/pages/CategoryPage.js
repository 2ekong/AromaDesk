import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchFilteredProducts } from "../app/slices/productSlice";
import ProductCard from "../components/common/ProductCard";

const VOLUME_OPTIONS = [
  { code: "", label: "전체" },
  { code: "UNDER_30ML", label: "30ml" },
  { code: "UNDER_50ML", label: "50ml" },
  { code: "LARGE", label: "대용량" },
];

const PRICE_OPTIONS = [
  { code: "", label: "가격 전체" },
  { code: "100000", label: "10만원 이하" },
  { code: "200000", label: "20만원 이하" },
  { code: "300000", label: "30만원 이하" },
  { code: "500000", label: "50만원 이하" },
];

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const { category } = useParams();

  const [volume, setVolume] = useState("");
  const [price, setPrice] = useState("");

  // URL에서 받아온 카테고리를 백엔드 API 형식에 맞게 변환
  const gender = category ? category.toUpperCase() : "MALE";

  // 카테고리 이름 매핑
  const getCategoryName = (code) => {
    const categoryMap = {
        MALE: "남성",
  FEMALE: "여성",
  UNISEX: "남녀공용",
    };
    return categoryMap[code] || code;
  };

  useEffect(() => {
    // 페이지 마운트 시 필터링 상태 초기화
    setVolume("");
    setPrice("");
  }, [category]);

  useEffect(() => {
    // 옵션에 맞는 상품 불러오기
    const params = { gender, size: 1000 };
    if (volume) params.volume = volume;
    if (price) params.maxPrice = price;

    console.log("CategoryPage 필터링 파라미터:", params);
    dispatch(fetchFilteredProducts(params));
  }, [dispatch, gender, volume, price]);

  return (
    <main className="flex-grow-1">
      <div className="container-fluid py-4">
        <div className="d-flex align-items-center mb-4 gap-4">
          <div>
            <label className="form-label fw-semibold me-2">용량별</label>
            <select
              className="form-select d-inline-block w-auto"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            >
              {VOLUME_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label fw-semibold me-2">가격대</label>
            <select
              className="form-select d-inline-block w-auto"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              {PRICE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <h3 className="fw-bold mb-3">{getCategoryName(gender)}</h3>
        {/* 상품 리스트 */}
        <div className="row g-4">
          {loading ? (
            <div className="col-12 text-center py-5">상품을 불러오는 중...</div>
          ) : error ? (
            <div className="col-12 text-center text-danger">오류: {error}</div>
          ) : products.length === 0 ? (
            <div className="col-12 text-center text-muted">
              조건에 맞는 상품이 없습니다.
            </div>
          ) : (
            products.map((product) => (
              <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;

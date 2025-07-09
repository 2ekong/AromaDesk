import React, { useState, useEffect } from "react";
import AdminLayout from "../components/admin/layout/AdminLayout";
import { adminProductApi } from "../api/adminProductApi";
import { productApi } from "../api/productApi";
import "../css/AdminProductPage.css";
import { AdminProductEditModal, AdminSuccessModal, AdminProductAddModal, AdminDeleteConfirmModal } from "../components/admin/UnifiedAdminModal";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    genderCategory: "",
    volumeCategory: "",
    price: "",
    stock: "",
    imageUrl: "",
    description: "",
  });
  // 필터 상태
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [volume, setVolume] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  // 브랜드 목록 상태 (최초 1회만 받아옴)
  const [brandList, setBrandList] = useState([]);
  // 페이징 상태
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // 성별 카테고리 매핑
  const genderCategoryMap = {
      MALE: "남성",
  FEMALE: "여성",
  UNISEX: "남녀공용"
  };

  // 용량 카테고리 매핑
  const volumeCategoryMap = {
      UNDER_30ML: "30ml",
  UNDER_50ML: "50ml",
  LARGE: "대용량"
  };

  // 브랜드 목록 최초 1회만 받아오기
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brands = await adminProductApi.getBrands();
        setBrandList(brands);
      } catch (err) {
        setBrandList([]);
      }
    };
    fetchBrands();
  }, []);

  // 상품 목록 조회 (필터+페이징)
  const fetchProducts = async (pageParam = page) => {
    try {
      setLoading(true);
      const params = {};
      if (brand) params.brand = brand;
      if (gender) params.gender = gender;
      if (volume) params.volume = volume;
      if (keyword) params.keyword = keyword;
      if (status) {
        params.statuses = [status]; // 단일 상태도 배열로
      } else {
        // 기본: HOT, ACTIVE, SOLD_OUT
        params.statuses = ["HOT", "ACTIVE", "SOLD_OUT"];
      }
      params.page = pageParam;
      params.size = size;
      const response = await adminProductApi.getProducts(params);
      setProducts(response.content || response);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
      setError(null);
    } catch (err) {
      console.error("상품 목록 조회 실패:", err);
      if(err.response?.status === 401 || err.response?.status === 403) {
        window.location.href = "/adminLogin";
      } else {
        setError("상품 목록을 불러오는데 실패했습니다.");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1); // 필터 변경 시 1페이지로 이동
    setPage(1);
    // eslint-disable-next-line
  }, [brand, gender, volume, size]);

  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line
  }, [page]);

  // 상품 생성
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await adminProductApi.createProduct(newProduct);
      setShowAddForm(false);
      setNewProduct({
        name: "",
        brand: "",
        genderCategory: "",
        volumeCategory: "",
        price: "",
        stock: "",
        imageUrl: "",
        description: "",
      });
      fetchProducts();
      setSuccessModalMessage("상품이 성공적으로 생성되었습니다.");
      setIsError(false);
      setSuccessModalOpen(true);
    } catch (err) {
      setSuccessModalMessage("상품 생성에 실패했습니다.");
      setIsError(true);
      setSuccessModalOpen(true);
    }
  };

  // 상품 수정
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await adminProductApi.updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
      await fetchProducts();
      setSuccessModalMessage("상품이 성공적으로 수정되었습니다.");
      setIsError(false);
      setSuccessModalOpen(true);
    } catch (err) {
      setSuccessModalMessage("상품 수정에 실패했습니다.");
      setIsError(true);
      setSuccessModalOpen(true);
    }
  };

  // 상품 삭제
  const handleDeleteProduct = async (productId) => {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await adminProductApi.deleteProduct(productToDelete);
      fetchProducts();
      setSuccessModalMessage("상품이 성공적으로 '삭제'되었습니다.");
      setIsError(false);
      setSuccessModalOpen(true);
    } catch (err) {
      setSuccessModalMessage("상품 '삭제'에 실패했습니다.");
      setIsError(true);
      setSuccessModalOpen(true);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1 style={{fontSize: '28px', fontWeight: '700', marginBottom: '8px'}}>상품 관리</h1>
        <h2 style={{fontSize: '16px', color: '#888', marginBottom: '24px'}}>상품 정보 조회 및 관리를 할 수 있습니다</h2>
        {/* 필터 바 */}
        <div className="filter-bar">
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">브랜드 전체</option>
            {brandList.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">성별 전체</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
            <option value="UNISEX">남녀공용</option>
          </select>
          <select value={volume} onChange={(e) => setVolume(e.target.value)}>
            <option value="">용량 전체</option>
            <option value="UNDER_30ML">30ml</option>
            <option value="UNDER_50ML">50ml</option>
            <option value="LARGE">대용량</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">전체 상태</option>
            <option value="ACTIVE">판매중</option>
            <option value="HOT">인기상품</option>
            <option value="SOLD_OUT">품절</option>
            <option value="INACTIVE">비활성</option>
          </select>

          <input
            type="text"
            placeholder="상품명/설명 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ flex: 1 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                fetchProducts(1);
              }
            }}
          />
          <button onClick={() => fetchProducts(1)}>검색</button>
        </div>
        {/* 페이지네이션 */}
        <div className="pagination-bar">
          <span>총 {totalElements}개 | </span>
          <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
            이전
          </button>
          <span style={{ margin: "0 8px" }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            다음
          </button>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value={10}>10개씩</option>
            <option value={20}>20개씩</option>
            <option value={50}>50개씩</option>
          </select>
        </div>

        {/* 상품 추가 버튼 */}
        <button className="add-button" onClick={() => setShowAddForm(true)}>
          상품 추가
        </button>

        {/* 상품 목록 */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>상품명</th>
                <th>브랜드</th>
                <th>성별</th>
                <th>용량</th>
                <th>가격</th>
                <th>재고</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(products) ? products : []).map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{genderCategoryMap[product.genderCategory] || product.genderCategory}</td>
                  <td>{volumeCategoryMap[product.volumeCategory] || product.volumeCategory}</td>
                  <td>{product.price?.toLocaleString()}원</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      onClick={() => {
                        console.log("수정 버튼 클릭됨:", product);
                        setEditingProduct(product);
                      }}
                    >
                      수정
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 상품 추가 모달 */}
        <AdminProductAddModal
          open={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleCreateProduct}
          product={newProduct}
          onChange={setNewProduct}
        />

        {/* 상품 수정 모달 */}
        {editingProduct && (
          <AdminProductEditModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSubmit={handleUpdateProduct}
            onChange={setEditingProduct}
          />
        )}

        {/* 삭제 확인 모달 */}
        <AdminDeleteConfirmModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
        
        <AdminSuccessModal 
          open={successModalOpen} 
          onClose={() => setSuccessModalOpen(false)}
          message={successModalMessage}
          isError={isError}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProductPage;

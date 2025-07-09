import React from "react";
import "../../css/AdminModal.css";

// 성공 알림 모달
const AdminSuccessModal = ({ 
  open, 
  onClose, 
  message, 
  isError = false 
}) => {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className={`admin-success-modal ${isError ? 'error' : ''}`}>
        <div className="admin-success-modal-icon">
          {isError ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          )}
        </div>
        
        <h2 className="admin-success-modal-title">
          {isError ? "수정 실패" : "수정 완료"}
        </h2>
        
        <p className="admin-success-modal-message">
          {message}
        </p>
        
        <button 
          className="admin-success-modal-button"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
};

// 상품 수정 모달
const AdminProductEditModal = ({ 
  product, 
  onClose, 
  onSubmit, 
  onChange 
}) => {
  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleInputChange = (field, value) => {
    onChange({
      ...product,
      [field]: value
    });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-product-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-product-edit-modal-header">
          <h2>상품 수정</h2>
        </div>
        
        <div className="admin-product-edit-modal-body">
          <form className="admin-product-edit-form" onSubmit={handleSubmit}>
            <div className="admin-product-edit-form-group">
              <label>상품명</label>
              <input
                type="text"
                value={product.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                placeholder="상품명을 입력하세요"
              />
            </div>

            <div className="admin-product-edit-form-group">
              <label>브랜드</label>
              <input
                type="text"
                value={product.brand || ""}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                required
                placeholder="브랜드를 입력하세요"
              />
            </div>

            <div className="admin-product-edit-form-group">
              <label>성별 카테고리</label>
              <select
                value={product.genderCategory || ""}
                onChange={(e) => handleInputChange("genderCategory", e.target.value)}
                required
              >
                <option value="">선택하세요</option>
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
                <option value="UNISEX">남녀공용</option>
              </select>
            </div>

            <div className="admin-product-edit-form-group">
              <label>용량 카테고리</label>
              <select
                value={product.volumeCategory || ""}
                onChange={(e) => handleInputChange("volumeCategory", e.target.value)}
                required
              >
                <option value="">선택하세요</option>
                <option value="UNDER_30ML">30ml</option>
                <option value="UNDER_50ML">50ml</option>
                <option value="LARGE">대용량</option>
              </select>
            </div>

            <div className="admin-product-edit-form-group">
              <label>가격</label>
              <input
                type="number"
                value={product.price || ""}
                onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                required
                placeholder="가격을 입력하세요"
                min="0"
                onWheel={(e) => e.target.blur()}
              />
            </div>

            <div className="admin-product-edit-form-group">
              <label>재고</label>
              <input
                type="number"
                value={product.stock || ""}
                onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
                required
                placeholder="재고 수량을 입력하세요"
                min="0"
                onWheel={(e) => e.target.blur()}
              />
            </div>

            <div className="admin-product-edit-form-group">
              <label>상태</label>
              <select
                  value={product.status || ""}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  required
              >
                <option value="ACTIVE">판매중</option>
                <option value="SOLD_OUT">일시품절</option>
                <option value="DISCONTINUED">단종</option>
                <option value="INACTIVE">임시 판매중단</option>
                <option value="HOT">인기 상품</option>
              </select>
            </div>

            <div className="admin-product-edit-form-group">
              <label>이미지 URL</label>
              <input
                type="text"
                value={product.imageUrl || ""}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                required
                placeholder="이미지 URL을 입력하세요"
              />
            </div>

            <div className="admin-product-edit-form-group">
              <label>설명</label>
              <textarea
                value={product.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
                placeholder="상품 설명을 입력하세요"
              />
            </div>
          </form>
        </div>

        <div className="admin-product-edit-modal-footer">
          <button
            type="button"
            className="admin-product-edit-button admin-product-edit-button-secondary"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="submit"
            className="admin-product-edit-button admin-product-edit-button-primary"
            onClick={handleSubmit}
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

// 상품 추가 모달
const AdminProductAddModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  product, 
  onChange 
}) => {
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleInputChange = (field, value) => {
    onChange({
      ...product,
      [field]: value
    });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-product-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-product-edit-modal-header">
          <h2>새 상품 추가</h2>
        </div>
        
        <div className="admin-product-edit-modal-body">
          <form className="admin-product-edit-form" onSubmit={handleSubmit}>
            <div className="admin-product-edit-form-group">
              <label>상품명</label>
              <input
                type="text"
                value={product.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                placeholder="상품명을 입력하세요"
              />
            </div>

            <div className="admin-product-edit-form-group">
              <label>브랜드</label>
              <input
                type="text"
                value={product.brand || ""}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                required
                placeholder="브랜드를 입력하세요"
              />
            </div>

            <div className="admin-product-edit-form-group">
              <label>성별 카테고리</label>
              <select
                value={product.genderCategory || ""}
                onChange={(e) => handleInputChange("genderCategory", e.target.value)}
                required
              >
                <option value="">선택하세요</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
                <option value="남녀공용">남녀공용</option>
              </select>
            </div>

            <div className="admin-product-edit-form-group">
              <label>용량 카테고리</label>
              <select
                value={product.volumeCategory || ""}
                onChange={(e) => handleInputChange("volumeCategory", e.target.value)}
                required
              >
                <option value="">선택하세요</option>
                <option value="UNDER_30ML">30ml</option>
                <option value="UNDER_50ML">50ml</option>
                <option value="LARGE">대용량</option>
              </select>
            </div>

            <div className="admin-product-edit-form-group">
              <label>가격</label>
              <input
                type="number"
                value={product.price || ""}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
                placeholder="가격을 입력하세요"
                min="0"
                onWheel={(e) => e.target.blur()}
              />
            </div>

            <div className="admin-product-edit-form-group">
              <label>재고</label>
              <input
                type="number"
                value={product.stock || ""}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                required
                placeholder="재고 수량을 입력하세요"
                min="0"
                onWheel={(e) => e.target.blur()}
              />
            </div>

            <div className="admin-product-edit-form-group">
              <label>이미지 URL</label>
              <input
                type="text"
                value={product.imageUrl || ""}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                required
                placeholder="이미지 URL을 입력하세요"
              />
            </div>

            <div className="admin-product-edit-form-group">
              <label>설명</label>
              <textarea
                value={product.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
                placeholder="상품 설명을 입력하세요"
              />
            </div>
          </form>
        </div>

        <div className="admin-product-edit-modal-footer">
          <button
            type="button"
            className="admin-product-edit-button admin-product-edit-button-secondary"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="submit"
            className="admin-product-edit-button admin-product-edit-button-primary"
            onClick={handleSubmit}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

// 삭제 확인 모달
const AdminDeleteConfirmModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  message = "정말로 이 상품을 삭제하시겠습니까?" 
}) => {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-delete-confirm-modal-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <h2 className="admin-delete-confirm-modal-title">
          삭제 확인
        </h2>
        
        <p className="admin-delete-confirm-modal-message">
          {message}
        </p>
        
        <div className="admin-delete-confirm-modal-buttons">
          <button 
            className="admin-delete-confirm-modal-button admin-delete-confirm-modal-button-cancel"
            onClick={onClose}
          >
            취소
          </button>
          
          <button 
            className="admin-delete-confirm-modal-button admin-delete-confirm-modal-button-delete"
            onClick={handleConfirm}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

// 기본 관리자 모달
const AdminBasicModal = ({ 
  open, 
  onClose, 
  children, 
  title,
  showConfirmButton = true,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  showCancelButton = false
}) => {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        {title && (
          <h2 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "600", color: "#1f2937" }}>
            {title}
          </h2>
        )}
        
        <div style={{ marginBottom: "20px" }}>
          {children}
        </div>
        
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          {showCancelButton && (
            <button 
              className="admin-product-edit-button admin-product-edit-button-secondary"
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          
          {showConfirmButton && (
            <button 
              className="admin-product-edit-button admin-product-edit-button-primary"
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 통합 export
export {
  AdminSuccessModal,
  AdminProductEditModal,
  AdminProductAddModal,
  AdminDeleteConfirmModal,
  AdminBasicModal
};

// 기본 export (기존 호환성 유지)
export default AdminBasicModal; 
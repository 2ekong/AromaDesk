import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCartAction } from "../../app/slices/cartSlice";
import { formatPrice } from "../../utils/formatters";

const cardStyle = {
  border: "none",
  borderRadius: "18px",
  boxShadow: "0 4px 24px rgba(80, 80, 120, 0.08)",
  transition: "transform 0.18s, box-shadow 0.18s",
  cursor: "pointer",
  minHeight: 340,
  background: "#fff",
  overflow: "hidden",
};
const cardHoverStyle = {
  transform: "translateY(-6px) scale(1.03)",
  boxShadow: "0 8px 32px rgba(80, 80, 120, 0.16)",
};
const imgStyle = {
  width: "100%",
  height: 180,
  objectFit: "contain",
  borderTopLeftRadius: "18px",
  borderTopRightRadius: "18px",
  background: "#f4f4f4",
};
const priceStyle = {
  color: "#2563eb",
  fontWeight: 700,
  fontSize: 18,
};
const btnStyle = {
  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 500,
  fontSize: 15,
  padding: "8px 18px",
  marginTop: 8,
  transition: "background 0.2s",
};
const disabledBtnStyle = {
  background: "gray",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 500,
  fontSize: 15,
  padding: "8px 18px",
  marginTop: 8,
  transition: "background 0.2s",
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [hover, setHover] = React.useState(false);

  // 재고 상태 확인
  const isOutOfStock = !product.stock || product.stock <= 0;

  // 카테고리 매핑 함수
  const getGenderLabel = (gender) => {
    const genderMap = {
      'MALE': '남성',
      'FEMALE': '여성',
      'UNISEX': '남녀공용'
    };
    return genderMap[gender] || gender;
  };

  const getVolumeLabel = (volume) => {
    const volumeMap = {
      'UNDER_30ML': '30ml',
      'UNDER_50ML': '50ml',
      'LARGE': '대용량'
    };
    return volumeMap[volume] || volume;
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // 로그인 확인
    if (!user || !user.memberId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 재고가 없으면 추가하지 않음
    if (isOutOfStock) {
      alert("재고가 부족합니다.");
      return;
    }

    dispatch(
      addToCartAction({
        memberId: user.id,
        productId: product.id,
        quantity: 1,
      })
    );
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      className="card h-100"
      style={hover ? { ...cardStyle, ...cardHoverStyle } : cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleCardClick}
    >
      <div style={{ position: "relative" }}>
        <img
          src={product.imageUrl || "/placeholder-product.jpg"}
          alt={product.name}
          style={imgStyle}
          onError={(e) => {
            e.target.src = "/placeholder-product.jpg";
          }}
        />
        {/* 장바구니 버튼 완전 제거 */}
        {/* 재고 부족 표시 */}
        {isOutOfStock && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(239, 68, 68, 0.9)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            품절
          </div>
        )}
      </div>
      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <h5 className="card-title mb-1 fw-bold" style={{ fontSize: 18 }}>
            {product.name}
          </h5>
          <div className="text-muted mb-1" style={{ fontSize: 14 }}>
            {product.brand}
          </div>
          <div className="mb-2" style={{ fontSize: 13 }}>
            {product.genderCategory && (
              <span className="badge bg-light text-dark me-1">
                {getGenderLabel(product.genderCategory)}
              </span>
            )}
            {product.volumeCategory && (
              <span className="badge bg-light text-dark">
                {getVolumeLabel(product.volumeCategory)}
              </span>
            )}
            {/* 재고 상태 표시 */}
            {!isOutOfStock && (
              <span className="badge bg-success text-white ms-1">
                재고: {product.stock}개
              </span>
            )}
          </div>
        </div>
        <div className="d-flex flex-column align-items-start mt-2">
          <span style={priceStyle}>{formatPrice(product.price)}</span>
          {product.createdAt && (
            <span className="text-secondary mt-1" style={{ fontSize: 12 }}>
              등록일: {product.createdAt}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

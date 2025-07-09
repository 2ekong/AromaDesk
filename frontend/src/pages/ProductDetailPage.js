import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../app/slices/productSlice";
import { addToCartAction } from "../app/slices/cartSlice";
import {
  FaTruck,
  FaHeart,
  FaStar,
  FaRegStar,
  FaRegCommentDots,
} from "react-icons/fa";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { currentProduct, loading, error } = useSelector(
    (state) => state.product
  );
  const [selectedImg, setSelectedImg] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

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

  React.useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) return <div className="text-center py-5">로딩 중...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!currentProduct) return null;

  const thumbnails = currentProduct.imageUrl ? [currentProduct.imageUrl] : [];

  const extractImagesFromDescription = (description) => {
    if (!description) return [];
    const imageRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi;
    const matches = description.match(imageRegex);
    return matches || [];
  };

  const detailImages = extractImagesFromDescription(currentProduct.description);

  const handleAddToCart = () => {
    if (!user || !user.memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    dispatch(
      addToCartAction({
        memberId: user.id,
        productId: currentProduct.id,
        quantity,
      })
    ).then(() => {
      navigate("/cart");
    });
  };

  const handleBuyNow = () => {
  if (!user || !user.memberId) {
    alert("로그인이 필요합니다.");
    return;
  }

  const orderData = {
    type: "single",
    items: [
      {
        ...currentProduct,
        productId: currentProduct.id,
        quantity,
      },
    ],
    deliveryId: 1,
    paymentMethod: "MOCK",
    product: currentProduct,
  };

  localStorage.setItem("pendingOrder", JSON.stringify(orderData)); // ✅ 추가
  navigate("/order/payment");
};


  return (
    <main className="container py-5">
      <div className="row g-4">
        <div className="col-md-5">
          <div className="bg-white rounded shadow-sm p-3 mb-3 text-center">
            {thumbnails.length > 0 ? (
              <img
                src={thumbnails[selectedImg]}
                alt={currentProduct.name}
                className="img-fluid rounded"
                style={{
                  maxHeight: 380,
                  objectFit: "contain",
                  background: "#f8f9fa",
                }}
                onError={(e) => {
                  e.target.src = "/placeholder-product.jpg";
                }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  height: 380,
                  background: "#f8f9fa",
                  borderRadius: "0.375rem",
                }}
              >
                <span className="text-muted">이미지 준비중</span>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-7">
          <h2 className="fw-bold mb-2">{currentProduct.name}</h2>
          <div className="mb-2 text-muted">{currentProduct.brand}</div>
          <div className="mb-3">
            <span className="fs-2 fw-bold text-primary">
              {currentProduct.price.toLocaleString()}원
            </span>
            <span
              className="badge bg-warning text-dark ms-2 align-middle"
              style={{ fontSize: 15 }}
            >
              <FaTruck className="me-1 mb-1" /> 내일(빠른배송)
            </span>
          </div>
          <div className="mb-3">
            <span className="badge bg-light text-dark me-2">
              {getGenderLabel(currentProduct.genderCategory)}
            </span>
            <span className="badge bg-light text-dark">
              {getVolumeLabel(currentProduct.volumeCategory)}
            </span>
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="me-2 fw-semibold">
              수량:
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              style={{ width: 80 }}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div className="d-flex gap-2 mb-3">
            <button
              className="btn btn-primary btn-lg flex-grow-1 shadow-sm"
              onClick={handleAddToCart}
            >
              장바구니 담기
            </button>
            <button
              className="btn btn-danger btn-lg flex-grow-1 shadow-sm"
              onClick={handleBuyNow}
            >
              바로구매
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="tab-content p-3 border bg-white rounded">
          <div>
            {detailImages.length > 0 && (
              <div className="mb-4">
                {detailImages.map((imageUrl, index) => (
                  <div key={index} className="mb-3 text-center">
                    <img
                      src={imageUrl}
                      alt={`상품 상세정보 ${index + 1}`}
                      className="img-fluid rounded"
                      style={{ maxWidth: "100%" }}
                      onError={(e) => {
                        console.warn(`이미지 로드 실패: ${imageUrl}`);
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="table-responsive">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th className="bg-light" style={{ width: "30%" }}>
                      브랜드
                    </th>
                    <td>{currentProduct.brand}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">성별</th>
                    <td>{getGenderLabel(currentProduct.genderCategory)}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">용량</th>
                    <td>{getVolumeLabel(currentProduct.volumeCategory)}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">가격</th>
                    <td>{currentProduct.price.toLocaleString()}원</td>
                  </tr>
                  <tr>
                    <th className="bg-light">재고</th>
                    <td>{currentProduct.stock}개</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
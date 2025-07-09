import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import orderApi from "../api/orderApi";
import cartApi from "../api/cartApi";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { type, items = [], deliveryId, paymentMethod } = location.state || {};

  const [orderItems, setOrderItems] = useState([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(deliveryId || 1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod || "MOCK");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (type === "cart") {
      const fetchCartItems = async () => {
        try {
          // 로그인한 사용자의 memberId 사용
          if (!user || !user.memberId) {
            setMessage("로그인이 필요합니다.");
            navigate("/login");
            return;
          }
          
          const res = await cartApi.getCartItems(user.id);
          const selected = res.filter((item) => items.includes(item.cartItemId));
          setOrderItems(selected);
        } catch (err) {
          setMessage("장바구니 불러오기 실패");
        }
      };
      fetchCartItems();
    } else if (type === "single") {
      setOrderItems(items);
    }
  }, [type, items, user, navigate]);

  const handleOrder = async () => {
    if (orderItems.length === 0) {
      setMessage("주문할 상품이 없습니다.");
      return;
    }

    let result;

    if (type === "cart") {
      const cartItemIds = orderItems.map((item) => item.cartItemId);
      result = await orderApi.createOrderFromCart({
        cartItemIds,
        deliveryId: selectedDeliveryId,
        paymentMethod: selectedPaymentMethod,
      });
    } else if (type === "single") {
      const item = orderItems[0];
      result = await orderApi.createSingleOrder({
        productId: item.productId,
        quantity: item.quantity,
        deliveryId: selectedDeliveryId,
        paymentMethod: selectedPaymentMethod,
      });
    }

    if (result.success) {
    const orderId = result.data?.orderId;
    setMessage("주문이 완료되었습니다.");
    setTimeout(() => {
        if (orderId) {
        navigate(`/order/complete?orderId=${orderId}`);
        } else {
        navigate("/mypage/orders");
        }
    }, 1500);
    } else {
    setMessage(result.error || "주문 실패");
    }

};

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>주문서</h2>

      <div style={styles.section}>
        <h4>주문 상품</h4>
        {orderItems.length > 0 ? (
          orderItems.map((item, index) => (
            <div key={index} style={styles.itemBox}>
              <div>상품명: {item.name}</div>
              <div>수량: {item.quantity}</div>
              <div>가격: {(item.price * item.quantity).toLocaleString()}원</div>
            </div>
          ))
        ) : (
          <div>주문 항목이 없습니다.</div>
        )}
      </div>

      <div style={styles.section}>
        <h4>배송지 선택</h4>
        <select
          value={selectedDeliveryId}
          onChange={(e) => setSelectedDeliveryId(Number(e.target.value))}
          style={styles.select}
        >
          <option value={1}>우리집</option>
          <option value={2}>회사</option>
        </select>
      </div>

      <div style={styles.section}>
        <h4>결제 방식</h4>
        <select
          value={selectedPaymentMethod}
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          style={styles.select}
        >
          <option value="MOCK">모의 결제</option>
          <option value="CARD">카드 결제</option>
          <option value="CASH">무통장 입금</option>
        </select>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      <button onClick={handleOrder} style={styles.orderButton}>
        주문하기
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "700px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  section: {
    marginBottom: "1.5rem",
  },
  itemBox: {
    padding: "0.5rem",
    marginBottom: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  select: {
    padding: "0.5rem",
    width: "100%",
    fontSize: "1rem",
  },
  message: {
    margin: "1rem 0",
    color: "green",
    textAlign: "center",
  },
  orderButton: {
    width: "100%",
    padding: "1rem",
    fontSize: "1.2rem",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default OrderPage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Spinner, Alert, Nav } from "react-bootstrap";
import { getMyOrders } from "../api/mypageApi";

const STATUS_LABELS = {
  ALL: "전체",
  PREPARING: "배송 준비중",
  SHIPPED: "배송중",
  DELIVERED: "배송 완료",
};

const STATUS_TABS = ["ALL", "PREPARING", "SHIPPED", "DELIVERED"];

const PAYMENT_METHOD_LABELS = {
  MOCK: "모의 결제",
  CARD: "카드 결제",
  BANK: "무통장 입금",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await getMyOrders();

        const notCancelled = result.filter(
          (order) => order.orderStatus !== "CANCELLED"
        );

        const sorted = notCancelled.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sorted);
      } catch (err) {
        setError("주문 내역을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedStatus === "ALL") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) => order.deliveryStatus === selectedStatus
      );
      setFilteredOrders(filtered);
    }
  }, [orders, selectedStatus]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <div className="py-4">
      <h4 className="mb-4 fw-bold">나의 주문</h4>
      <Nav variant="tabs" activeKey={selectedStatus} className="mb-4">
        {STATUS_TABS.map((status) => (
          <Nav.Item key={status}>
            <Nav.Link
              eventKey={status}
              onClick={() => setSelectedStatus(status)}
            >
              {STATUS_LABELS[status]}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {filteredOrders.length === 0 ? (
        <p className="text-muted">해당 상태의 주문이 없습니다.</p>
      ) : (
        filteredOrders.map((order) => (
          <Card key={order.orderId} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-2">주문번호: {order.orderId}</h6>
                  <p className="mb-1">
                    결제 수단: {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                  </p>
                  <p className="mb-1">
                    총 결제 금액: {order.totalPrice.toLocaleString()}원
                  </p>
                  <p className="mb-0 text-primary">
                    배송 상태:{" "}
                    {STATUS_LABELS[order.deliveryStatus] ||
                      order.deliveryStatus ||
                      "정보 없음"}
                  </p>
                </div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() =>
                    navigate(`/order/complete?orderId=${order.orderId}`)
                  }
                >
                  상세 보기
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default MyOrders;

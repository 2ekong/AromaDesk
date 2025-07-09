import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/layout/AdminLayout";
import apiClient from "../api/axiosConfig";
import { AdminBasicModal, AdminSuccessModal } from "../components/admin/UnifiedAdminModal";
import "../css/AdminOrderDetailPage.css";

function AdminOrderDetailPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState("");
    const [deliveryStatus, setDeliveryStatus] = useState("");

    // 성공/실패 모달 상태
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const orderStatusMap = {
        ORDERED: "주문 완료",
        PAID: "결제 완료",
        CANCELLED: "주문 취소",
    };

    const deliveryStatusMap = {
        PREPARING: "배송 준비 중",
        SHIPPED: "배송 중",
        DELIVERED: "배송 완료",
        CANCELLED: "배송 취소",
    };

    useEffect(() => {
        apiClient.get(`/api/admin/orders/${orderId}`)
            .then(res => {
                setOrder(res.data);
                setOrderStatus(res.data.status);           // 주문 상태 필드명 수정
                setDeliveryStatus(res.data.deliveryStatus);
            })
            .catch(() => setOrder(null));
    }, [orderId]);

    const updateOrderStatus = async () => {
        try {
            await apiClient.put(`/api/admin/orders/${orderId}/order-status`, { orderStatus });
            setSuccessMessage("주문 상태가 성공적으로 변경되었습니다.");
            setIsError(false);
            setSuccessModalOpen(true);
        } catch (e) {
            setSuccessMessage("주문 상태 변경에 실패했습니다.");
            setIsError(true);
            setSuccessModalOpen(true);
        }
    };

    const updateDeliveryStatus = async () => {
        const deliveryId = order.deliveryId;
        if (!deliveryId) return;
        try {
            await apiClient.put(`/api/deliveries/${deliveryId}/status/${deliveryStatus}`);
            setSuccessMessage("배송 상태가 성공적으로 변경되었습니다.");
            setIsError(false);
            setSuccessModalOpen(true);
        } catch (e) {
            setSuccessMessage("배송 상태 변경에 실패했습니다.");
            setIsError(true);
            setSuccessModalOpen(true);
        }
    };

    if (!order) {
        return (
            <AdminLayout>
                <div className="admin-page">
                    <div className="loading">주문 정보를 불러오는 중...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>주문 상세 정보</h1>
                <h2 style={{ fontSize: '16px', color: '#888', marginBottom: '24px' }}>주문번호: {order.orderId}</h2>

                <div className="top-bar">
                    <button className="back-button" onClick={() => navigate("/admin/orders")}>← 목록으로 돌아가기</button>
                </div>

                <div className="order-detail-wrapper">
                    <div className="order-detail-card">
                        <div className="order-info-section">
                            <h3>주문 정보</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>주문번호</label>
                                    <span>{order.orderId}</span>
                                </div>
                                <div className="info-item">
                                    <label>회원 ID</label>
                                    <span>{order.memberId}</span>
                                </div>
                                <div className="info-item">
                                    <label>총금액</label>
                                    <span>{order.totalPrice?.toLocaleString()}원</span>
                                </div>
                                <div className="info-item">
                                    <label>주문일자</label>
                                    <span>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('ko-KR') : '-'}</span>
                                </div>
                                <div className="info-item">
                                    <label>배송지</label>
                                    <span>{order.deliveryAddress || '-'}</span> {/* 수정된 부분 */}
                                </div>
                            </div>
                        </div>

                        <div className="status-section">
                            <h3>현재 상태</h3>
                            <div className="status-grid">
                                <div className="status-item">
                                    <label>주문 상태</label>
                                    <span className={`status-badge ${orderStatus?.toLowerCase() || ''}`}>
                                        {orderStatusMap[orderStatus] || orderStatus || '-'}
                                    </span>
                                </div>
                                <div className="status-item">
                                    <label>배송 상태</label>
                                    <span className={`status-badge ${deliveryStatus?.toLowerCase() || ''}`}>
                                        {deliveryStatusMap[deliveryStatus] || deliveryStatus || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="control-section">
                            <h3>상태 변경</h3>
                            <div className="order-detail-control">
                                <label>주문 상태 변경</label>
                                <select
                                    value={orderStatus || ""}
                                    onChange={(e) => setOrderStatus(e.target.value)}
                                >
                                    <option value="ORDERED">주문 완료</option>
                                    <option value="PAID">결제 완료</option>
                                    <option value="CANCELLED">주문 취소</option>
                                </select>
                                <button className="save-button" onClick={updateOrderStatus}>저장</button>
                            </div>

                            <div className="order-detail-control">
                                <label>배송 상태 변경</label>
                                <select
                                    value={deliveryStatus || ""}
                                    onChange={(e) => setDeliveryStatus(e.target.value)}
                                >
                                    <option value="PREPARING">배송 준비 중</option>
                                    <option value="SHIPPED">배송 중</option>
                                    <option value="DELIVERED">배송 완료</option>
                                    <option value="CANCELLED">배송 취소</option>
                                </select>
                                <button className="save-button" onClick={updateDeliveryStatus}>저장</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AdminSuccessModal
                open={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                message={successMessage}
                isError={isError}
            />
        </AdminLayout>
    );
}

export default AdminOrderDetailPage;

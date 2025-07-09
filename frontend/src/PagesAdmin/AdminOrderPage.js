import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/layout/AdminLayout";
import apiClient from "../api/axiosConfig";
import "../css/AdminOrderPage.css";

/*
    전체 흐름도
    1. 컴포넌트 마운트 시 주문 목록 조회
    2. 주문 데이터 출력 (상세보기 버튼 클릭 시 상세 페이지 이동)
    3. 주문 상태, 배송 상태를 한글로 변환해서 표시
*/

function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const navigate = useNavigate();

    // 주문 상태 한글 매핑
    const orderStatusMap = {
        ORDERED: "주문 완료",
        PAID: "결제 완료",
        CANCELLED: "주문 취소",
    };

    // 배송 상태 한글 매핑
    const deliveryStatusMap = {
        PREPARING: "배송 준비 중",
        SHIPPED: "배송 중",
        DELIVERED: "배송 완료",
        CANCELLED: "배송 취소",
    };

    // 주문 목록 조회
    const fetchOrders = async (pageParam = page) => {
        try {
            setIsLoading(true);
            const res = await apiClient.get("/api/admin/orders", {
                params: {
                    page: pageParam - 1, // 백엔드는 0부터 시작
                    size,
                },
            });
            
            // 응답 구조에 따라 데이터 설정
            if (res.data.content) {
                // Page 객체인 경우
                setOrders(res.data.content);
                setTotalPages(res.data.totalPages || 1);
                setTotalElements(res.data.totalElements || 0);
            } else if (Array.isArray(res.data)) {
                // 배열인 경우 (현재 상황)
                setOrders(res.data);
                setTotalPages(1);
                setTotalElements(res.data.length);
            } else {
                // 기타 경우
                setOrders([]);
                setTotalPages(1);
                setTotalElements(0);
            }
        } catch (error) {
            console.error("주문 목록 조회 실패", error);
            setOrders([]);
            setTotalPages(1);
            setTotalElements(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, size]);
  

    return (
        <AdminLayout>
            <div className="admin-order-page">
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>주문 관리</h1>
                <h2 style={{ fontSize: '16px', color: '#888', marginBottom: '24px' }}>
                    주문 내역의 상태를 확인하는 페이지 입니다
                </h2>
                {isLoading ? (
                    <div className="admin-order-loading">불러오는 중...</div>
                ) : orders.length === 0 ? (
                    <div className="admin-order-empty">주문이 없습니다.</div>
                ) : (
                    <>
                        <div className="pagination-bar">
                            <span>총 {totalElements}건 | </span>
                            <button onClick={() => setPage(page - 1)} disabled={page <= 1}>이전</button>
                            <span style={{ margin: "0 8px" }}>{page} / {totalPages}</span>
                            <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>다음</button>
                            <select
                                value={size}
                                onChange={(e) => setSize(Number(e.target.value))}
                            >
                                <option value={10}>10개씩</option>
                                <option value={20}>20개씩</option>
                                <option value={50}>50개씩</option>
                            </select>
                        </div>
                        <table className="admin-order-table">
                            <thead>
                                <tr>
                                    <th>주문번호</th>
                                    <th>회원</th>
                                    <th>주문 상태</th>
                                    <th>배송 상태</th>
                                    <th>총금액</th>
                                    <th>날짜</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.orderId}>
                                        <td>{order.orderId}</td>
                                        <td>{order.memberName}</td>
                                        <td>{orderStatusMap[order.orderStatus] || order.orderStatus}</td>
                                        <td>{deliveryStatusMap[order.deliveryStatus] || order.deliveryStatus}</td>
                                        <td>{order.totalPrice?.toLocaleString()}원</td>
                                        <td>{order.orderDate?.slice(0, 10)}</td>
                                        <td>
                                            <button 
                                                className="detail-button"
                                                onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                                            >
                                                상태 변경
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminOrderPage;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Alert, Form } from "react-bootstrap";
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaEdit, FaSignInAlt, FaSearch, FaSave, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, updateAddress } from "../api/addressApi";
import MyOrders from "./MyOrders";

const MyPage = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "info");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ zipCode: "", address: "", addressDetail: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        const result = await getCurrentUser();
        if (result.success) {
          setUserInfo(result.data);
        } else {
          setError(result.error || "사용자 정보를 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [user]);

  useEffect(() => {
    if (activeTab === "address" && showAddressForm && userInfo) {
      setAddressForm({
        address: userInfo.address || "",
        zipCode: userInfo.zipCode || "",
        addressDetail: userInfo.addressDetail || ""
      });
    }
  }, [activeTab, showAddressForm, userInfo]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        const fullAddress = data.address;
        const zipCode = data.zonecode;
        setAddressForm((prev) => ({
          ...prev,
          address: fullAddress,
          zipCode: zipCode,
        }));
      },
    }).open();
  };

  const handleSaveAddress = async () => {
    if (!userInfo?.id) {
      alert("사용자 정보가 없습니다.");
      return;
    }

    const result = await updateAddress(userInfo.id, {
      address: addressForm.address,
      zipCode: addressForm.zipCode,
      addressDetail: addressForm.addressDetail,
    });
    if (result.success) {
      alert("배송지 수정 완료");
      setShowAddressForm(false);
      const updatedUser = await getCurrentUser();
      if (updatedUser.success) {
        setUserInfo(updatedUser.data);
      }
    } else {
      alert("수정 실패: " + result.error);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={3}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-3">
                <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${userInfo ? "bg-primary" : "bg-light"}`} style={{ width: 80, height: 80 }}>
                  <FaUser className={userInfo ? "text-white" : "text-muted"} size={40} />
                </div>
                <h5 className="mt-2 mb-0">{userInfo ? userInfo.name : "마이페이지"}</h5>
                <small className="text-muted">{userInfo ? userInfo.email : "로그인하여 개인정보를 관리하세요"}</small>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                <button className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}> <FaUser className="me-2" /> 개인정보 </button>
                <button className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === "address" ? "active" : ""}`} onClick={() => setActiveTab("address")}> <FaMapMarkerAlt className="me-2" /> 배송지 관리 </button>
                <button className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}> <FaShoppingBag className="me-2" /> 주문내역 </button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          {activeTab === "address" && (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">배송지 관리</h5>
                <Button variant="outline-primary" size="sm" onClick={() => setShowAddressForm(!showAddressForm)}>
                  <FaEdit className="me-1" /> {showAddressForm ? "닫기" : "수정"}
                </Button>
              </Card.Header>
              <Card.Body>
                {showAddressForm ? (
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>우편번호</Form.Label>
                      <div className="d-flex">
                        <Form.Control type="text" name="zipCode" value={addressForm.zipCode} readOnly className="me-2" />
                        <Button variant="outline-secondary" onClick={handleOpenPostcode}> <FaSearch className="me-1" /> 검색 </Button>
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>주소</Form.Label>
                      <Form.Control type="text" name="address" value={addressForm.address} readOnly />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>상세주소</Form.Label>
                      <Form.Control type="text" name="addressDetail" value={addressForm.addressDetail} onChange={handleAddressChange} placeholder="상세주소를 입력하세요" />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                      <Button variant="outline-secondary" className="me-2" onClick={() => setShowAddressForm(false)}> <FaTimes className="me-1" /> 취소 </Button>
                      <Button variant="primary" onClick={handleSaveAddress}> <FaSave className="me-1" /> 저장 </Button>
                    </div>
                  </Form>
                ) : (
                  <div>
                    <p><strong>우편번호:</strong> {userInfo?.zipCode || "미등록"}</p>
                    <p><strong>주소:</strong> {userInfo?.address || "미등록"}</p>
                    <p><strong>상세주소:</strong> {userInfo?.addressDetail || "미등록"}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {activeTab === "info" && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">개인정보</h5>
              </Card.Header>
              <Card.Body>
                {userInfo ? (
                  <Row>
                    <Col md={6}>
                      <p><strong>이름:</strong> {userInfo.name}</p>
                      <p><strong>이메일:</strong> {userInfo.email}</p>
                      <p><strong>전화번호:</strong> {userInfo.phone || "미등록"}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>가입일:</strong> {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString("ko-KR") : "미등록"}</p>
                    </Col>
                  </Row>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-3">로그인하여 개인정보를 확인하고 관리하세요.</p>
                    <Button variant="primary" onClick={() => navigate("/login", { state: { from: "/mypage" } })}> <FaSignInAlt className="me-2" /> 로그인하기 </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {activeTab === "orders" && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">주문내역</h5>
              </Card.Header>
              <Card.Body>
                {userInfo ? <MyOrders /> : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-3">로그인하여 주문내역을 확인하세요.</p>
                    <Button variant="primary" onClick={() => navigate("/login", { state: { from: "/mypage" } })}> <FaSignInAlt className="me-2" /> 로그인하기 </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyPage;

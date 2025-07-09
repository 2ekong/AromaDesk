import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Alert, Form } from "react-bootstrap";
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaSave, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { authManager } from "../api/authApi";
import { toast } from "react-toastify";

const MyPageEdit = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "info");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const result = await authManager.getUserInfo();
        if (result.success) {
          setUserInfo(result.data);
          setFormData({
            name: result.data.name || "",
            phone: result.data.phone || "",
            address: result.data.address || ""
          });
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
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // API 호출하여 사용자 정보 업데이트
      const result = await authManager.updateUserInfo(formData);
      
      if (result.success) {
        toast.success("수정 완료!", {
          position: "top-center",
          autoClose: 2000
        });
        
        // 잠시 후 마이페이지로 돌아가기
        setTimeout(() => {
          navigate('/mypage', { state: { activeTab } });
        }, 1500);
      } else {
        setError(result.error || "수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("사용자 정보 수정 실패:", error);
      setError("수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/mypage', { state: { activeTab } });
  };

  // 로딩 상태
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

  // 에러 상태
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
          {/* 사이드바 */}
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-3">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center bg-primary"
                  style={{ width: 80, height: 80 }}
                >
                  <FaUser className="text-white" size={40} />
                </div>
                <h5 className="mt-2 mb-0">
                  {userInfo ? userInfo.name : "마이페이지"}
                </h5>
                <small className="text-muted">
                  {userInfo ? userInfo.email : "로그인하여 개인정보를 관리하세요"}
                </small>
              </div>
            </Card.Body>
          </Card>
          {/* 네비게이션 메뉴 */}
          <Card>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    activeTab === "info" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("info")}
                >
                  <FaUser className="me-2" />
                  개인정보
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    activeTab === "address" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("address")}
                >
                  <FaMapMarkerAlt className="me-2" />
                  배송지 관리
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    activeTab === "orders" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <FaShoppingBag className="me-2" />
                  주문내역
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={9}>
          {/* 메인 콘텐츠 */}
          {activeTab === "info" && (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">개인정보 수정</h5>
                <div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleCancel}
                    className="me-2"
                  >
                    <FaArrowLeft className="me-1" />
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <FaSave className="me-1" />
                    {saving ? "저장 중..." : "저장"}
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><strong>이름</strong></Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="이름을 입력하세요"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label><strong>이메일</strong></Form.Label>
                        <Form.Control
                          type="email"
                          value={userInfo?.email || ""}
                          disabled
                          className="bg-light"
                        />
                        <Form.Text className="text-muted">
                          이메일은 변경할 수 없습니다.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label><strong>전화번호</strong></Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="전화번호를 입력하세요"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><strong>가입일</strong></Form.Label>
                        <Form.Control
                          type="text"
                          value={userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('ko-KR') : "미등록"}
                          disabled
                          className="bg-light"
                        />
                        <Form.Text className="text-muted">
                          가입일은 변경할 수 없습니다.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          )}
          {activeTab === "address" && (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">배송지 관리</h5>
                <div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleCancel}
                    className="me-2"
                  >
                    <FaArrowLeft className="me-1" />
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <FaSave className="me-1" />
                    {saving ? "저장 중..." : "저장"}
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>주소</strong></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="배송지를 입력하세요"
                    />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          )}
          {activeTab === "orders" && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">주문내역</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-4">
                  <p className="text-muted mb-3">주문내역은 조회만 가능합니다.</p>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/mypage', { state: { activeTab: 'orders' } })}
                  >
                    <FaArrowLeft className="me-2" />
                    주문내역 보기
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyPageEdit; 
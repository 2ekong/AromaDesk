import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Button, Alert, Form } from "react-bootstrap";
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaSave, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { authManager } from "../api/authApi";
import { toast } from "react-toastify";
import { logout } from "../app/slices/userSlice";

const MyPagePassUpdate = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "info");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentPasswordVerified, setCurrentPasswordVerified] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // 비밀번호 폼 데이터 상태
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
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

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleVerifyCurrentPassword = async () => {
    if (!passwordFormData.currentPassword) {
      toast.error("현재 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 현재 비밀번호 확인 API 호출
      const result = await authManager.verifyCurrentPassword(passwordFormData.currentPassword);
      
      if (result.success) {
        setCurrentPasswordVerified(true);
        toast.success("현재 비밀번호가 확인되었습니다.");
      } else {
        setError(result.error || "현재 비밀번호가 일치하지 않습니다.");
        setCurrentPasswordVerified(false);
      }
    } catch (error) {
      console.error("현재 비밀번호 확인 실패:", error);
      setError("현재 비밀번호 확인에 실패했습니다.");
      setCurrentPasswordVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPasswordVerified) {
      toast.error("먼저 현재 비밀번호를 확인해주세요.");
      return;
    }

    if (!passwordFormData.newPassword || !passwordFormData.confirmPassword) {
      toast.error("새 비밀번호와 확인 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // 비밀번호 변경 API 호출
      const result = await authManager.changePassword(passwordFormData);
      
      if (result.success) {
        toast.success("비밀번호가 성공적으로 변경되었습니다! 보안을 위해 로그아웃됩니다.", {
          position: "top-center",
          autoClose: 3000
        });
        
        // 캐시 무효화
        authManager.invalidateCache();
        
        // 잠시 후 로그아웃 처리
        setTimeout(() => {
          dispatch(logout());
          localStorage.removeItem("CusUser");
          navigate('/login', { 
            state: { 
              message: "비밀번호가 변경되어 로그아웃되었습니다. 새 비밀번호로 다시 로그인해주세요." 
            } 
          });
        }, 2000);
      } else {
        setError(result.error || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      setError("비밀번호 변경에 실패했습니다.");
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
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">비밀번호 수정</h5>
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
                  onClick={handlePasswordChange}
                  disabled={saving || !currentPasswordVerified || !passwordFormData.newPassword || !passwordFormData.confirmPassword || passwordFormData.newPassword !== passwordFormData.confirmPassword}
                >
                  <FaSave className="me-1" />
                  {saving ? "저장 중..." : "저장"}
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>현재 비밀번호</strong></Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordFormData.currentPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="현재 비밀번호를 입력하세요"
                        className="me-2"
                        autoComplete="current-password"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleVerifyCurrentPassword();
                          }
                        }}
                      />
                        <Button
                          variant="outline-secondary"
                          onClick={() => togglePasswordVisibility('current')}
                          type="button"
                        >
                          {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                        <Button
                          variant="outline-primary"
                          onClick={handleVerifyCurrentPassword}
                          className="ms-2"
                          disabled={!passwordFormData.currentPassword}
                          type="button"
                        >
                          확인
                        </Button>
                      </div>
                      {currentPasswordVerified && (
                        <Form.Text className="text-success">
                          ✓ 현재 비밀번호가 확인되었습니다.
                        </Form.Text>
                      )}
                    </Form.Group>

                    {currentPasswordVerified && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label><strong>변경할 비밀번호</strong></Form.Label>
                          <div className="d-flex">
                            <Form.Control
                              type={showPasswords.new ? "text" : "password"}
                              name="newPassword"
                              value={passwordFormData.newPassword}
                              onChange={handlePasswordInputChange}
                              placeholder="새 비밀번호를 입력하세요"
                              className="me-2"
                              autoComplete="new-password"
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => togglePasswordVisibility('new')}
                              type="button"
                            >
                              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                          </div>
                          <Form.Text className="text-muted">
                            비밀번호는 최소 6자 이상이어야 합니다.
                          </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label><strong>변경 비밀번호 확인</strong></Form.Label>
                          <div className="d-flex">
                            <Form.Control
                              type={showPasswords.confirm ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordFormData.confirmPassword}
                              onChange={handlePasswordInputChange}
                              placeholder="새 비밀번호를 다시 입력하세요"
                              className="me-2"
                              autoComplete="new-password"
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => togglePasswordVisibility('confirm')}
                              type="button"
                            >
                              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                          </div>
                          {passwordFormData.newPassword && passwordFormData.confirmPassword && (
                            <Form.Text className={passwordFormData.newPassword === passwordFormData.confirmPassword ? "text-success" : "text-danger"}>
                              {passwordFormData.newPassword === passwordFormData.confirmPassword ? "✓ 비밀번호가 일치합니다." : "✗ 비밀번호가 일치하지 않습니다."}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </>
                    )}
                  </Col>
                </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyPagePassUpdate; 
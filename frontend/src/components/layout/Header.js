import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart, FaUser, FaBars } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import { logout } from "../../app/slices/userSlice";
import apiClient from "../../api/axiosConfig";
import SearchBox from "../common/SearchBox";

const Header = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalQuantity } = useSelector((state) => state.cart);
  const { isLoggedIn, user } = useSelector((state) => state.user);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  const handleLogout = async () => {
    try {
      // 백엔드에 로그아웃 요청
      await apiClient.post("/api/members/logout");
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
      // API 호출이 실패해도 클라이언트 측 로그아웃은 진행
    }

    // Redux 스토어에서 로그아웃 상태로 변경
    dispatch(logout());

    // localStorage에서 사용자 정보 삭제
    localStorage.removeItem("CusUser");

    // 메인 페이지로 이동
    navigate("/");
  };

  return (
    <header
      style={{
        width: "100%",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* 모바일 사이드바 토글 버튼 */}
      <button
        className="btn btn-link d-lg-none me-2"
        onClick={toggleSidebar}
        style={{ padding: 0, fontSize: 20 }}
      >
        <FaBars />
      </button>

      {/* 로고 */}
      <span
        style={{
          fontWeight: 800,
          fontSize: 24,
          color: "#2563eb",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          height: 64,
          paddingLeft: 0,
          paddingRight: 0,
        }}
        onClick={() => navigate("/main")}
      >
        AromaDesk
      </span>

      {/* 검색 박스 */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <SearchBox onSearch={handleSearch} />
      </div>

      {/* 우측 메뉴 */}
      <div className="d-flex align-items-center gap-2">
        {/* 장바구니 */}
        <button
          onClick={handleCartClick}
          className="btn btn-outline-primary position-relative"
          style={{ height: 44, minWidth: 44 }}
        >
          <FaShoppingCart />
          {isLoggedIn && totalQuantity > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalQuantity}
            </span>
          )}
        </button>

        {/* 로그인/마이페이지 드롭다운 */}
        {isLoggedIn ? (
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              style={{ height: 44, minWidth: 44 }}
            >
              <FaUser />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/mypage">
                마이페이지
              </Dropdown.Item>
              {/* <Dropdown.Item as={Link} to="/delivery">
                배송조회
              </Dropdown.Item> */}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Link
            to="/login"
            className="btn btn-primary"
            style={{ height: 44, minWidth: 80 }}
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

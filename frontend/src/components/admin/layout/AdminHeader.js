import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminLoginAPI } from "../../../api/adminLoginApi";
import { logout } from "../../../app/slices/adminSlice";

const AdminHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux 상태에서 관리자 정보 가져오기
  const { admin, isAuthenticated } = useSelector((state) => state.admin);

  // 인증되지 않은 경우 로그인 페이지로 이동
  if (!isAuthenticated || !admin) {
    navigate("/adminLogin");
    return null;
  }

  const handleLogout = async () => {
    try {
      await adminLoginAPI.logout();
    } catch (error) {
      console.error('관리자 로그아웃 에러:', error);
    }
    
    // Redux 상태에서도 로그아웃 처리
    dispatch(logout());
    navigate("/adminLogin");
  };

  const { id, username, name } = admin;

  return (
    <header style={{
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
      zIndex: 100
    }}>
      <span
        style={{
          fontWeight: 800,
          fontSize: 24,
          color: "#2563eb",
          cursor: "pointer"
        }}
        onClick={() => navigate("/admin/dashboard")}
      >
        AromaDesk Admin
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ textAlign: "right", marginRight: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{name || username || "관리자"}</div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{username}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "#eee",
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: "6px 16px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

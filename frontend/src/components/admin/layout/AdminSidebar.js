import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "대시보드", path: "/admin/dashboard" },
  { label: "상품관리", path: "/admin/products" },
  { label: "주문관리", path: "/admin/orders" },
  { label: "회원관리", path: "/admin/members" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <aside style={{ width: 200, background: "#f8fafc", borderRight: "1px solid #e5e7eb", minHeight: "100vh", padding: "32px 0" }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {navItems.map(item => (
          <span
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              cursor: "pointer",
              fontWeight: location.pathname === item.path ? 700 : 500,
              color: location.pathname === item.path ? "#2563eb" : "#222",
              background: location.pathname === item.path ? "#e0e7ff" : "transparent",
              borderRadius: 6,
              padding: "10px 24px"
            }}
          >
            {item.label}
          </span>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar; 
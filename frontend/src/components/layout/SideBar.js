import React from "react";
import { Link, useLocation } from "react-router-dom";

// DB와 맞는 브랜드 목록 (전체)
const BRAND_LIST = [
  { code: "CHANEL", label: "샤넬" },
  { code: "DIOR", label: "디올" },
  { code: "GUCCI", label: "구찌" },
  { code: "YSL", label: "입생로랑" },
  { code: "HERMES", label: "에르메스" },
  { code: "DIPTYQUE", label: "딥티크" },
  { code: "TOMFORD", label: "톰포드" },
  { code: "MAISON MARGIELA", label: "메종마르지엘라" },
  { code: "ACQUA DI PARMA", label: "아쿠아 디 파르마" },
  { code: "BYREDO", label: "바이레도" },
  { code: "CLEAN", label: "클린" },
  { code: "ELIZABETH ARDEN", label: "엘리자베스아덴" },
  { code: "LANVIN", label: "랑방" },
  { code: "CALVIN KLEIN", label: "캘빈클라인" },
  { code: "JO MALONE", label: "조말론" },
  { code: "BURBERRY", label: "버버리" },
  { code: "VERSACE", label: "베르사체" },
  { code: "ARMANI", label: "아르마니" },
  { code: "BOTTEGA VENETA", label: "보테가 베네타" },
  { code: "BALENCIAGA", label: "발렌시아가" },
];

const SideBar = ({ sidebarOpen = true, setSidebarOpen }) => {
  const location = useLocation();

  // 카테고리 메뉴 + 브랜드향수 메뉴 추가
  const menu = [
    { label: "홈", to: "/main" },
      { label: "남성", to: "/category/male" },
  { label: "여성", to: "/category/female" },
  { label: "남녀공용", to: "/category/unisex" },
    { label: "브랜드향수", to: "/brand" }, // 브랜드별 대신 브랜드향수로
  ];

  return (
    <nav
      className={`sidebar bg-white border-end px-2 py-4 d-flex flex-column align-items-stretch${
        sidebarOpen ? "" : " d-none d-md-flex"
      }`}
      style={{ width: 220, minWidth: 180, transition: "all 0.2s" }}
    >
      <ul className="nav flex-column w-100">
        {menu.map((item) => (
          <li className="nav-item mb-1" key={item.to}>
            <Link
              to={item.to}
              className={`nav-link fw-semibold rounded ${
                location.pathname === item.to
                  ? "bg-dark text-white"
                  : "text-dark"
              }`}
              style={{ padding: "10px 16px", fontSize: 16 }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideBar;

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-light text-center text-muted py-4 mt-5 border-top">
      <div className="container">
        <div className="mb-2">
          AromaDesk &copy; {new Date().getFullYear()} |{" "}
          <a href="/" className="text-decoration-none text-primary">
            홈
          </a>{" "}
          |{" "}
          <a href="/products" className="text-decoration-none text-primary">
            상품
          </a>{" "}
          |{" "}
          <a href="/cart" className="text-decoration-none text-primary">
            장바구니
          </a>
        </div>
        <div style={{ fontSize: "13px" }}>
          본 사이트는 포트폴리오/학습용 데모입니다.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

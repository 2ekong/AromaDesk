import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/IntroPage.css";

function IntroPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const navigate = useNavigate();

  const texts = [
    "당신만의 특별한 향기를",
    "세계 각국의 프리미엄 향수",
    "개성 있는 향기로 매력을",
  ];

  // 향수 상품 이미지 URL 배열
  const perfumeImages = [
    "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA1MDlfMTEg%2FMDAxNzQ2Nzk3MDA5MTc2.Ov_-VUVp5X-3YLmJPXuVYiE5cMCXrbt0-9xNkXps-w8g.on6DeWZ-u8nO4XZWNtPGqZ7tYtPGF7WvOshtPBUNAsIg.JPEG%2F%25B9%25D9%25B4%25D2%25B6%25F3_%25C7%25E2%25BC%25F6%25B4%25C2_%25B3%25CA%25B9%25AB_%25B4%25DE%25B4%25DE%25C7%25D8_%25B2%25DC%25C3%25B3%25B7%25B3_%25B2%25F8%25B8%25AE%25B4%25C2_%25B1%25B8%25B8%25A3%25B8%25C1_%25C7%25E2%25BC%25F6_%25BC%25D2%25B0%25B3_%25C3%25DF%25C3%25B515.jpg&type=sc960_832",
    "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAxMjdfMTIz%2FMDAxNzM3OTc3NjgxMjE3.6Jz-MK2_hEJmIVp0RmbyuzmxQgCkYWeGLWSbPDtxSDkg.wbvhK6AisbnnCuobBcVS6KmFZp6hO0oks4cTSl7uB_Qg.JPEG%2Fn51uUR37Ck6LvPnipWEJ7.jpg&type=sc960_832",
    "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAyMTRfNjcg%2FMDAxNzM5NTIzNTE4OTkw.PQG6cLGn44d4iKBC-jU62TOPZbNbX-ZnTKbd6OWG018g.emKSx48U-pAUIHrjC7szNHMnePDEQZaQsQUO4zg9vpMg.JPEG%2F59F8A4EC-2E4F-452E-9B5A-7DBBEC4782E8.jpg&type=sc960_832",
    "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDExMTJfOTkg%2FMDAxNzMxNDEyOTIzNzE2.Z9ufUcevziHr9kXDiEN3Cc6SHkNo7418Fu3d5KTVb5Ug.doVQ38OqdAQKf2NuZWchZAU8uZVEgnx7LJr376ZQ2wIg.JPEG%2F%25B0%25DC%25BF%25EF%25C7%25E2%25BC%25F6%25C3%25DF%25C3%25B5_%25282%2529.JPG&type=sc960_832",
    "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAzMjRfMTEy%2FMDAxNzQyNzQ4NzY3OTE5.EfP9HFsJG_4RbUqQ0BofqCXAdjy2o49JEqT_aENhNOsg.aCT4HR7Ywt1-nOHWP6JaFvGT22AI6YFFwMDn15BKqFsg.JPEG%2Fholy27991_%25285%2529.jpg&type=sc960_832",
  ];

  useEffect(() => {
    // 0.5초 후에 메뉴 표시
    const timer = setTimeout(() => {
      setShowMenu(true);
    }, 500);

    // 텍스트 타이핑 효과
    const textTimer = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(textTimer);
    };
  }, [texts.length]);

  const handleShopping = () => {
    navigate("/main");
  };

  const handleAdmin = () => {
    navigate("/admin");
  };

  return (
    <div className="intro-page-minimal">
      {/* 향수 상품 바운스 이미지 라인 (외부 이미지) */}
      <div className="perfume-bounce-row">
        {perfumeImages.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`perfume${i + 1}`}
            className="perfume-bounce-img"
            style={{ "--delay": `${i * 0.25}s` }}
          />
        ))}
      </div>
      {/* 물방울 효과 */}
      <div className="water-drops">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="water-drop"
            style={{
              "--delay": `${i * 0.3}s`,
              "--left": `${Math.random() * 100}%`,
              "--size": `${10 + Math.random() * 20}px`,
              "--duration": `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* 빛나는 파티클 */}
      <div className="sparkle-particles">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              "--delay": `${i * 0.2}s`,
              "--left": `${Math.random() * 100}%`,
              "--top": `${Math.random() * 100}%`,
              "--duration": `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 미니멀 배경 */}
      <div className="minimal-background">
        <div className="floating-shapes">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="shape"
              style={{
                "--delay": `${i * 0.5}s`,
                "--size": `${20 + Math.random() * 40}px`,
                "--left": `${Math.random() * 100}%`,
                "--animation-duration": `${8 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 물결 효과 */}
      <div className="wave-container">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      <div className="minimal-content">
        <div className="logo-container">
          <div className="logo-circle">
            <span className="logo-text">A</span>
          </div>
        </div>

        <h1 className="minimal-title">AromaDesk</h1>

        <div className="typing-text">
          <span className="typing-cursor">|</span>
          {texts[currentText]}
        </div>
      </div>

      {/* 미니멀 메뉴 */}
      <div className={`minimal-menu ${showMenu ? "show" : ""}`}>
        <div className="menu-line"></div>
        <div className="menu-buttons-minimal">
          <button
            className="minimal-button shopping-btn"
            onClick={handleShopping}
          >
            <span className="btn-text">SHOPPING</span>
            <span className="btn-line"></span>
          </button>
          <button className="minimal-button admin-btn" onClick={handleAdmin}>
            <span className="btn-text">ADMIN</span>
            <span className="btn-line"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default IntroPage;

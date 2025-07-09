import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLogin } from '../login/useLogin.js';
import '../css/loginCus.css';

const LoginPage = () => {
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, isLoading, error } = useLogin();
  const navigate = useNavigate();
  
  // Redux에서 사용자 상태 가져오기
  const { user: reduxUser, isLoggedIn } = useSelector((state) => state.user);

  // 로그인 성공 후 로딩이 완료되고 Redux 상태도 업데이트되면 페이지 이동
  useEffect(() => {
    if (loginSuccess && !isLoading && reduxUser && isLoggedIn) {
      console.log('모든 로그인 정보 로드 완료, 메인 페이지로 이동');
      console.log('사용자 정보:', reduxUser);
      
      // 약간의 지연을 두어 모든 상태 업데이트가 완료되도록 함
      setTimeout(() => {
        navigate('/main');
        setLoginSuccess(false); // 상태 초기화
      }, 100);
    }
  }, [loginSuccess, isLoading, reduxUser, isLoggedIn, navigate]);

  const handleLogin = async () => {
    if (!memberId.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const result = await login(memberId.trim(), password.trim());
      if (result.success) {
        console.log('로그인 성공:', result.data);
        // 로그인 성공 상태 설정 (페이지 이동은 useEffect에서 처리)
        setLoginSuccess(true);
      } else {
        console.log("로그인 실패:", result.error);
        alert("로그인 실패: " + result.error);
      }
    } catch (error) {
      console.error("로그인 처리 중 오류:", error);
      alert("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">로그인</h2>

        <input
          className="login-input"
          type="text"
          placeholder="아이디"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        <input
          className="login-input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>

        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginTop: "10px" }}
          >
            {error}
          </div>
        )}

        {/* 소셜 로그인 버튼들 */}
        <a
          className="google-btn"
          href="http://localhost/oauth2/authorization/google"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          구글로 로그인
        </a>
        <a
          className="kakao-btn"
          href="http://localhost/oauth2/authorization/kakao"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          카카오로 로그인
        </a>
        <a
          className="naver-btn"
          href="http://localhost/oauth2/authorization/naver"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          네이버로 로그인
        </a>
        
        <a href="/signup" className="signup-link">회원가입</a>
      </div>
    </div>
  );
};

export default LoginPage;

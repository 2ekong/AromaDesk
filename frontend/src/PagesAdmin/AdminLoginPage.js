import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminLoginAPI } from '../api/adminLoginApi';
import { loginStart, loginSuccess, loginFailure } from '../app/slices/adminSlice';
import '../css/loginCus.css';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    // 로그인 시작 상태 설정
    dispatch(loginStart());
    setError('');

    try {
      const result = await adminLoginAPI.login(username.trim(), password.trim());
      
      if (result.success) {
        console.log('관리자 로그인 성공:', result.data);
        
        // 관리자 정보 저장 (localStorage 백업용)
        if (result.data.admin) {
          localStorage.setItem('AdminUser', JSON.stringify(result.data.admin));
        }
        
        // 세션키는 adminLoginAPI에서 자동으로 저장됨
        console.log('관리자 로그인 완료');
        
        // Redux 상태 업데이트 (페이지 이동 전에 먼저 실행)
        dispatch(loginSuccess({
          admin: result.data.admin,
          sessionId: result.data.AdminUser
        }));
        
        // Redux 상태 업데이트 후 페이지 이동
        navigate('/admin');
      } else {
        console.log('관리자 로그인 실패:', result.error);
        setError(result.error);
        dispatch(loginFailure(result.error));
        alert('로그인 실패: ' + result.error);
      }
    } catch (error) {
      console.error('관리자 로그인 처리 중 오류:', error);
      const errorMessage = '로그인 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
      alert(errorMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">관리자 로그인</h2>
        
        <input
          className="login-input"
          type="text"
          placeholder="관리자 아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        <input
          className="login-input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        <button 
          className="login-btn" 
          onClick={handleLogin}
        >
          관리자 로그인
        </button>

        {error && (
          <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;

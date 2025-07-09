import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSignUp } from '../api/useSignUp';
import '../css/loginCus.css';
import { useEffect} from 'react';
import axios from 'axios';

const SignupPage = () => {

  const location = useLocation();

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const fromSocial = params.get("fromSocial") === "true";

  if(!fromSocial) return;

  axios.get('/auth/social-info', { withCredentials: true })
    .then(res => {
      if (res.data.email) {
        setFormData(prev => ({
          ...prev,
          email: res.data.email,
          name: res.data.name
        }));
      }
    })
    .catch(err => {
      console.error('세션 정보 불러오기 실패:', err);
    });
}, []);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        setFormData(prev => ({
          ...prev,
          address: data.address
        }));
      }
    }).open();
  };

  const [formData, setFormData] = useState({
    memberId: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    addressDetail: ''
  });
  const [validationStatus, setValidationStatus] = useState({
    memberId: { checked: false, available: false }
  });
  const { signUp, checkMemberId, isLoading } = useSignUp();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 아이디나 이메일이 변경되면 중복 확인 상태 초기화
    if (name === 'memberId') {
      setValidationStatus(prev => ({
        ...prev,
        memberId: { checked: false, available: false }
      }));
    }
  };

  const handleCheckMemberId = async () => {
    if (!formData.memberId.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }

    const result = await checkMemberId(formData.memberId);
    if (result.success) {
      setValidationStatus(prev => ({
        ...prev,
        memberId: { checked: true, available: result.isAvailable }
      }));
      
      if (result.isAvailable) {
        alert('사용 가능한 아이디입니다.');
      } else {
        alert('이미 사용 중인 아이디입니다.');
      }
    } else {
      alert('아이디 확인 중 오류가 발생했습니다.');
    }
  };

  const validateForm = () => {
    // 필수 필드 검증
    if (!formData.memberId.trim()) {
      alert('아이디를 입력해주세요.');
      return false;
    }
    if (!formData.email.trim()) {
      alert('이메일을 입력해주세요.');
      return false;
    }
    if (!formData.password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (!formData.name.trim()) {
      alert('이름을 입력해주세요.');
      return false;
    }
    if (!formData.phone.trim()) {
      alert('전화번호를 입력해주세요.');
      return false;
    }
    if (!formData.address.trim()) {
      alert('주소를 입력해주세요.');
      return false;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    // 비밀번호 길이 검증
    if (formData.password.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }

    // 중복 확인 검증
    if (!validationStatus.memberId.checked || !validationStatus.memberId.available) {
      alert('아이디 중복 확인을 해주세요.');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    // 백엔드로 전송할 데이터 준비
    const signUpData = {
      memberId: formData.memberId.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: (formData.address + ' ' + formData.addressDetail).trim(),
      role: 'USER' // 백엔드에서 고정값으로 설정
    };

    console.log('백엔드로 전송할 회원가입 데이터:', signUpData);

    try {
      const result = await signUp(signUpData);
      
      if (result.success) {
        console.log('회원가입 성공:', result.data);
        alert('회원가입이 완료되었습니다!');
        navigate('/login'); // 로그인 페이지로 이동
      } else {
        console.log('회원가입 실패:', result.error);
        alert('회원가입 실패: ' + result.error);
      }
    } catch (error) {
      console.error('회원가입 처리 중 오류:', error);
      alert('회원가입 처리 중 오류가 발생했습니다.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignUp();
    }
  };

  return (
    <div className="login-page">
      {/* AromaDesk 로고 */}
      <div className="logo-container" onClick={handleLogoClick}>
        <h1 className="logo-text">AromaDesk</h1>
      </div>

      <div className="login-container">
        <h2 className="login-title">회원가입</h2>
        
        <div style={{ width: '100%', marginBottom: '12px', display: 'flex', gap: '10px' }}>
          <input
            className="login-input"
            type="text"
            name="memberId"
            placeholder="아이디"
            value={formData.memberId}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            style={{ flex: 1, marginBottom: '0' }}
          />
          <button
            onClick={handleCheckMemberId}
            disabled={isLoading}
            style={{
              width: '70px',
              padding: '10px 5px',
              backgroundColor: '#0076ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              flexShrink: 0
            }}
          >
            중복확인
          </button>
        </div>
        
        <input
          className="login-input"
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading || !!formData.email}
        />
        
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        
        <input
          className="login-input"
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        
        <input
          className="login-input"
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading || !!formData.name}
        />
        
        <input
          className="login-input"
          type="text"
          name="phone"
          placeholder="전화번호"
          value={formData.phone}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        <div style={{ width: '100%', marginBottom: '12px', display: 'flex', gap: '10px' }}>
          <input
            className="login-input"
            type="text"
            name="address"
            placeholder="주소"
            value={formData.address}
            readOnly
            style={{ flex: 1, marginBottom: '0' }}
          />
          <button
            type="button"
            onClick={handleAddressSearch}
            disabled={isLoading}
            style={{
              width: '80px',
              padding: '10px 5px',
              backgroundColor: '#FFE812',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              flexShrink: 0
            }}
          >
            주소 검색
          </button>
        </div>

        <input
          className="login-input"
          type="text"
          name="addressDetail"
          placeholder="상세주소 (예: 101호)"
          value={formData.addressDetail}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        
        <button 
          className="login-btn" 
          onClick={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? '회원가입 중...' : '회원가입'}
        </button>
        
        <a href="/login" className="signup-link">이미 계정이 있으신가요? 로그인</a>
      </div>
    </div>
  );
};

export default SignupPage; 
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loginAPI } from '../api/loginApi.js';
import { login as loginAction, logout as logoutAction } from '../app/slices/userSlice.js';
import { authManager } from '../api/authApi.js';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  // 로그인 함수
  const login = useCallback(async (memberId, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await loginAPI.login(memberId, password);
      
      if (result.success) {
        // 백엔드에서 최소한의 사용자 정보를 받음
        const loginResponse = result.data;
        console.log('로그인 성공, 기본 정보:', loginResponse);
        
        // 세션에서 완전한 사용자 정보 조회
        const userInfoResult = await loginAPI.getUserInfo();
        
        if (userInfoResult.success) {
          const userData = userInfoResult.data;
          console.log('사용자 정보 조회 성공:', userData);
          
          setUser(userData);
          
          // Redux 스토어에 로그인 상태 저장
          dispatch(loginAction(userData));
          
          // localStorage에 사용자 정보 저장
          localStorage.setItem('CusUser', JSON.stringify(userData));
          
          // authManager 캐시 업데이트
          authManager._cachedUser = userData;
          authManager._cacheTimestamp = Date.now();
          
          console.log('로그인 완료:', userData);
          return { success: true, data: userData };
        } else {
          console.log('사용자 정보 조회 실패:', userInfoResult.error);
          setError('로그인은 성공했지만 사용자 정보 조회에 실패했습니다.');
          return { success: false, error: '사용자 정보 조회 실패' };
        }
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // 로그아웃 함수
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 백엔드에 로그아웃 요청
      await loginAPI.logout();
      
      setUser(null);
      // Redux 스토어에서 로그아웃 상태 저장
      dispatch(logoutAction());
      
      // localStorage에서 사용자 정보 삭제
      localStorage.removeItem('CusUser');
      
      console.log('로그아웃 성공');
      return { success: true };
    } catch (err) {
      const errorMessage = '로그아웃 중 오류가 발생했습니다.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // 사용자 정보 조회 (세션에서 확인)
  const getUserInfo = useCallback(async () => {
    try {
      const result = await loginAPI.getUserInfo();
      
      if (result.success) {
        setUser(result.data);
        // Redux 스토어에 사용자 정보 저장
        dispatch(loginAction(result.data));
        
        // localStorage에 사용자 정보 저장
        localStorage.setItem('CusUser', JSON.stringify(result.data));
        
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = '사용자 정보 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    getUserInfo,
    clearError
  };
}; 
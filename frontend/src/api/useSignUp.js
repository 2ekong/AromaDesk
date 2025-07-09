import { useState } from 'react';
import { signUpAPI, checkMemberIdAPI } from './signupApi.js';

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const signUp = async (signUpData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signUpAPI(signUpData);
      
      if (result.success) {
        return {
          success: true,
          data: result.data
        };
      } else {
        setError(result.error);
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      const errorMessage = '회원가입 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkMemberId = async (memberId) => {
    try {
      const result = await checkMemberIdAPI(memberId);
      
      if (result.success) {
        return {
          success: true,
          isAvailable: result.isAvailable
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      return {
        success: false,
        error: '아이디 확인 중 오류가 발생했습니다.'
      };
    }
  };

  return {
    signUp,
    checkMemberId,
    isLoading,
    error
  };
}; 
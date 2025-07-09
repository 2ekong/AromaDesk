import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  sessionId: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // 관리자 로그인 성공
    loginSuccess: (state, action) => {
      state.admin = action.payload.admin;
      state.sessionId = action.payload.sessionId;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    
    // 관리자 로그인 실패
    loginFailure: (state, action) => {
      state.admin = null;
      state.sessionId = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // 관리자 로그인 시작
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // 관리자 로그아웃
    logout: (state) => {
      state.admin = null;
      state.sessionId = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    
    // 초기 상태 복원 (localStorage에서)
    restoreAuth: (state, action) => {
      state.admin = action.payload.admin;
      state.sessionId = action.payload.sessionId;
      state.isAuthenticated = !!(action.payload.admin && action.payload.sessionId);
      state.isLoading = false;
      state.error = null;
    }
  }
});

export const { 
  loginSuccess, 
  loginFailure, 
  loginStart, 
  logout, 
  restoreAuth 
} = adminSlice.actions;

export default adminSlice.reducer; 
/**
 * 25.06.28 SUSU  세션 기반 재 수정
 */
//axios.js
import axios from "axios";
import qs from "qs";
import store from "../app/store";
import { logout as logoutAction } from "../app/slices/userSlice";

//API 기본 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:80";

//세션 기반 인증을 위한 axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 세션 쿠키(JSESSIONID) 자동 포함
    paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "Response Error:",
      error.response?.status,
      error.response?.data
    );

    // 401 오류는 ProtectedRoute에서 처리하므로 여기서는 단순히 에러만 반환
    return Promise.reject(error);
  }
);

export default apiClient;

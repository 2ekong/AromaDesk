// 가격 포맷팅 유틸리티
export const formatPrice = (price) => {
  if (!price && price !== 0) return "0원";
  return price.toLocaleString("ko-KR") + "원";
};

// 날짜 포맷팅 유틸리티
export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("ko-KR");
};

// 날짜 시간 포맷팅 유틸리티
export const formatDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("ko-KR");
};

// 문자열 자르기 유틸리티
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// 퍼센트 계산 유틸리티
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

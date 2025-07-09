import axios from './axiosConfig';

export const adminStatsApi = {
  // 기간별 총매출 (기존 백엔드 API 사용)
  getTotalRevenue: async (startDate, endDate) => {
    try {
      const response = await axios.get('/api/orders/total-revenue', {
        params: {
          start: startDate,
          end: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('총매출 조회 실패:', error);
      throw error;
    }
  },

  // 기간별 주문 상태별 개수 (기존 백엔드 API 사용)
  getOrderCountByStatus: async (startDate, endDate) => {
    try {
      const response = await axios.get('/api/orders/count-by-status', {
        params: {
          start: startDate,
          end: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('주문 상태별 개수 조회 실패:', error);
      throw error;
    }
  },

  // 월별 매출 통계 (새로 구현 필요)
  getMonthlyRevenue: async (startDate, endDate) => {
    try {
      const response = await axios.get('/api/admin/stats/monthly-revenue', {
        params: {
          startDate,
          endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('월별 매출 통계 조회 실패:', error);
      throw error;
    }
  },

  // 구매 통계 (상품별, 브랜드별 등) (새로 구현 필요)
  getPurchaseStats: async (startDate, endDate) => {
    try {
      const response = await axios.get('/api/admin/stats/purchase', {
        params: {
          startDate,
          endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('구매 통계 조회 실패:', error);
      throw error;
    }
  },

  // 전체 통계 요약 (새로 구현 필요)
  getStatsSummary: async (startDate, endDate) => {
    try {
      const response = await axios.get('/api/admin/stats/summary', {
        params: {
          startDate,
          endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('통계 요약 조회 실패:', error);
      throw error;
    }
  }
}; 
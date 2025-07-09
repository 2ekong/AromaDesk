import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import AdminLayout from "../components/admin/layout/AdminLayout";
import { adminStatsApi } from "../api/adminStatsApi";
import "../css/AdminDashboardPage.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Line, Chart } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// 상수 정의
const CHART_COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40'
];

const QUICK_DATE_OPTIONS = [
  { label: '최근 1개월', months: 1 },
  { label: '최근 3개월', months: 3 },
  { label: '최근 6개월', months: 6 },
  { label: '최근 1년', months: 12 }
];

const SUMMARY_CARDS = [
  { key: 'totalRevenue', label: '총 매출', unit: '원' },
  { key: 'totalOrders', label: '총 주문 수', unit: '건' },
  { key: 'avgOrderValue', label: '평균 주문 금액', unit: '원' },
  { key: 'paidOrders', label: '결제 완료', unit: '건' }
];

// 차트 옵션 컴포넌트
const ChartOptions = {
  base: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 15,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.parsed.y > 0) {
              return `${context.dataset.label}: ${context.parsed.y}개`;
            }
            return null; // 0인 값은 툴팁에 표시하지 않음
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  },
  line: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}원`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return (value / 1000000).toFixed(1) + 'M';
          }
        }
      }
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8,
        backgroundColor: '#2563eb',
        borderColor: '#fff',
        borderWidth: 2
      },
      line: {
        tension: 0.4,
        borderWidth: 3
      }
    }
  },
  combined: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}원`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return (value / 1000000).toFixed(1) + 'M';
          }
        }
      }
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8,
        backgroundColor: '#2563eb',
        borderColor: '#fff',
        borderWidth: 2
      },
      line: {
        tension: 0.4,
        borderWidth: 3
      }
    }
  },
  doughnut: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: 'bold'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label}: ${value.toLocaleString()}원 (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i] || dataset.backgroundColor,
                  strokeStyle: dataset.borderColor || '#fff',
                  lineWidth: dataset.borderWidth || 0,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed.toLocaleString()}원 (${percentage}%)`;
          }
        }
      }
    }
  }
};

// 실제 월별 매출 데이터 가져오기
const getMonthlyRevenueData = async (startDate, endDate) => {
  try {
    const monthlyData = [];
    
    // 시작일과 종료일 사이의 모든 월을 계산
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    
    while (current <= end) {
      const monthStart = new Date(current);
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
      
      // 해당 월의 매출 조회
      const monthlyRevenue = await adminStatsApi.getTotalRevenue(
        dateUtils.formatDate(monthStart),
        dateUtils.formatDate(monthEnd)
      );
      
      if (monthlyRevenue > 0) {
        monthlyData.push({
          month: `${current.getMonth() + 1}월`,
          revenue: monthlyRevenue
        });
      }
      
      current.setMonth(current.getMonth() + 1);
    }
    
    return monthlyData;
  } catch (error) {
    console.error('월별 매출 데이터 조회 실패:', error);
    return [];
  }
};

// 더미 데이터 생성 함수들 (구매 데이터와 요약 데이터는 유지)
const generateDummyData = {
  purchase: () => {
    // 성별 카테고리
    const genderCategories = [
      { category: '남성향수', count: Math.floor(Math.random() * 300) + 150 },
      { category: '여성향수', count: Math.floor(Math.random() * 400) + 200 },
      { category: '남녀공용향수', count: Math.floor(Math.random() * 200) + 100 }
    ];
    
    // 용량 카테고리
    const volumeCategories = [
              { category: '30ml', count: Math.floor(Math.random() * 250) + 120 },
        { category: '50ml', count: Math.floor(Math.random() * 250) + 180 },
      { category: '대용량', count: Math.floor(Math.random() * 150) + 80 }
    ];
    
    return {
      gender: genderCategories,
      volume: volumeCategories
    };
  },
  
  summary: () => ({
    totalRevenue: 45000000,
    totalOrders: 1250,
    avgOrderValue: 36000,
    paidOrders: 980
  })
};

// 날짜 유틸리티 함수
const dateUtils = {
  formatDate: (date) => date.toISOString().split('T')[0],
  getDateFromMonthsAgo: (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date;
  }
};

// 데이터 필터링 유틸리티 함수
const dataUtils = {
  // 매출이 있는 월만 필터링
  filterRevenueData: (data) => {
    if (!Array.isArray(data)) return [];
    
    return data
      .filter(item => item && item.revenue && item.revenue > 0) // 매출이 0보다 큰 데이터만
      .sort((a, b) => {
        // 월 순서로 정렬 (1월, 2월, 3월...)
        const monthA = parseInt(a.month.replace('월', ''));
        const monthB = parseInt(b.month.replace('월', ''));
        return monthA - monthB;
      });
  },
  
  // 백엔드에서 받은 월별 데이터를 프론트엔드 형식으로 변환
  transformMonthlyData: (backendData) => {
    if (!backendData || !Array.isArray(backendData)) return [];
    
    return backendData
      .filter(item => item && item.revenue > 0) // 매출이 있는 데이터만
      .map(item => ({
        month: `${item.month}월`,
        revenue: item.revenue
      }))
      .sort((a, b) => {
        const monthA = parseInt(a.month.replace('월', ''));
        const monthB = parseInt(b.month.replace('월', ''));
        return monthA - monthB;
      });
  }
};

// 통계 요약 카드 컴포넌트
const SummaryCard = React.memo(({ title, value, unit }) => (
  <div className="summary-card">
    <h3>{title}</h3>
    <div className="value">
      {value.toLocaleString()}
      <span className="unit">{unit}</span>
    </div>
  </div>
));

// 차트 컴포넌트
const ChartComponent = React.memo(({ 
  title, 
  loading, 
  error, 
  chartData, 
  chartOptions, 
  ChartType,
  isCombined = false
}) => (
  <div className="chart-card">
    <h3 className="chart-title">{title}</h3>
    <div className="chart-container">
      {loading ? (
        <div className="loading-container">로딩 중...</div>
      ) : error ? (
        <div className="error-container">{error}</div>
      ) : isCombined ? (
        <Chart data={chartData} options={chartOptions} />
      ) : (
        <ChartType data={chartData} options={chartOptions} />
      )}
    </div>
  </div>
));



// 날짜 필터 컴포넌트
const DateFilter = React.memo(({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onQuickDateSelect, 
  onSearch, 
  loading 
}) => (
  <div className="date-filter-container">
    <div className="date-input-group">
      <label>시작일:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
      />
    </div>
    <div className="date-input-group">
      <label>종료일:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
      />
    </div>
    
    <div className="quick-date-buttons">
      {QUICK_DATE_OPTIONS.map(({ label, months }) => (
        <button 
          key={months}
          className="quick-date-btn"
          onClick={() => onQuickDateSelect(months)}
        >
          {label}
        </button>
      ))}
    </div>

    <button 
      className="search-btn"
      onClick={onSearch}
      disabled={loading || !startDate || !endDate}
    >
      {loading ? '조회 중...' : '통계 조회'}
    </button>
  </div>
));

const AdminDashboardPage = () => {
  // 상태 관리
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({
    revenue: [],
    purchase: [],
    summary: {}
  });

  // 차트 참조
  const revenueChartRef = useRef(null);
  const purchaseChartRef = useRef(null);

  // 초기 날짜 설정 (최근 1개월)
  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = dateUtils.getDateFromMonthsAgo(1);
    
    setEndDate(dateUtils.formatDate(today));
    setStartDate(dateUtils.formatDate(oneMonthAgo));
  }, []);

  // 날짜가 설정되면 통계 데이터 로드
  useEffect(() => {
    if (startDate && endDate) {
      fetchStatsData();
    }
  }, [startDate, endDate]);

  // 통계 데이터 가져오기
  const fetchStatsData = useCallback(async () => {
    if (!startDate || !endDate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 실제 월별 매출 데이터 가져오기
      const revenueData = await getMonthlyRevenueData(startDate, endDate);
      
      // 기존 백엔드 API 사용
      const [totalRevenue, orderStatusCount] = await Promise.all([
        adminStatsApi.getTotalRevenue(startDate, endDate),
        adminStatsApi.getOrderCountByStatus(startDate, endDate)
      ]);

      const purchaseData = generateDummyData.purchase();
      
      // 실제 데이터로 요약 정보 구성
      const totalOrders = Object.values(orderStatusCount || {}).reduce((sum, count) => sum + count, 0);
      const summaryData = {
        totalRevenue: totalRevenue || 0,
        totalOrders,
        avgOrderValue: totalRevenue && totalOrders > 0 
          ? Math.round(totalRevenue / totalOrders)
          : 0,
        paidOrders: orderStatusCount?.PAID || 0
      };

      setStatsData({
        revenue: revenueData,
        purchase: purchaseData,
        summary: summaryData
      });
    } catch (err) {
      console.error('통계 데이터 조회 실패:', err);
      setError('통계 데이터를 불러오는데 실패했습니다.');
      // 에러 시 빈 데이터로 차트 표시
      setStatsData({
        revenue: [],
        purchase: generateDummyData.purchase(),
        summary: {
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
          paidOrders: 0
        }
      });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);



  // 빠른 날짜 선택
  const setQuickDate = useCallback((months) => {
    const today = new Date();
    const start = dateUtils.getDateFromMonthsAgo(months);
    
    setEndDate(dateUtils.formatDate(today));
    setStartDate(dateUtils.formatDate(start));
  }, []);

  // 차트 데이터 메모이제이션
  const revenueChartData = useMemo(() => ({
    labels: statsData.revenue.map(item => item.month),
    datasets: [
      {
        label: '월별 매출 (막대)',
        data: statsData.revenue.map(item => item.revenue),
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderColor: '#2563eb',
        borderWidth: 2,
        type: 'bar',
        order: 2
      },
      {
        label: '월별 매출 (선)',
        data: statsData.revenue.map(item => item.revenue),
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: '#2563eb',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        type: 'line',
        order: 1
      }
    ]
  }), [statsData.revenue]);

  const purchaseChartData = useMemo(() => {
    if (!statsData.purchase.gender || !statsData.purchase.volume) {
      return {
        labels: [],
        datasets: []
      };
    }

    const allLabels = [
      ...statsData.purchase.gender.map(item => item.category),
      ...statsData.purchase.volume.map(item => item.category)
    ];

    return {
      labels: allLabels,
      datasets: [
        {
          label: '성별 카테고리',
          data: [
            ...statsData.purchase.gender.map(item => item.count),
            ...Array(statsData.purchase.volume.length).fill(0) // 용량 카테고리 부분은 0으로 채움
          ],
          backgroundColor: 'rgba(37, 99, 235, 0.8)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 1,
          order: 1
        },
        {
          label: '용량 카테고리',
          data: [
            ...Array(statsData.purchase.gender.length).fill(0), // 성별 카테고리 부분은 0으로 채움
            ...statsData.purchase.volume.map(item => item.count)
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          order: 2
        }
      ]
    };
  }, [statsData.purchase]);

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        <h1 style={{fontSize: '28px', fontWeight: '700', marginBottom: '8px'}}>관리자 대시보드</h1>
        <h2 style={{fontSize: '16px', color: '#888', marginBottom: '24px'}}>매출 및 구매 통계를 확인하세요</h2>

        {/* 기간 필터 */}
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onQuickDateSelect={setQuickDate}
          onSearch={fetchStatsData}
          loading={loading}
        />

        {/* 통계 요약 */}
        <div className="stats-summary">
          {SUMMARY_CARDS.map(({ key, label, unit }) => (
            <SummaryCard
              key={key}
              title={label}
              value={statsData.summary[key] || 0}
              unit={unit}
            />
          ))}
        </div>

        {/* 차트 컨테이너 */}
        <div className="charts-container">
          <ChartComponent
            title="월별 매출 추이"
            loading={loading}
            error={error}
            chartData={revenueChartData}
            chartOptions={ChartOptions.combined}
            isCombined={true}
          />
          
          <ChartComponent
            title="성별/용량별 구매 현황"
            loading={loading}
            error={error}
            chartData={purchaseChartData}
            chartOptions={ChartOptions.base}
            ChartType={Bar}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage; 
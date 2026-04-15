import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Filler, Tooltip, Legend, ArcElement
} from 'chart.js';
import { dashboardData } from '../data/mockData';
import { FiTrendingUp, FiTrendingDown, FiUsers, FiShoppingCart, FiDollarSign, FiTarget, FiZap, FiArrowLeft } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

const formatNumber = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K' : n;

const kpis = [
    { label: 'إيرادات اليوم', value: dashboardData.revenue.today, prefix: '', suffix: ' ر.س', trend: dashboardData.revenue.trend, icon: FiDollarSign, color: '#0A84FF' },
    { label: 'إيرادات الشهر', value: dashboardData.revenue.month, prefix: '', suffix: ' ر.س', trend: dashboardData.revenue.trend, icon: FiTrendingUp, color: '#34D399' },
    { label: 'العملاء', value: dashboardData.customers.total, prefix: '', suffix: '', trend: dashboardData.customers.trend, icon: FiUsers, color: '#FBBF24' },
    { label: 'الطلبات', value: dashboardData.orders.total, prefix: '', suffix: '', trend: dashboardData.orders.trend, icon: FiShoppingCart, color: '#F87171' },
];

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            rtl: true,
            titleFont: { family: 'Cairo' },
            bodyFont: { family: 'Cairo' },
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
        },
    },
    scales: {
        x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'Cairo' } },
        },
        y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'Cairo' } },
        },
    },
};

export default function Dashboard() {
    const salesData = {
        labels: dashboardData.salesChart.labels,
        datasets: [{
            label: 'المبيعات',
            data: dashboardData.salesChart.data,
            borderColor: '#0A84FF',
            backgroundColor: 'rgba(10, 132, 255, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#0A84FF',
        }],
    };

    const customersData = {
        labels: dashboardData.customersChart.labels,
        datasets: [{
            label: 'العملاء الجدد',
            data: dashboardData.customersChart.data,
            borderColor: '#34D399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#34D399',
        }],
    };

    const conversionData = {
        labels: ['مبيعات', 'عملاء محتملين', 'زوار'],
        datasets: [{
            data: [35, 25, 40],
            backgroundColor: ['#0A84FF', '#34D399', '#FBBF24'],
            borderWidth: 0,
        }],
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1>لوحة التحكم</h1>
                    <p className="text-secondary">مرحباً بك، هذه نظرة عامة على أداء عملك</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary btn-sm">تقرير PDF</button>
                    <button className="btn btn-primary btn-sm">
                        <FiZap size={16} /> تحليل AI
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid stagger-children">
                {kpis.map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={i} className="kpi-card glass-card">
                            <div className="kpi-header">
                                <span className="kpi-label">{kpi.label}</span>
                                <div className="kpi-icon-wrap" style={{ background: `${kpi.color}20` }}>
                                    <Icon size={20} style={{ color: kpi.color }} />
                                </div>
                            </div>
                            <div className="kpi-value">{formatNumber(kpi.value)}{kpi.suffix}</div>
                            <div className={`kpi-trend ${kpi.trend >= 0 ? 'trend-up' : 'trend-down'}`}>
                                {kpi.trend >= 0 ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                                <span>{Math.abs(kpi.trend)}%</span>
                                <span className="text-muted">مقارنة بالشهر الماضي</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* AI Insights */}
            <div className="ai-insights-panel glass-card">
                <div className="panel-header">
                    <h3><FiZap className="text-gradient" /> رؤى الذكاء الاصطناعي</h3>
                    <span className="badge badge-primary">{dashboardData.aiInsights.length} توصية</span>
                </div>
                <div className="insights-list">
                    {dashboardData.aiInsights.map((insight) => (
                        <div key={insight.id} className={`insight-item insight-${insight.type}`}>
                            <div className="insight-content">
                                <p className="insight-text">{insight.text}</p>
                                <p className="insight-action">
                                    <FiTarget size={14} /> {insight.action}
                                </p>
                            </div>
                            <button className="btn btn-sm btn-ghost">
                                تنفيذ <FiArrowLeft size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                <div className="chart-card glass-card">
                    <h4>المبيعات</h4>
                    <div className="chart-container" style={{ height: 280 }}>
                        <Line data={salesData} options={chartOptions} />
                    </div>
                </div>
                <div className="chart-card glass-card">
                    <h4>العملاء الجدد</h4>
                    <div className="chart-container" style={{ height: 280 }}>
                        <Line data={customersData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="bottom-row">
                <div className="chart-card glass-card" style={{ maxWidth: 350 }}>
                    <h4>التحويلات</h4>
                    <div className="chart-container" style={{ height: 220 }}>
                        <Doughnut data={conversionData} options={{ ...chartOptions, scales: undefined, cutout: '65%' }} />
                    </div>
                </div>
                <div className="activity-card glass-card" style={{ flex: 1 }}>
                    <h4>النشاط الأخير</h4>
                    <div className="activity-list">
                        {dashboardData.activityFeed.map((item) => (
                            <div key={item.id} className="activity-item">
                                <div className={`activity-dot activity-${item.type}`} />
                                <div className="activity-content">
                                    <span>{item.text}</span>
                                    <span className="text-xs text-muted">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect, useCallback } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Filler, Tooltip, Legend, ArcElement
} from 'chart.js';
import { dashboardData } from '../data/mockData';
import { FiTrendingUp, FiTrendingDown, FiUsers, FiShoppingCart, FiDollarSign, FiTarget, FiZap, FiArrowLeft } from 'react-icons/fi';
import { apiFetch } from '../lib/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

const formatNumber = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K' : n;

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            rtl: true,
            titleFont: { family: 'IBM Plex Sans Arabic' },
            bodyFont: { family: 'IBM Plex Sans Arabic' },
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
            ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'IBM Plex Sans Arabic' } },
        },
        y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'IBM Plex Sans Arabic' } },
        },
    },
};

export default function Dashboard() {
    const [aiInsights, setAiInsights] = useState(dashboardData.aiInsights);
    const [aiMeta, setAiMeta] = useState(null);
    const [liveDashboard, setLiveDashboard] = useState(null);

    const refreshAi = useCallback(async () => {
        try {
            const [insRes, dashRes] = await Promise.all([
                apiFetch('/ai/insights'),
                apiFetch('/dashboard/'),
            ]);
            if (insRes.ok) {
                const j = await insRes.json();
                const mapped = (j.insights || []).map((x) => ({
                    id: x.id,
                    type: x.type,
                    text: x.text,
                    action: x.action,
                    priority: x.priority,
                    confidence: x.confidence,
                }));
                setAiInsights(mapped.length ? mapped : dashboardData.aiInsights);
                setAiMeta(j.meta || null);
            }
            if (dashRes.ok) {
                const d = await dashRes.json();
                setLiveDashboard(d);
            }
        } catch {
            setAiInsights(dashboardData.aiInsights);
        }
    }, []);

    useEffect(() => {
        refreshAi();
    }, [refreshAi]);

    const revenueToday = liveDashboard?.revenue?.paid != null
        ? Math.round(Number(liveDashboard.revenue.paid) * 0.12)
        : dashboardData.revenue.today;
    const revenueMonth = liveDashboard?.revenue?.total != null
        ? Math.round(Number(liveDashboard.revenue.total))
        : dashboardData.revenue.month;
    const customersTotal = liveDashboard?.customers?.total ?? dashboardData.customers.total;
    const ordersTotal = liveDashboard?.orders?.total ?? dashboardData.orders.total;

    const kpisLive = [
        { label: 'إيرادات اليوم', value: revenueToday, prefix: '', suffix: ' ر.س', trend: dashboardData.revenue.trend, icon: FiDollarSign, color: '#C8A960' },
        { label: 'إيرادات الشهر', value: revenueMonth, prefix: '', suffix: ' ر.س', trend: liveDashboard?.revenue?.trend ?? dashboardData.revenue.trend, icon: FiTrendingUp, color: '#34D399' },
        { label: 'العملاء', value: customersTotal, prefix: '', suffix: '', trend: dashboardData.customers.trend, icon: FiUsers, color: '#FBBF24' },
        { label: 'الطلبات', value: ordersTotal, prefix: '', suffix: '', trend: liveDashboard?.orders?.trend ?? dashboardData.orders.trend, icon: FiShoppingCart, color: '#F87171' },
    ];

    const salesData = {
        labels: liveDashboard?.sales_chart?.labels || dashboardData.salesChart.labels,
        datasets: [{
            label: 'المبيعات',
            data: liveDashboard?.sales_chart?.data || dashboardData.salesChart.data,
            borderColor: '#C8A960',
            backgroundColor: 'rgba(200, 169, 96, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#C8A960',
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
            backgroundColor: ['#C8A960', '#34D399', '#FBBF24'],
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
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => refreshAi()}>
                        <FiZap size={16} /> تحليل AI
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid stagger-children">
                {kpisLive.map((kpi, i) => {
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
                    <span className="badge badge-primary">{aiInsights.length} توصية</span>
                </div>
                {aiMeta && (
                    <p className="text-xs text-muted mb-3" style={{ paddingInline: '1rem' }}>
                        نموذج: {aiMeta.model_tier} — زمن تقديري {aiMeta.latency_ms_estimate}ms — حداثة البيانات ~{aiMeta.data_freshness_minutes} د
                    </p>
                )}
                <div className="insights-list">
                    {aiInsights.map((insight) => (
                        <div key={insight.id} className={`insight-item insight-${insight.type}`}>
                            <div className="insight-content">
                                <p className="insight-text">{insight.text}</p>
                                <p className="insight-action">
                                    <FiTarget size={14} /> {insight.action}
                                    {insight.confidence != null && (
                                        <span className="text-xs text-muted" style={{ marginInlineStart: 8 }}>
                                            ثقة {Math.round(Number(insight.confidence) * 100)}%
                                        </span>
                                    )}
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
                        {(liveDashboard?.activity_feed || dashboardData.activityFeed).map((item) => (
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

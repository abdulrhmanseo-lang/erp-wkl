import { useLocation } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { companies } from '../data/mockData';
import { FiUsers, FiDollarSign, FiActivity, FiCpu, FiEye, FiTrash2, FiPause, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const totalRevenue = companies.reduce((s, c) => s + c.revenue, 0);
const totalUsers = companies.reduce((s, c) => s + c.users, 0);

export default function AdminDashboard() {
    const location = useLocation();
    const path = location.pathname;

    const revenueChart = {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل'],
        datasets: [{
            label: 'إيرادات المنصة',
            data: [180000, 220000, 290000, totalRevenue],
            borderColor: '#0A84FF',
            backgroundColor: 'rgba(10,132,255,0.1)',
            fill: true,
            tension: 0.4,
        }],
    };

    const getTitle = () => {
        if (path === '/admin/companies') return 'الشركات';
        if (path === '/admin/revenue') return 'الإيرادات';
        if (path === '/admin/subscriptions') return 'الاشتراكات';
        if (path === '/admin/analytics') return 'التحليلات';
        if (path === '/admin/ai-control') return 'إدارة الذكاء الاصطناعي';
        return 'نظرة عامة (لوحة التحكم)';
    };

    return (
        <div className="page-enter">
            <div className="page-header">
                <div>
                    <h1>{getTitle()}</h1>
                    <p className="text-secondary">تفاصيل وإدارة النظام المتقدمة</p>
                </div>
            </div>

            {/* KPIs */}
            {path !== '/admin/ai-control' && (
                <div className="grid grid-4 gap-4 mb-6 stagger-children">
                    <div className="glass-card">
                        <div className="flex items-center gap-3 mb-2"><FiUsers style={{ color: '#0A84FF' }} /><span className="text-secondary">الشركات</span></div>
                        <div className="text-2xl font-bold">{companies.length}</div>
                        <div className="text-xs text-muted">{companies.filter(c => c.status === 'active').length} نشطة</div>
                    </div>
                    <div className="glass-card">
                        <div className="flex items-center gap-3 mb-2"><FiDollarSign style={{ color: '#34D399' }} /><span className="text-secondary">إجمالي الإيرادات</span></div>
                        <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} ر.س</div>
                    </div>
                    <div className="glass-card">
                        <div className="flex items-center gap-3 mb-2"><FiActivity style={{ color: '#FBBF24' }} /><span className="text-secondary">المستخدمون</span></div>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                    </div>
                    <div className="glass-card">
                        <div className="flex items-center gap-3 mb-2"><FiCpu style={{ color: '#F87171' }} /><span className="text-secondary">وكلاء AI نشطين</span></div>
                        <div className="text-2xl font-bold">18</div>
                    </div>
                </div>
            )}

            {/* Revenue Chart */}
            {(path === '/admin' || path === '/admin/revenue' || path === '/admin/analytics') && (
                <div className="glass-card mb-6">
                    <h3 className="mb-4"><FiBarChart2 /> إيرادات المنصة</h3>
                    <div style={{ height: 280 }}>
                        <Line data={revenueChart} options={{
                            responsive: true, maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'Cairo' } } },
                                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'Cairo' } } },
                            },
                        }} />
                    </div>
                </div>
            )}

            {/* Companies Table */}
            {(path === '/admin' || path === '/admin/companies' || path === '/admin/subscriptions') && (
                <div className="glass-card" style={{ padding: 0 }}>
                    <div className="flex items-center justify-between p-6">
                        <h3>قائمة الشركات</h3>
                        <span className="badge badge-primary">{companies.length} سجل</span>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr><th>الشركة</th><th>القطاع</th><th>الخطة</th><th>الإيرادات</th><th>المستخدمون</th><th>الحالة</th><th>إجراءات</th></tr>
                            </thead>
                            <tbody>
                                {companies.map(c => (
                                    <tr key={c.id}>
                                        <td className="font-semibold">{c.name}</td>
                                        <td><span className="badge badge-primary">{c.sector}</span></td>
                                        <td>{c.plan}</td>
                                        <td>{c.revenue.toLocaleString()} ر.س</td>
                                        <td>{c.users}</td>
                                        <td><span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{c.status === 'active' ? 'نشط' : 'معلق'}</span></td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button className="btn btn-icon btn-ghost"><FiEye size={16} /></button>
                                                <button className="btn btn-icon btn-ghost"><FiPause size={16} /></button>
                                                <button className="btn btn-icon btn-ghost" style={{ color: '#F87171' }}><FiTrash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* AI Control */}
            {(path === '/admin' || path === '/admin/ai-control' || path === '/admin/subscriptions') && (
                <div className="glass-card mt-6">
                    <h3 className="mb-4"><FiCpu /> التحكم في الذكاء الاصطناعي</h3>
                    <div className="grid grid-3 gap-4">
                        {[
                            { name: 'وكيل المبيعات', active: 18, accuracy: '94%' },
                            { name: 'وكيل التسويق', active: 15, accuracy: '91%' },
                            { name: 'وكيل الدعم', active: 22, accuracy: '88%' },
                        ].map((a, i) => (
                            <div key={i} className="glass p-4" style={{ borderRadius: 'var(--radius-lg)' }}>
                                <h4 className="font-semibold mb-2">{a.name}</h4>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">نشط في:</span>
                                    <span>{a.active} شركة</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-secondary">الدقة:</span>
                                    <span className="text-gradient font-bold">{a.accuracy}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiBarChart2, FiDollarSign, FiUsers, FiTrendingUp, FiShoppingCart, FiTarget } from 'react-icons/fi';

export default function Reports() {
    const { API_URL, user } = useAuth();
    const [overview, setOverview] = useState(null);
    const [revenue, setRevenue] = useState(null);
    const [empReport, setEmpReport] = useState(null);
    const [clientReport, setClientReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const tenantId = user?.tenant_id || 1;

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/reports/overview?tenant_id=${tenantId}`).then(r => r.json()).catch(() => null),
            fetch(`${API_URL}/reports/revenue?tenant_id=${tenantId}`).then(r => r.json()).catch(() => null),
            fetch(`${API_URL}/reports/employees?tenant_id=${tenantId}`).then(r => r.json()).catch(() => null),
            fetch(`${API_URL}/reports/clients?tenant_id=${tenantId}`).then(r => r.json()).catch(() => null),
        ]).then(([ov, rev, emp, cli]) => {
            setOverview(ov);
            setRevenue(rev);
            setEmpReport(emp);
            setClientReport(cli);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="page-container"><p className="text-secondary">جاري تحميل التقارير...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1><FiBarChart2 style={{ display: 'inline', marginLeft: '8px' }} /> التقارير والتحليلات</h1>
                    <p className="text-secondary">نظرة شاملة على أداء عملك التجاري</p>
                </div>
            </div>

            {overview && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    <StatCard icon={<FiDollarSign />} label="إجمالي الإيرادات" value={`${overview.total_revenue.toLocaleString()} ر.س`} color="#22c55e" />
                    <StatCard icon={<FiBarChart2 />} label="الفواتير" value={overview.total_invoices} color="#3b82f6" />
                    <StatCard icon={<FiUsers />} label="الموظفين" value={overview.total_employees} color="#a855f7" />
                    <StatCard icon={<FiTarget />} label="العملاء" value={overview.total_clients} color="#f59e0b" />
                    <StatCard icon={<FiShoppingCart />} label="الطلبات" value={overview.total_orders} color="#ec4899" />
                    <StatCard icon={<FiTrendingUp />} label="الحملات" value={overview.total_campaigns} color="#06b6d4" />
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {revenue && (
                    <div className="card glass p-5">
                        <h3 style={{ marginBottom: '16px' }}><FiDollarSign style={{ display: 'inline', marginLeft: '6px' }} /> تقرير الإيرادات</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">المحصّلة</span>
                                <span style={{ color: '#22c55e', fontWeight: 700 }}>{revenue.total_revenue.toLocaleString()} ر.س</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">المعلّقة</span>
                                <span style={{ color: '#f59e0b', fontWeight: 700 }}>{revenue.pending_revenue.toLocaleString()} ر.س</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">المتأخرة</span>
                                <span style={{ color: '#ef4444', fontWeight: 700 }}>{revenue.overdue_revenue.toLocaleString()} ر.س</span>
                            </div>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>نسبة التحصيل</span>
                                <span className="text-gradient" style={{ fontWeight: 700, fontSize: '18px' }}>{revenue.collection_rate}%</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${revenue.collection_rate}%`, height: '100%', background: 'linear-gradient(90deg, #D4AF37, #22c55e)', borderRadius: '8px' }} />
                            </div>
                        </div>
                    </div>
                )}

                {empReport && (
                    <div className="card glass p-5">
                        <h3 style={{ marginBottom: '16px' }}><FiUsers style={{ display: 'inline', marginLeft: '6px' }} /> تقرير الموظفين</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">إجمالي الموظفين</span>
                                <span style={{ fontWeight: 700 }}>{empReport.total_employees}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">الموظفون النشطون</span>
                                <span style={{ color: '#22c55e', fontWeight: 700 }}>{empReport.active_employees}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">إجمالي الرواتب</span>
                                <span style={{ fontWeight: 700 }}>{empReport.total_salaries.toLocaleString()} ر.س</span>
                            </div>
                            {empReport.departments.length > 0 && (
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                                    <p className="text-secondary text-sm" style={{ marginBottom: '8px' }}>التوزيع حسب القسم</p>
                                    {empReport.departments.map(d => (
                                        <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                                            <span>{d.name}</span>
                                            <span className="badge badge-info">{d.count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {clientReport && (
                    <div className="card glass p-5">
                        <h3 style={{ marginBottom: '16px' }}><FiTarget style={{ display: 'inline', marginLeft: '6px' }} /> تقرير العملاء</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">إجمالي العملاء</span>
                                <span style={{ fontWeight: 700 }}>{clientReport.total_clients}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">العملاء النشطون</span>
                                <span style={{ color: '#22c55e', fontWeight: 700 }}>{clientReport.active_clients}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">إجمالي الإيرادات</span>
                                <span style={{ fontWeight: 700 }}>{clientReport.total_revenue.toLocaleString()} ر.س</span>
                            </div>
                            {clientReport.sources.length > 0 && (
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                                    <p className="text-secondary text-sm" style={{ marginBottom: '8px' }}>مصادر العملاء</p>
                                    {clientReport.sources.map(s => (
                                        <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                                            <span>{s.name}</span>
                                            <span className="badge badge-info">{s.count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div className="card glass p-4" style={{ textAlign: 'center' }}>
            <div style={{ color, fontSize: '28px', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
            <p className="text-secondary text-sm">{label}</p>
            <h2 style={{ fontSize: '22px', marginTop: '4px' }} className="text-gradient">{value}</h2>
        </div>
    );
}

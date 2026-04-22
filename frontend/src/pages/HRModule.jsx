import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiClock, FiCalendar, FiCheckCircle, FiXCircle, FiAlertCircle, FiDollarSign, FiUsers } from 'react-icons/fi';

export default function HRModule() {
    const { API_URL, user } = useAuth();
    const [tab, setTab] = useState('attendance');
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [payroll, setPayroll] = useState(null);
    const [loading, setLoading] = useState(true);
    const tenantId = user?.tenant_id || 1;

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/hr/attendance?tenant_id=${tenantId}`).then(r => r.json()).catch(() => []),
            fetch(`${API_URL}/hr/leaves?tenant_id=${tenantId}`).then(r => r.json()).catch(() => []),
            fetch(`${API_URL}/hr/payroll-summary?tenant_id=${tenantId}`).then(r => r.json()).catch(() => null),
        ]).then(([att, lv, pr]) => {
            setAttendance(att);
            setLeaves(lv);
            setPayroll(pr);
            setLoading(false);
        });
    }, []);

    const tabs = [
        { id: 'attendance', label: 'الحضور والانصراف', icon: <FiClock /> },
        { id: 'leaves', label: 'الإجازات', icon: <FiCalendar /> },
        { id: 'payroll', label: 'الرواتب', icon: <FiDollarSign /> },
    ];

    const statusColors = { present: '#22c55e', absent: '#ef4444', late: '#f59e0b', leave: '#3b82f6' };
    const statusLabels = { present: 'حاضر', absent: 'غائب', late: 'متأخر', leave: 'إجازة' };
    const leaveStatusLabels = { pending: 'قيد الانتظار', approved: 'موافق عليه', rejected: 'مرفوض' };
    const leaveStatusColors = { pending: '#f59e0b', approved: '#22c55e', rejected: '#ef4444' };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1><FiUsers style={{ display: 'inline', marginLeft: '8px' }} /> الموارد البشرية</h1>
                    <p className="text-secondary">إدارة الحضور والإجازات والرواتب</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                    <button key={t.id} className={`btn ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(t.id)}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {loading ? <p className="text-secondary">جاري التحميل...</p> : (
                <>
                    {tab === 'attendance' && (
                        <div className="card glass">
                            <h3 style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <FiClock style={{ display: 'inline', marginLeft: '6px' }} /> سجل الحضور
                            </h3>
                            {attendance.length === 0 ? (
                                <p className="text-secondary" style={{ padding: '24px', textAlign: 'center' }}>لا يوجد سجلات حضور بعد. أضف موظفين أولاً من صفحة إدارة الموظفين.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>الموظف</th>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>التاريخ</th>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>الدخول</th>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>الخروج</th>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>الحالة</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance.map(r => (
                                            <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '12px' }}>{r.employee_name}</td>
                                                <td style={{ padding: '12px' }}>{r.date}</td>
                                                <td style={{ padding: '12px' }}>{r.check_in ? new Date(r.check_in).toLocaleTimeString('ar-SA') : '—'}</td>
                                                <td style={{ padding: '12px' }}>{r.check_out ? new Date(r.check_out).toLocaleTimeString('ar-SA') : '—'}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{ color: statusColors[r.status] || '#888', fontWeight: 600 }}>{statusLabels[r.status] || r.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {tab === 'leaves' && (
                        <div className="card glass">
                            <h3 style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <FiCalendar style={{ display: 'inline', marginLeft: '6px' }} /> طلبات الإجازات
                            </h3>
                            {leaves.length === 0 ? (
                                <p className="text-secondary" style={{ padding: '24px', textAlign: 'center' }}>لا يوجد طلبات إجازات</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>الموظف</th>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>النوع</th>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>من</th>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>إلى</th>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>الحالة</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaves.map(l => (
                                            <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '12px' }}>{l.employee_name}</td>
                                                <td style={{ padding: '12px' }}>{l.leave_type}</td>
                                                <td style={{ padding: '12px' }}>{l.start_date}</td>
                                                <td style={{ padding: '12px' }}>{l.end_date}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{ color: leaveStatusColors[l.status] || '#888', fontWeight: 600 }}>{leaveStatusLabels[l.status] || l.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {tab === 'payroll' && payroll && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                <div className="card glass p-4">
                                    <p className="text-secondary text-sm">عدد الموظفين النشطين</p>
                                    <h2 className="text-gradient">{payroll.total_employees}</h2>
                                </div>
                                <div className="card glass p-4">
                                    <p className="text-secondary text-sm">إجمالي الرواتب الشهرية</p>
                                    <h2 className="text-gradient">{payroll.total_salaries.toLocaleString()} ر.س</h2>
                                </div>
                                <div className="card glass p-4">
                                    <p className="text-secondary text-sm">متوسط الراتب</p>
                                    <h2 className="text-gradient">{Math.round(payroll.average_salary).toLocaleString()} ر.س</h2>
                                </div>
                            </div>
                            {payroll.departments.length > 0 && (
                                <div className="card glass p-4">
                                    <h3 style={{ marginBottom: '12px' }}>الأقسام</h3>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {payroll.departments.map(d => (
                                            <span key={d} className="badge badge-info">{d}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

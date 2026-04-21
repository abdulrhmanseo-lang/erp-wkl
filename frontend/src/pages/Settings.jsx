import { useState, useEffect } from 'react';
import { FiSave, FiUpload, FiLink, FiShield, FiUsers, FiBell, FiActivity } from 'react-icons/fi';
import { apiFetch } from '../lib/api';

export default function Settings() {
    const [health, setHealth] = useState(null);

    useEffect(() => {
        let c = false;
        (async () => {
            try {
                const res = await apiFetch('/ai/integration-health');
                if (!res.ok || c) return;
                setHealth(await res.json());
            } catch {
                /* ignore */
            }
        })();
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="page-enter">
            <div className="page-header">
                <div>
                    <h1>الإعدادات</h1>
                    <p className="text-secondary">إدارة إعدادات شركتك والتكاملات</p>
                </div>
            </div>

            <div className="settings-grid">
                {/* Company Profile */}
                <div className="glass-card">
                    <h3 className="mb-4">الملف التعريفي للشركة</h3>
                    <div className="company-logo-upload glass p-6 text-center mb-4" style={{ borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 8 }}>🏢</div>
                        <p className="text-sm text-secondary mb-2">شعار الشركة</p>
                        <button className="btn btn-sm btn-secondary"><FiUpload size={14} /> رفع شعار</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="input-group"><label>اسم الشركة</label><input className="input" defaultValue="مجموعة دار العقار" /></div>
                        <div className="input-group"><label>البريد الإلكتروني</label><input className="input" defaultValue="info@daraqar.com" dir="ltr" /></div>
                        <div className="input-group"><label>رقم الجوال</label><input className="input" defaultValue="0551234567" dir="ltr" /></div>
                        <div className="input-group"><label>العنوان</label><input className="input" defaultValue="الرياض، حي العليا" /></div>
                        <button className="btn btn-primary"><FiSave size={16} /> حفظ التغييرات</button>
                    </div>
                </div>

                {/* Integrations */}
                <div className="flex flex-col gap-4">
                    <div className="glass-card">
                        <h3 className="mb-4"><FiLink /> التكاملات</h3>
                        <div className="integrations-list">
                            {[
                                { name: 'واتساب API', status: 'connected', icon: '💬' },
                                { name: 'بوابة الدفع', status: 'connected', icon: '💳' },
                                { name: 'نظام CRM', status: 'disconnected', icon: '📊' },
                                { name: 'خدمة البريد', status: 'connected', icon: '📧' },
                            ].map((int, i) => (
                                <div key={i} className="integration-item flex items-center justify-between p-4 glass" style={{ borderRadius: 'var(--radius-md)', marginBottom: 8 }}>
                                    <div className="flex items-center gap-3">
                                        <span style={{ fontSize: '1.5rem' }}>{int.icon}</span>
                                        <span className="font-semibold">{int.name}</span>
                                    </div>
                                    <span className={`badge ${int.status === 'connected' ? 'badge-success' : 'badge-danger'}`}>
                                        {int.status === 'connected' ? 'متصل' : 'غير متصل'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="mb-4"><FiUsers /> إدارة الفريق</h3>
                        <div className="flex flex-col gap-2">
                            {[
                                { name: 'عبدالله المطيري', role: 'مالك', email: 'owner@test.com' },
                                { name: 'سارة أحمد', role: 'موظف', email: 'sara@test.com' },
                                { name: 'محمد الحربي', role: 'موظف', email: 'moh@test.com' },
                            ].map((m, i) => (
                                <div key={i} className="flex items-center justify-between p-3 glass" style={{ borderRadius: 'var(--radius-md)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="user-avatar-sm">{m.name.charAt(0)}</div>
                                        <div>
                                            <div className="font-semibold">{m.name}</div>
                                            <div className="text-xs text-muted">{m.email}</div>
                                        </div>
                                    </div>
                                    <span className="badge badge-primary">{m.role}</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-secondary btn-sm mt-4 w-full">+ إضافة عضو جديد</button>
                    </div>

                    <div className="glass-card">
                        <h3 className="mb-4"><FiBell /> إعدادات الإشعارات</h3>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'إشعارات البريد الإلكتروني', checked: true },
                                { label: 'إشعارات واتساب', checked: true },
                                { label: 'تنبيهات AI التلقائية', checked: true },
                                { label: 'تقارير يومية', checked: false },
                            ].map((s, i) => (
                                <label key={i} className="flex items-center justify-between p-3 glass" style={{ borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                                    <span>{s.label}</span>
                                    <input type="checkbox" defaultChecked={s.checked} style={{ width: 20, height: 20, accentColor: '#0A84FF' }} />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {health && (
                <div className="glass-card mt-6">
                    <h3 className="mb-4"><FiActivity /> صحة التكامل والذكاء (لحظي)</h3>
                    <div className="grid grid-2 gap-4">
                        {Object.entries(health).map(([key, val]) => (
                            <div key={key} className="glass p-4 flex items-center justify-between" style={{ borderRadius: 'var(--radius-md)' }}>
                                <span className="font-semibold text-sm">{key.replace(/_/g, ' ')}</span>
                                <span className={`badge ${val.status === 'ok' ? 'badge-success' : val.status === 'degraded' ? 'badge-warning' : 'badge-danger'}`}>
                                    {val.status || '—'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

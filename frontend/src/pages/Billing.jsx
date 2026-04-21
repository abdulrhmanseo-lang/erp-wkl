import { useState, useEffect } from 'react';
import { pricingPlans } from '../data/mockData';
import { FiCheck, FiCreditCard, FiCalendar, FiArrowLeft, FiZap } from 'react-icons/fi';
import { apiFetch } from '../lib/api';

export default function Billing() {
    const [subAi, setSubAi] = useState(null);

    useEffect(() => {
        let c = false;
        (async () => {
            try {
                const res = await apiFetch('/ai/subscription-insights');
                if (!res.ok || c) return;
                setSubAi(await res.json());
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
                    <h1>الفوترة والاشتراك</h1>
                    <p className="text-secondary">إدارة خطة اشتراكك وطرق الدفع</p>
                </div>
            </div>

            {/* Current Plan */}
            <div className="glass-card mb-6 animate-pulse-glow" style={{ borderColor: 'rgba(10,132,255,0.3)' }}>
                <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <span className="badge badge-primary mb-2">الخطة الحالية</span>
                        <h2>الخطة الاحترافية</h2>
                        <p className="text-secondary">799 ر.س / شهرياً</p>
                    </div>
                    <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                        <div className="glass p-4" style={{ borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                            <FiCalendar size={20} className="text-muted" style={{ margin: '0 auto 4px' }} />
                            <div className="text-sm text-secondary">تاريخ التجديد</div>
                            <div className="font-bold">15 مايو 2026</div>
                        </div>
                        <div className="glass p-4" style={{ borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                            <FiCreditCard size={20} className="text-muted" style={{ margin: '0 auto 4px' }} />
                            <div className="text-sm text-secondary">طريقة الدفع</div>
                            <div className="font-bold">**** 4532</div>
                        </div>
                    </div>
                    {subAi && (
                        <div className="glass p-4 mt-4" style={{ borderRadius: 'var(--radius-lg)', width: '100%' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <FiZap size={16} />
                                <span className="font-semibold text-sm">تحليل الاشتراك</span>
                            </div>
                            <p className="text-sm text-secondary" style={{ margin: '0 0 6px' }}>
                                مخاطر التجديد: <span className="text-success">{subAi.renewal_risk}</span>
                                {' — '}المقاعد: {subAi.seat_usage?.used}/{subAi.seat_usage?.included}
                                {' — '}تقدير الفاتورة القادمة: {subAi.next_bill_estimate_sar} ر.س
                            </p>
                            <ul className="text-xs text-muted" style={{ margin: 0, paddingInlineStart: '1.1rem' }}>
                                {(subAi.upgrade_value_props || []).map((u, i) => (
                                    <li key={i}>{u}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Plans */}
            <h3 className="mb-4">ترقية خطتك</h3>
            <div className="pricing-grid stagger-children">
                {pricingPlans.map((plan) => (
                    <div key={plan.id} className={`pricing-card glass-card ${plan.popular ? 'pricing-popular' : ''}`}>
                        {plan.popular && <div className="popular-badge">الأكثر شيوعاً</div>}
                        <h3 className="pricing-name">{plan.name}</h3>
                        <div className="pricing-price">
                            <span className="price-amount">{plan.price}</span>
                            <span className="price-currency">ر.س</span>
                            <span className="price-period">{plan.period}</span>
                        </div>
                        <ul className="pricing-features">
                            {plan.features.map((f, i) => (
                                <li key={i}><FiCheck size={16} className="check-icon" /> {f}</li>
                            ))}
                        </ul>
                        <button className={`btn w-full ${plan.id === 'pro' ? 'btn-secondary' : plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                            {plan.id === 'pro' ? 'خطتك الحالية' : 'ترقية'} {plan.id !== 'pro' && <FiArrowLeft size={16} />}
                        </button>
                    </div>
                ))}
            </div>

            {/* Payment History */}
            <div className="glass-card mt-6" style={{ padding: 0 }}>
                <div className="p-6"><h3>سجل المدفوعات</h3></div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>التاريخ</th><th>الوصف</th><th>المبلغ</th><th>الحالة</th></tr>
                        </thead>
                        <tbody>
                            {[
                                { date: '15/03/2026', desc: 'اشتراك شهري - الاحترافية', amount: '799', status: 'paid' },
                                { date: '15/02/2026', desc: 'اشتراك شهري - الاحترافية', amount: '799', status: 'paid' },
                                { date: '15/01/2026', desc: 'ترقية من الأساسية للاحترافية', amount: '500', status: 'paid' },
                                { date: '15/12/2025', desc: 'اشتراك شهري - الأساسية', amount: '299', status: 'paid' },
                            ].map((p, i) => (
                                <tr key={i}>
                                    <td>{p.date}</td>
                                    <td>{p.desc}</td>
                                    <td className="font-semibold">{p.amount} ر.س</td>
                                    <td><span className="badge badge-success">مدفوع</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

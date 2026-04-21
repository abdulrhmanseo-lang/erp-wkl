import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPackage, FiUsers, FiZap, FiBell } from 'react-icons/fi';
import { apiFetch } from '../lib/api';

const fallbackAlerts = [
    { id: 1, type: 'danger', icon: '📦', title: 'مخزون منخفض', text: 'المنتج "عطر فاخر - مسك طيبة" وصل لـ 8 وحدات فقط', action: 'إعادة طلب' },
    { id: 2, type: 'success', icon: '📈', title: 'طلب مرتفع', text: 'منتج "ثوب رجالي فاخر" شهد زيادة 45% في الطلب', action: 'رفع السعر' },
    { id: 3, type: 'warning', icon: '📉', title: 'انخفاض تفاعل', text: 'انخفض التفاعل على وسائل التواصل بنسبة 20%', action: 'إطلاق حملة' },
    { id: 4, type: 'info', icon: '💡', title: 'فرصة تسعير', text: 'يمكنك زيادة سعر الحقيبة الجلدية بنسبة 10% دون التأثير على المبيعات', action: 'تطبيق' },
];

const initialPricing = [
    { product: 'عطر فاخر - مسك طيبة', current_price: 350, suggested_price: 380, reason: 'طلب مرتفع + مخزون محدود', impact: '+8.6%' },
    { product: 'حقيبة جلد طبيعي', current_price: 680, suggested_price: 750, reason: 'منافس رفع السعر', impact: '+10.3%' },
    { product: 'ثوب رجالي فاخر', current_price: 450, suggested_price: 420, reason: 'موسم ركود - تحفيز المبيعات', impact: '-6.7%' },
];

const initialProducts = [
    { name: 'عطر فاخر', revenue: 44800, growth: 15, rank: 1 },
    { name: 'ثوب رجالي فاخر', revenue: 94500, growth: 25, rank: 2 },
    { name: 'حقيبة جلد طبيعي', revenue: 60520, growth: -5, rank: 3 },
    { name: 'ساعة كلاسيكية', revenue: 40800, growth: 8, rank: 4 },
];

export default function DecisionEngine() {
    const [alerts, setAlerts] = useState(fallbackAlerts);
    const [pricingSuggestions, setPricingSuggestions] = useState(initialPricing);
    const [productPerformance, setProductPerformance] = useState(initialProducts);
    const [scenario, setScenario] = useState(null);

    useEffect(() => {
        let c = false;
        (async () => {
            try {
                const res = await apiFetch('/ai/decision-bundle');
                if (!res.ok || c) return;
                const d = await res.json();
                setAlerts(d.alerts || fallbackAlerts);
                setPricingSuggestions(d.pricing || []);
                setProductPerformance(d.product_performance || []);
                setScenario(d.scenario_simulation || null);
            } catch {
                /* يبقى الافتراضي */
            }
        })();
        return () => {
            c = true;
        };
    }, []);

    const runFullAnalysis = async () => {
        try {
            const res = await apiFetch('/ai/decision-bundle');
            if (!res.ok) return;
            const d = await res.json();
            setAlerts(d.alerts || []);
            setPricingSuggestions(d.pricing || []);
            setProductPerformance(d.product_performance || []);
            setScenario(d.scenario_simulation || null);
        } catch {
            /* ignore */
        }
    };

    return (
        <div className="page-enter">
            <div className="page-header">
                <div>
                    <h1>محرك القرارات الذكي</h1>
                    <p className="text-secondary">تحليلات تنبؤية وتوصيات ذكية لتحسين أداء عملك</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={runFullAnalysis}>
                    <FiZap size={16} /> تحليل شامل
                </button>
            </div>

            {/* Smart Alerts */}
            <div className="glass-card mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3><FiBell /> التنبيهات الذكية</h3>
                    <span className="badge badge-danger">{alerts.length} تنبيه</span>
                </div>
                <div className="alerts-grid stagger-children">
                    {alerts.map((alert) => (
                        <div key={alert.id} className={`alert-item alert-${alert.type} glass`}>
                            <span className="alert-icon">{alert.icon}</span>
                            <div className="alert-content">
                                <span className="font-semibold">{alert.title}</span>
                                <p className="text-sm text-secondary">{alert.text}</p>
                            </div>
                            <button type="button" className="btn btn-sm btn-primary">{alert.action}</button>
                        </div>
                    ))}
                </div>
            </div>

            {scenario && (
                <div className="glass-card mb-6">
                    <h3 className="mb-3"><FiUsers size={18} /> محاكاة سيناريوهات (تقديرية)</h3>
                    <div className="grid grid-2 gap-4 text-sm">
                        <div className="glass p-3" style={{ borderRadius: 'var(--radius-md)' }}>
                            <span className="text-secondary">رفع أسعار مختارة 5%</span>
                            <div className="font-bold mt-1">{scenario.if_raise_prices_5pct}</div>
                        </div>
                        <div className="glass p-3" style={{ borderRadius: 'var(--radius-md)' }}>
                            <span className="text-secondary">زيادة إنفاق الإعلان 10%</span>
                            <div className="font-bold mt-1">{scenario.if_increase_ad_spend_10pct}</div>
                        </div>
                    </div>
                    <p className="text-xs text-muted mt-2">{scenario.risk_note}</p>
                </div>
            )}

            {/* Pricing Suggestions */}
            <div className="glass-card mb-6">
                <h3 className="mb-4"><FiDollarSign /> اقتراحات التسعير الديناميكي</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>السعر الحالي</th>
                                <th>السعر المقترح</th>
                                <th>السبب</th>
                                <th>التأثير المتوقع</th>
                                <th>إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pricingSuggestions.map((s, i) => (
                                <tr key={i}>
                                    <td className="font-semibold">{s.product}</td>
                                    <td>{s.current_price} ر.س</td>
                                    <td className="font-bold text-gradient">{s.suggested_price} ر.س</td>
                                    <td className="text-sm text-secondary">{s.reason}</td>
                                    <td>
                                        <span style={{ color: String(s.impact).startsWith('+') ? '#34D399' : '#FBBF24' }}>
                                            {s.impact}
                                        </span>
                                    </td>
                                    <td><button type="button" className="btn btn-sm btn-secondary">تطبيق</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Performance */}
            <div className="glass-card">
                <h3 className="mb-4"><FiPackage /> أداء المنتجات</h3>
                <div className="grid grid-4 gap-4">
                    {productPerformance.map((p, i) => (
                        <div key={i} className="glass p-4" style={{ borderRadius: 'var(--radius-lg)' }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted">#{p.rank}</span>
                                <span className="flex items-center gap-1 text-sm" style={{ color: p.growth >= 0 ? '#34D399' : '#F87171' }}>
                                    {p.growth >= 0 ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                                    {Math.abs(p.growth)}%
                                </span>
                            </div>
                            <h4 className="font-semibold mb-1">{p.name}</h4>
                            <div className="text-lg font-bold text-gradient">{p.revenue.toLocaleString()} ر.س</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

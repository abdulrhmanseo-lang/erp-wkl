import { useState, useEffect } from 'react';
import { campaigns } from '../data/mockData';
import { FiPlus, FiEdit, FiTrash2, FiPlay, FiPause, FiBarChart2, FiTarget, FiMousePointer, FiDollarSign, FiZap } from 'react-icons/fi';
import { apiFetch } from '../lib/api';

const statusMap = {
    active: { label: 'نشطة', badge: 'badge-success' },
    scheduled: { label: 'مجدولة', badge: 'badge-primary' },
    completed: { label: 'مكتملة', badge: 'badge-warning' },
    draft: { label: 'مسودة', badge: 'badge-danger' },
};

const adTypeMap = {
    'منشور اجتماعي': 'social',
    'إعلان واتساب': 'whatsapp',
    'إعلان جوجل': 'google',
    'بريد إلكتروني': 'email',
};

export default function Marketing() {
    const [desc, setDesc] = useState('');
    const [adLabel, setAdLabel] = useState('منشور اجتماعي');
    const [generated, setGenerated] = useState(
        '🌟 عرض حصري لعملائنا! خصم 30% على جميع خدماتنا لفترة محدودة. لا تفوّت الفرصة واحجز الآن! 📱 تواصل معنا عبر واتساب.'
    );
    const [suggestions, setSuggestions] = useState([]);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        reach: '57.5K',
        clicks: '4,090',
        conversions: '225',
        budget: '31K ر.س',
    });
    const [aiNotes, setAiNotes] = useState([]);

    useEffect(() => {
        let c = false;
        (async () => {
            try {
                const res = await apiFetch('/ai/marketing-overview');
                if (!res.ok || c) return;
                const d = await res.json();
                const t = d.totals || {};
                setStats({
                    reach: t.reach >= 1000 ? `${(t.reach / 1000).toFixed(1)}K` : String(t.reach),
                    clicks: (t.clicks || 0).toLocaleString(),
                    conversions: String(t.conversions ?? ''),
                    budget: `${((t.budget_sar || 0) / 1000).toFixed(0)}K ر.س`,
                });
                setAiNotes(d.ai_notes || []);
            } catch {
                /* افتراضي */
            }
        })();
        return () => {
            c = true;
        };
    }, []);

    const runGenerator = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/ai/generate-copy', {
                method: 'POST',
                body: JSON.stringify({
                    description: desc.trim() || 'منتج أو خدمة مميزة',
                    ad_type: adTypeMap[adLabel] || 'social',
                }),
            });
            const data = res.ok ? await res.json() : null;
            setGenerated(data?.generated_copy || generated);
            setSuggestions(data?.suggestions || []);
            setVariants(data?.variants || []);
        } catch {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-enter">
            <div className="page-header">
                <div>
                    <h1>التسويق الآلي</h1>
                    <p className="text-secondary">إنشاء وإدارة حملاتك التسويقية المدعومة بالذكاء الاصطناعي</p>
                </div>
                <button type="button" className="btn btn-primary">
                    <FiPlus size={18} /> حملة جديدة
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-4 gap-4 mb-6 stagger-children">
                {[
                    { label: 'الوصول الكلي', value: stats.reach, icon: FiTarget, color: '#0A84FF' },
                    { label: 'النقرات', value: stats.clicks, icon: FiMousePointer, color: '#34D399' },
                    { label: 'التحويلات', value: stats.conversions, icon: FiBarChart2, color: '#FBBF24' },
                    { label: 'الميزانية', value: stats.budget, icon: FiDollarSign, color: '#F87171' },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className="glass-card">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-secondary">{s.label}</span>
                                <Icon size={18} style={{ color: s.color }} />
                            </div>
                            <div className="text-2xl font-bold">{s.value}</div>
                        </div>
                    );
                })}
            </div>

            {aiNotes.length > 0 && (
                <div className="glass-card mb-6">
                    <h3 className="mb-2 text-sm flex items-center gap-2">
                        <FiZap className="text-gradient" /> ملاحظات استراتيجية من الخادم
                    </h3>
                    <ul className="text-sm text-secondary" style={{ margin: 0, paddingInlineStart: '1.25rem' }}>
                        {aiNotes.map((n, i) => (
                            <li key={i} style={{ marginBottom: 8 }}>{n}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Campaigns Table */}
            <div className="glass-card" style={{ padding: 0 }}>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>اسم الحملة</th>
                                <th>الحالة</th>
                                <th>الوصول</th>
                                <th>النقرات</th>
                                <th>التحويلات</th>
                                <th>الميزانية</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((c) => (
                                <tr key={c.id}>
                                    <td className="font-semibold">{c.name}</td>
                                    <td><span className={`badge ${statusMap[c.status].badge}`}>{statusMap[c.status].label}</span></td>
                                    <td>{c.reach.toLocaleString()}</td>
                                    <td>{c.clicks.toLocaleString()}</td>
                                    <td>{c.conversions}</td>
                                    <td>{c.budget.toLocaleString()} ر.س</td>
                                    <td>
                                        <div className="flex gap-1">
                                            {c.status === 'active' ? (
                                                <button type="button" className="btn btn-icon btn-ghost"><FiPause size={16} /></button>
                                            ) : c.status === 'draft' || c.status === 'scheduled' ? (
                                                <button type="button" className="btn btn-icon btn-ghost"><FiPlay size={16} /></button>
                                            ) : null}
                                            <button type="button" className="btn btn-icon btn-ghost"><FiEdit size={16} /></button>
                                            <button type="button" className="btn btn-icon btn-ghost" style={{ color: '#F87171' }}><FiTrash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Copy Generator */}
            <div className="glass-card mt-6">
                <h3 className="mb-4">🤖 مولّد النصوص الإعلانية بالذكاء الاصطناعي</h3>
                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                    <div className="flex-grow">
                        <div className="input-group">
                            <label>وصف المنتج أو الخدمة</label>
                            <textarea
                                className="input"
                                placeholder="اكتب وصفاً مختصراً للمنتج أو العرض..."
                                rows={3}
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ minWidth: 200 }}>
                        <div className="input-group">
                            <label>نوع الإعلان</label>
                            <select className="input" value={adLabel} onChange={(e) => setAdLabel(e.target.value)}>
                                <option>منشور اجتماعي</option>
                                <option>إعلان واتساب</option>
                                <option>إعلان جوجل</option>
                                <option>بريد إلكتروني</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button type="button" className="btn btn-primary mt-4" onClick={runGenerator} disabled={loading}>
                    {loading ? 'جاري التوليد…' : 'توليد النص الإعلاني ✨'}
                </button>

                <div className="generated-copy glass mt-4 p-4">
                    <p className="text-sm text-secondary mb-2">نص مقترح:</p>
                    <p className="font-medium">&quot;{generated}&quot;</p>
                    {variants.length > 0 && (
                        <div className="mt-3 text-sm text-secondary">
                            <p className="mb-1">مسودات إضافية:</p>
                            <ul style={{ margin: 0, paddingInlineStart: '1.25rem' }}>
                                {variants.map((v, i) => (
                                    <li key={i}>{v}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {suggestions.length > 0 && (
                        <ul className="text-sm mt-3 text-secondary" style={{ margin: 0, paddingInlineStart: '1.25rem' }}>
                            {suggestions.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

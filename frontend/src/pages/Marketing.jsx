import { campaigns } from '../data/mockData';
import { FiPlus, FiEdit, FiTrash2, FiPlay, FiPause, FiBarChart2, FiTarget, FiMousePointer, FiDollarSign } from 'react-icons/fi';

const statusMap = {
    active: { label: 'نشطة', badge: 'badge-success' },
    scheduled: { label: 'مجدولة', badge: 'badge-primary' },
    completed: { label: 'مكتملة', badge: 'badge-warning' },
    draft: { label: 'مسودة', badge: 'badge-danger' },
};

export default function Marketing() {
    return (
        <div className="page-enter">
            <div className="page-header">
                <div>
                    <h1>التسويق الآلي</h1>
                    <p className="text-secondary">إنشاء وإدارة حملاتك التسويقية المدعومة بالذكاء الاصطناعي</p>
                </div>
                <button className="btn btn-primary">
                    <FiPlus size={18} /> حملة جديدة
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-4 gap-4 mb-6 stagger-children">
                {[
                    { label: 'الوصول الكلي', value: '57.5K', icon: FiTarget, color: '#0A84FF' },
                    { label: 'النقرات', value: '4,090', icon: FiMousePointer, color: '#34D399' },
                    { label: 'التحويلات', value: '225', icon: FiBarChart2, color: '#FBBF24' },
                    { label: 'الميزانية', value: '31K ر.س', icon: FiDollarSign, color: '#F87171' },
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
                                                <button className="btn btn-icon btn-ghost"><FiPause size={16} /></button>
                                            ) : c.status === 'draft' || c.status === 'scheduled' ? (
                                                <button className="btn btn-icon btn-ghost"><FiPlay size={16} /></button>
                                            ) : null}
                                            <button className="btn btn-icon btn-ghost"><FiEdit size={16} /></button>
                                            <button className="btn btn-icon btn-ghost" style={{ color: '#F87171' }}><FiTrash2 size={16} /></button>
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
                            <textarea className="input" placeholder="اكتب وصفاً مختصراً للمنتج أو العرض..." rows={3} />
                        </div>
                    </div>
                    <div style={{ minWidth: 200 }}>
                        <div className="input-group">
                            <label>نوع الإعلان</label>
                            <select className="input">
                                <option>منشور اجتماعي</option>
                                <option>إعلان واتساب</option>
                                <option>إعلان جوجل</option>
                                <option>بريد إلكتروني</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary mt-4">توليد النص الإعلاني ✨</button>

                <div className="generated-copy glass mt-4 p-4">
                    <p className="text-sm text-secondary mb-2">نص مقترح:</p>
                    <p className="font-medium">"🌟 عرض حصري لعملائنا! خصم 30% على جميع خدماتنا لفترة محدودة. لا تفوّت الفرصة واحجز الآن! 📱 تواصل معنا عبر واتساب."</p>
                </div>
            </div>
        </div>
    );
}

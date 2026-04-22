import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiSearch, FiPhone, FiMail, FiX, FiCheck, FiGlobe } from 'react-icons/fi';

const sourceLabels = { website: 'الموقع', referral: 'إحالة', social: 'سوشيال ميديا', cold_call: 'اتصال مباشر' };
const statusLabels = { active: 'نشط', inactive: 'غير نشط', lead: 'محتمل', prospect: 'فرصة' };
const statusColors = { active: '#22c55e', inactive: '#6b7280', lead: '#f59e0b', prospect: '#3b82f6' };

export default function Clients() {
    const { API_URL, user } = useAuth();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', source: 'website', notes: '' });

    const tenantId = user?.tenant_id || 1;

    const fetchClients = async () => {
        try {
            const res = await fetch(`${API_URL}/clients/?tenant_id=${tenantId}`);
            const data = await res.json();
            setClients(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchClients(); }, []);

    const handleSave = async () => {
        const url = editingId ? `${API_URL}/clients/${editingId}` : `${API_URL}/clients/?tenant_id=${tenantId}`;
        const method = editingId ? 'PUT' : 'POST';
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        setShowModal(false);
        setEditingId(null);
        setForm({ name: '', email: '', phone: '', company: '', source: 'website', notes: '' });
        fetchClients();
    };

    const handleEdit = (c) => {
        setForm({ name: c.name, email: c.email || '', phone: c.phone || '', company: c.company || '', source: c.source || 'website', notes: c.notes || '' });
        setEditingId(c.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;
        await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE' });
        fetchClients();
    };

    const filtered = clients.filter(c => c.name.includes(search) || (c.company || '').includes(search) || (c.phone || '').includes(search));

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1><FiUsers style={{ display: 'inline', marginLeft: '8px' }} /> إدارة العملاء (CRM)</h1>
                    <p className="text-secondary">{clients.length} عميل • إجمالي الإيرادات: {clients.reduce((s, c) => s + (c.total_revenue || 0), 0).toLocaleString()} ر.س</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setForm({ name: '', email: '', phone: '', company: '', source: 'website', notes: '' }); setEditingId(null); setShowModal(true); }}>
                    <FiPlus /> إضافة عميل
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="card glass p-4">
                    <p className="text-secondary text-sm">إجمالي العملاء</p>
                    <h2 className="text-gradient">{clients.length}</h2>
                </div>
                <div className="card glass p-4">
                    <p className="text-secondary text-sm">عملاء نشطون</p>
                    <h2 style={{ color: '#22c55e' }}>{clients.filter(c => c.status === 'active').length}</h2>
                </div>
                <div className="card glass p-4">
                    <p className="text-secondary text-sm">إجمالي الإيرادات</p>
                    <h2 className="text-gradient">{clients.reduce((s, c) => s + (c.total_revenue || 0), 0).toLocaleString()} ر.س</h2>
                </div>
            </div>

            <div className="card glass" style={{ marginBottom: '16px', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiSearch />
                    <input type="text" className="input" placeholder="بحث بالاسم أو الشركة أو الجوال..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', flex: 1 }} />
                </div>
            </div>

            {loading ? <p className="text-secondary">جاري التحميل...</p> : (
                <div className="card glass">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '12px', textAlign: 'right' }}>العميل</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>الشركة</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>المصدر</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>الإيرادات</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>الحالة</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '12px' }}>
                                        <div>
                                            <strong>{c.name}</strong>
                                            {c.phone && <p className="text-secondary text-xs">{c.phone}</p>}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>{c.company || '—'}</td>
                                    <td style={{ padding: '12px' }}>{sourceLabels[c.source] || c.source || '—'}</td>
                                    <td style={{ padding: '12px' }}>{(c.total_revenue || 0).toLocaleString()} ر.س</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ color: statusColors[c.status] || '#888', fontWeight: 600 }}>{statusLabels[c.status] || c.status}</span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(c)}><FiEdit2 /></button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(c.id)} style={{ color: '#ef4444' }}><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }} className="text-secondary">لا يوجد عملاء</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card glass-strong" style={{ width: '90%', maxWidth: '500px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3>{editingId ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input className="input" placeholder="اسم العميل *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            <input className="input" placeholder="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} dir="ltr" />
                            <input className="input" placeholder="رقم الجوال" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} dir="ltr" />
                            <input className="input" placeholder="اسم الشركة" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                            <select className="input" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                                <option value="website">الموقع</option>
                                <option value="referral">إحالة</option>
                                <option value="social">سوشيال ميديا</option>
                                <option value="cold_call">اتصال مباشر</option>
                            </select>
                            <textarea className="input" placeholder="ملاحظات" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
                            <button className="btn btn-primary" onClick={handleSave} disabled={!form.name}>
                                <FiCheck /> {editingId ? 'حفظ التعديلات' : 'إضافة العميل'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

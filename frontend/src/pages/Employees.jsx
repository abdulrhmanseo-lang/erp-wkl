import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiSearch, FiPhone, FiMail, FiBriefcase, FiX, FiCheck } from 'react-icons/fi';

export default function Employees() {
    const { API_URL, user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', position: '', department: '', salary: 0, national_id: '' });

    const tenantId = user?.tenant_id || 1;

    const fetchEmployees = async () => {
        try {
            const res = await fetch(`${API_URL}/employees/?tenant_id=${tenantId}`);
            const data = await res.json();
            setEmployees(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchEmployees(); }, []);

    const handleSave = async () => {
        const url = editingId ? `${API_URL}/employees/${editingId}` : `${API_URL}/employees/?tenant_id=${tenantId}`;
        const method = editingId ? 'PUT' : 'POST';
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        setShowModal(false);
        setEditingId(null);
        setForm({ full_name: '', email: '', phone: '', position: '', department: '', salary: 0, national_id: '' });
        fetchEmployees();
    };

    const handleEdit = (emp) => {
        setForm({ full_name: emp.full_name, email: emp.email || '', phone: emp.phone || '', position: emp.position || '', department: emp.department || '', salary: emp.salary || 0, national_id: emp.national_id || '' });
        setEditingId(emp.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;
        await fetch(`${API_URL}/employees/${id}`, { method: 'DELETE' });
        fetchEmployees();
    };

    const filtered = employees.filter(e => e.full_name.includes(search) || (e.position || '').includes(search) || (e.department || '').includes(search));

    const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];
    const activeCount = employees.filter(e => e.status === 'active').length;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1><FiUsers style={{ display: 'inline', marginLeft: '8px' }} /> إدارة الموظفين</h1>
                    <p className="text-secondary">{employees.length} موظف • {activeCount} نشط • {departments.length} أقسام</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setForm({ full_name: '', email: '', phone: '', position: '', department: '', salary: 0, national_id: '' }); setEditingId(null); setShowModal(true); }}>
                    <FiPlus /> إضافة موظف
                </button>
            </div>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="card glass p-4">
                    <p className="text-secondary text-sm">إجمالي الموظفين</p>
                    <h2 className="text-gradient">{employees.length}</h2>
                </div>
                <div className="card glass p-4">
                    <p className="text-secondary text-sm">الأقسام</p>
                    <h2 className="text-gradient">{departments.length}</h2>
                </div>
                <div className="card glass p-4">
                    <p className="text-secondary text-sm">إجمالي الرواتب</p>
                    <h2 className="text-gradient">{employees.reduce((s, e) => s + (e.salary || 0), 0).toLocaleString()} ر.س</h2>
                </div>
            </div>

            <div className="card glass" style={{ marginBottom: '16px', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiSearch />
                    <input type="text" className="input" placeholder="بحث بالاسم أو القسم أو المنصب..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', flex: 1 }} />
                </div>
            </div>

            {loading ? <p className="text-secondary">جاري التحميل...</p> : (
                <div className="card glass">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '12px', textAlign: 'right' }}>الموظف</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>المنصب</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>القسم</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>الراتب</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>الحالة</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(emp => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '12px' }}>
                                        <div>
                                            <strong>{emp.full_name}</strong>
                                            {emp.email && <p className="text-secondary text-xs">{emp.email}</p>}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>{emp.position || '—'}</td>
                                    <td style={{ padding: '12px' }}>{emp.department || '—'}</td>
                                    <td style={{ padding: '12px' }}>{(emp.salary || 0).toLocaleString()} ر.س</td>
                                    <td style={{ padding: '12px' }}>
                                        <span className={`badge ${emp.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{emp.status === 'active' ? 'نشط' : emp.status}</span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(emp)}><FiEdit2 /></button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(emp.id)} style={{ color: '#ef4444' }}><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }} className="text-secondary">لا يوجد موظفين</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card glass-strong" style={{ width: '90%', maxWidth: '500px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3>{editingId ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input className="input" placeholder="الاسم الكامل *" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
                            <input className="input" placeholder="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} dir="ltr" />
                            <input className="input" placeholder="رقم الجوال" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} dir="ltr" />
                            <input className="input" placeholder="المنصب" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
                            <input className="input" placeholder="القسم" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
                            <input className="input" type="number" placeholder="الراتب" value={form.salary} onChange={e => setForm({ ...form, salary: parseFloat(e.target.value) || 0 })} dir="ltr" />
                            <input className="input" placeholder="رقم الهوية" value={form.national_id} onChange={e => setForm({ ...form, national_id: e.target.value })} dir="ltr" />
                            <button className="btn btn-primary" onClick={handleSave} disabled={!form.full_name}>
                                <FiCheck /> {editingId ? 'حفظ التعديلات' : 'إضافة الموظف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

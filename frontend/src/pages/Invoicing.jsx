import { useState, useEffect } from 'react';
import { FiPlus, FiEye, FiTrash2, FiDollarSign, FiClock, FiAlertTriangle, FiCheck, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { apiV1, apiFetch } from '../lib/api';

const statusMap = {
    paid: { label: 'مدفوعة', badge: 'badge-success', icon: FiCheck },
    pending: { label: 'معلقة', badge: 'badge-warning', icon: FiClock },
    overdue: { label: 'متأخرة', badge: 'badge-danger', icon: FiAlertTriangle },
};

export default function Invoicing() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [showCreate, setShowCreate] = useState(false);

    // Form state
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [copilot, setCopilot] = useState(null);

    const fetchInvoices = async () => {
        try {
            const res = await fetch(apiV1('/invoices/'));
            const data = await res.json();
            setInvoices(data.invoices || []);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        let c = false;
        (async () => {
            try {
                const res = await apiFetch('/ai/invoicing-copilot');
                if (!res.ok || c) return;
                setCopilot(await res.json());
            } catch {
                /* ignore */
            }
        })();
        return () => {
            c = true;
        };
    }, []);

    const handleCreate = async () => {
        if (!clientName || !amount) {
            alert('يجب إدخال اسم العميل والمبلغ');
            return;
        }

        try {
            const res = await fetch(apiV1('/invoices/'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenant_id: user?.tenant_id || 1,
                    client_name: clientName,
                    client_phone: clientPhone,
                    amount: parseFloat(amount),
                    notes: notes,
                })
            });
            if (res.ok) {
                setShowCreate(false);
                setClientName('');
                setClientPhone('');
                setAmount('');
                setNotes('');
                fetchInvoices();
            }
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
    const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.total, 0);
    const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0);

    return (
        <div className="page-enter">
            <div className="page-header">
                <div>
                    <h1>نظام الفواتير</h1>
                    <p className="text-secondary">إنشاء وإدارة الفواتير المتوافقة مع ضريبة القيمة المضافة</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
                    <FiPlus size={18} /> فاتورة جديدة
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-3 gap-4 mb-6 stagger-children">
                <div className="glass-card">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="kpi-icon-wrap" style={{ background: 'rgba(52,211,153,0.15)' }}><FiDollarSign style={{ color: '#34D399' }} /></div>
                        <span className="text-secondary">المدفوعة</span>
                    </div>
                    <div className="text-2xl font-bold">{totalPaid.toLocaleString()} ر.س</div>
                </div>
                <div className="glass-card">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="kpi-icon-wrap" style={{ background: 'rgba(251,191,36,0.15)' }}><FiClock style={{ color: '#FBBF24' }} /></div>
                        <span className="text-secondary">المعلقة</span>
                    </div>
                    <div className="text-2xl font-bold">{totalPending.toLocaleString()} ر.س</div>
                </div>
                <div className="glass-card">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="kpi-icon-wrap" style={{ background: 'rgba(248,113,113,0.15)' }}><FiAlertTriangle style={{ color: '#F87171' }} /></div>
                        <span className="text-secondary">المتأخرة</span>
                    </div>
                    <div className="text-2xl font-bold">{totalOverdue.toLocaleString()} ر.س</div>
                </div>
            </div>

            {copilot && (
                <div className="glass-card mb-6">
                    <h3 className="mb-3 flex items-center gap-2">
                        <FiZap className="text-gradient" /> مساعد الفواتير والتحصيل
                    </h3>
                    <ul className="text-sm text-secondary" style={{ margin: '0 0 8px', paddingInlineStart: '1.25rem' }}>
                        {(copilot.dunning || []).map((line, i) => (
                            <li key={i} style={{ marginBottom: 6 }}>{line}</li>
                        ))}
                    </ul>
                    <p className="text-sm">{copilot.cash_flow}</p>
                    <p className="text-xs text-muted mt-2">{copilot.vat_tip}</p>
                </div>
            )}

            {/* Create Invoice Form */}
            {showCreate && (
                <div className="glass-card mb-6 animate-fade-in-up">
                    <h3 className="mb-4">إنشاء فاتورة جديدة</h3>
                    <div className="grid grid-2 gap-4">
                        <div className="input-group">
                            <label>اسم العميل</label>
                            <input className="input" placeholder="اسم الشركة أو العميل" value={clientName} onChange={e => setClientName(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>رقم الجوال</label>
                            <input className="input" placeholder="05xxxxxxxx" dir="ltr" value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>المبلغ الأساسي (ر.س)</label>
                            <input className="input" type="number" placeholder="0.00" dir="ltr" value={amount} onChange={e => setAmount(e.target.value)} />
                        </div>
                    </div>
                    <div className="input-group mt-4">
                        <label>ملاحظات</label>
                        <textarea className="input" placeholder="ملاحظات إضافية..." rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button className="btn btn-primary" onClick={handleCreate}>حفظ وإصدار</button>
                        <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>إلغاء</button>
                    </div>
                    <p className="text-xs text-muted mt-2">* يتم احتساب ضريبة القيمة المضافة (15%) للإجمالي تلقائياً</p>
                </div>
            )}

            {/* Invoices Table */}
            <div className="glass-card" style={{ padding: 0 }}>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>رقم الفاتورة</th>
                                <th>العميل</th>
                                <th>المبلغ</th>
                                <th>الضريبة (15%)</th>
                                <th>الإجمالي</th>
                                <th>الحالة</th>
                                <th>تاريخ الإصدار</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center p-4 text-muted">لا يوجد فواتير حاليا. قم بإنشاء أول فاتورة!</td>
                                </tr>
                            ) : null}
                            {invoices.map((inv) => {
                                const Status = statusMap[inv.status] || statusMap.pending;
                                return (
                                    <tr key={inv.id}>
                                        <td className="font-semibold" dir="ltr" style={{ textAlign: 'right' }}>{inv.invoice_number}</td>
                                        <td>{inv.client_name}</td>
                                        <td>{inv.amount.toLocaleString()} ر.س</td>
                                        <td>{inv.vat_amount.toLocaleString()} ر.س</td>
                                        <td className="font-semibold">{inv.total.toLocaleString()} ر.س</td>
                                        <td><span className={`badge ${Status.badge}`}>{Status.label}</span></td>
                                        <td className="text-muted" dir="ltr" style={{ textAlign: 'right' }}>{inv.created_at?.split('T')[0]}</td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button className="btn btn-icon btn-ghost"><FiEye size={16} /></button>
                                                <button className="btn btn-icon btn-ghost" style={{ color: '#F87171' }}><FiTrash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { invoices } from '../data/mockData';
import { FiPlus, FiDownload, FiEye, FiTrash2, FiDollarSign, FiClock, FiAlertTriangle, FiCheck } from 'react-icons/fi';

const statusMap = {
    paid: { label: 'مدفوعة', badge: 'badge-success', icon: FiCheck },
    pending: { label: 'معلقة', badge: 'badge-warning', icon: FiClock },
    overdue: { label: 'متأخرة', badge: 'badge-danger', icon: FiAlertTriangle },
};

export default function Invoicing() {
    const [showCreate, setShowCreate] = useState(false);

    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
    const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
    const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

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

            {/* Create Invoice Form */}
            {showCreate && (
                <div className="glass-card mb-6 animate-fade-in-up">
                    <h3 className="mb-4">إنشاء فاتورة جديدة</h3>
                    <div className="grid grid-2 gap-4">
                        <div className="input-group"><label>اسم العميل</label><input className="input" placeholder="اسم الشركة أو العميل" /></div>
                        <div className="input-group"><label>رقم الجوال</label><input className="input" placeholder="05xxxxxxxx" dir="ltr" /></div>
                        <div className="input-group"><label>المبلغ (ر.س)</label><input className="input" type="number" placeholder="0.00" dir="ltr" /></div>
                        <div className="input-group"><label>تاريخ الاستحقاق</label><input className="input" type="date" dir="ltr" /></div>
                    </div>
                    <div className="input-group mt-4"><label>ملاحظات</label><textarea className="input" placeholder="ملاحظات إضافية..." rows={2} /></div>
                    <div className="flex gap-2 mt-4">
                        <button className="btn btn-primary">حفظ وإرسال</button>
                        <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>إلغاء</button>
                    </div>
                    <p className="text-xs text-muted mt-2">* يتم احتساب ضريبة القيمة المضافة (15%) تلقائياً</p>
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
                                <th>التاريخ</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv) => {
                                const Status = statusMap[inv.status];
                                return (
                                    <tr key={inv.id}>
                                        <td className="font-semibold">{inv.id}</td>
                                        <td>{inv.client}</td>
                                        <td>{inv.amount.toLocaleString()} ر.س</td>
                                        <td>{inv.vat.toLocaleString()} ر.س</td>
                                        <td className="font-semibold">{(inv.amount + inv.vat).toLocaleString()} ر.س</td>
                                        <td><span className={`badge ${Status.badge}`}>{Status.label}</span></td>
                                        <td className="text-muted">{inv.date}</td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button className="btn btn-icon btn-ghost"><FiEye size={16} /></button>
                                                <button className="btn btn-icon btn-ghost"><FiDownload size={16} /></button>
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

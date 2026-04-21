import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { clinicData, realEstateData, workshopData, ecommerceData } from '../data/mockData';
import { FiUsers, FiCalendar, FiClock, FiPhone, FiHome, FiTrendingUp, FiDollarSign, FiTool, FiPackage, FiShoppingCart, FiAlertTriangle, FiCpu } from 'react-icons/fi';
import { apiFetch } from '../lib/api';

function ClinicModule() {
    return (
        <>
            <div className="grid grid-3 gap-4 mb-6 stagger-children">
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiCalendar style={{ color: '#0A84FF' }} /><span className="text-secondary">مواعيد اليوم</span></div><div className="text-2xl font-bold">{clinicData.todayAppointments}</div></div>
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiClock style={{ color: '#34D399' }} /><span className="text-secondary">مواعيد الأسبوع</span></div><div className="text-2xl font-bold">{clinicData.weekAppointments}</div></div>
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiUsers style={{ color: '#FBBF24' }} /><span className="text-secondary">إجمالي المرضى</span></div><div className="text-2xl font-bold">{clinicData.totalPatients}</div></div>
            </div>
            <div className="glass-card" style={{ padding: 0 }}>
                <div className="p-6"><h3>قائمة المرضى</h3></div>
                <div className="table-container">
                    <table>
                        <thead><tr><th>الاسم</th><th>رقم الجوال</th><th>آخر زيارة</th><th>الموعد القادم</th><th>الحالة</th></tr></thead>
                        <tbody>
                            {clinicData.patients.map(p => (
                                <tr key={p.id}>
                                    <td className="font-semibold">{p.name}</td>
                                    <td dir="ltr">{p.phone}</td>
                                    <td>{p.lastVisit}</td>
                                    <td>{p.nextAppt || '—'}</td>
                                    <td><span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{p.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

function RealEstateModule() {
    return (
        <>
            <div className="grid grid-3 gap-4 mb-6 stagger-children">
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiHome style={{ color: '#0A84FF' }} /><span className="text-secondary">العقارات</span></div><div className="text-2xl font-bold">{realEstateData.totalListings}</div></div>
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiUsers style={{ color: '#34D399' }} /><span className="text-secondary">عملاء محتملين</span></div><div className="text-2xl font-bold">{realEstateData.activeLeads}</div></div>
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiDollarSign style={{ color: '#FBBF24' }} /><span className="text-secondary">العمولات</span></div><div className="text-2xl font-bold">{realEstateData.totalCommissions.toLocaleString()} ر.س</div></div>
            </div>
            <div className="grid grid-2 gap-4 stagger-children">
                {realEstateData.properties.map(p => (
                    <div key={p.id} className="glass-card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="badge badge-primary">{p.type}</span>
                            <span className={`badge ${p.status === 'available' ? 'badge-success' : p.status === 'reserved' ? 'badge-warning' : 'badge-danger'}`}>
                                {p.status === 'available' ? 'متاح' : p.status === 'reserved' ? 'محجوز' : 'مباع'}
                            </span>
                        </div>
                        <h4 className="font-semibold mb-2">{p.title}</h4>
                        <div className="flex gap-4 text-sm text-secondary mb-2">
                            <span>{p.area} م²</span>
                            {p.bedrooms > 0 && <span>{p.bedrooms} غرف</span>}
                        </div>
                        <div className="text-xl font-bold text-gradient">{p.price.toLocaleString()} ر.س</div>
                    </div>
                ))}
            </div>
        </>
    );
}

function WorkshopModule() {
    const statusMap = { 'in-progress': { l: 'قيد العمل', b: 'badge-primary' }, completed: { l: 'مكتمل', b: 'badge-success' }, waiting: { l: 'بانتظار', b: 'badge-warning' } };
    return (
        <>
            <div className="grid grid-3 gap-4 mb-6 stagger-children">
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiTool style={{ color: '#0A84FF' }} /><span className="text-secondary">خدمات اليوم</span></div><div className="text-2xl font-bold">{workshopData.todayServices}</div></div>
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiAlertTriangle style={{ color: '#F87171' }} /><span className="text-secondary">قطع منخفضة</span></div><div className="text-2xl font-bold">{workshopData.partsLowStock}</div></div>
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiDollarSign style={{ color: '#34D399' }} /><span className="text-secondary">إيرادات الشهر</span></div><div className="text-2xl font-bold">{workshopData.monthRevenue.toLocaleString()} ر.س</div></div>
            </div>
            <div className="glass-card" style={{ padding: 0 }}>
                <div className="p-6"><h3>الخدمات الحالية</h3></div>
                <div className="table-container">
                    <table>
                        <thead><tr><th>السيارة</th><th>المالك</th><th>الخدمة</th><th>الحالة</th><th>التاريخ</th></tr></thead>
                        <tbody>
                            {workshopData.services.map(s => (
                                <tr key={s.id}>
                                    <td className="font-semibold">{s.car}</td>
                                    <td>{s.owner}</td>
                                    <td>{s.service}</td>
                                    <td><span className={`badge ${statusMap[s.status].b}`}>{statusMap[s.status].l}</span></td>
                                    <td className="text-muted">{s.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

function EcommerceModule() {
    return (
        <>
            <div className="grid grid-3 gap-4 mb-6 stagger-children">
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiShoppingCart style={{ color: '#0A84FF' }} /><span className="text-secondary">الطلبات</span></div><div className="text-2xl font-bold">{ecommerceData.totalOrders}</div><div className="text-xs text-muted">{ecommerceData.pendingOrders} معلق</div></div>
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiPackage style={{ color: '#34D399' }} /><span className="text-secondary">المنتجات</span></div><div className="text-2xl font-bold">{ecommerceData.products.length}</div></div>
                <div className="glass-card"><div className="flex items-center gap-3 mb-2"><FiDollarSign style={{ color: '#FBBF24' }} /><span className="text-secondary">إيرادات الشهر</span></div><div className="text-2xl font-bold">{ecommerceData.monthRevenue.toLocaleString()} ر.س</div></div>
            </div>
            <div className="glass-card" style={{ padding: 0 }}>
                <div className="p-6"><h3>المنتجات</h3></div>
                <div className="table-container">
                    <table>
                        <thead><tr><th>المنتج</th><th>الفئة</th><th>السعر</th><th>المخزون</th><th>المبيعات</th><th>الإيرادات</th></tr></thead>
                        <tbody>
                            {ecommerceData.products.map(p => (
                                <tr key={p.id}>
                                    <td className="font-semibold">{p.name}</td>
                                    <td><span className="badge badge-primary">{p.category}</span></td>
                                    <td>{p.price} ر.س</td>
                                    <td><span className={p.stock < 15 ? 'text-warning' : ''} style={{ color: p.stock < 15 ? '#F87171' : undefined }}>{p.stock}</span></td>
                                    <td>{p.sold}</td>
                                    <td className="font-semibold">{(p.price * p.sold).toLocaleString()} ر.س</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default function SectorModule() {
    const { user } = useAuth();
    const sector = user?.sector || 'clinic';
    const [brief, setBrief] = useState(null);

    useEffect(() => {
        let c = false;
        (async () => {
            try {
                const res = await apiFetch(`/ai/sector-brief?sector=${encodeURIComponent(sector)}`);
                if (!res.ok || c) return;
                setBrief(await res.json());
            } catch {
                /* ignore */
            }
        })();
        return () => {
            c = true;
        };
    }, [sector]);

    const titles = {
        clinic: { name: 'وحدة العيادات', desc: 'إدارة المرضى والمواعيد', icon: '🧑‍⚕️' },
        real_estate: { name: 'وحدة العقارات', desc: 'إدارة العقارات والعملاء', icon: '🏗' },
        workshop: { name: 'وحدة الورش', desc: 'تتبع الصيانة والمخزون', icon: '🚗' },
        ecommerce: { name: 'وحدة التجارة الإلكترونية', desc: 'إدارة المنتجات والطلبات', icon: '🛒' },
    };

    const info = titles[sector] || titles.clinic;

    return (
        <div className="page-enter">
            <div className="page-header">
                <div>
                    <h1>{info.icon} {info.name}</h1>
                    <p className="text-secondary">{info.desc}</p>
                </div>
            </div>
            {brief && (
                <div className="glass-card mb-6">
                    <h3 className="mb-2 text-sm flex items-center gap-2"><FiCpu /> لمحة القطاع من الوكلاء</h3>
                    <p className="text-sm" style={{ margin: '0 0 8px' }}>{brief.brief}</p>
                    <p className="text-xs text-muted" style={{ margin: 0 }}>
                        مؤشرات للمتابعة: {(brief.kpis_watch || []).join('، ')}
                    </p>
                </div>
            )}
            {sector === 'clinic' && <ClinicModule />}
            {sector === 'real_estate' && <RealEstateModule />}
            {sector === 'workshop' && <WorkshopModule />}
            {sector === 'ecommerce' && <EcommerceModule />}
        </div>
    );
}

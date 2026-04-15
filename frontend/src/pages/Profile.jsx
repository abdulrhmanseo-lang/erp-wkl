import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiShield, FiKey, FiSmartphone, FiClock, FiCheckCircle } from 'react-icons/fi';

export default function Profile() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="page-enter">
            <div className="profile-cover">
                <div className="bg-aurora opacity-50" />
            </div>

            <div className="profile-header glass-card">
                <div className="profile-avatar-container">
                    <div className="profile-avatar-large">
                        {user?.name?.charAt(0) || '؟'}
                    </div>
                </div>
                <div className="profile-info-main">
                    <h1>{user?.name}</h1>
                    <p className="text-secondary flex items-center gap-2">
                        <FiMail /> {user?.email}
                    </p>
                    <div className="flex gap-2 mt-3">
                        <span className="badge badge-primary">
                            <FiShield size={12} /> {user?.role === 'super_admin' ? 'مدير النظام' : user?.role === 'company_owner' ? 'صاحب شركة' : 'موظف'}
                        </span>
                        <span className="badge badge-success">حساب نشط</span>
                    </div>
                </div>
            </div>

            <div className="profile-nav mt-6 mb-6">
                <button className={`profile-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                    <FiUser /> نظرة عامة
                </button>
                <button className={`profile-nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                    <FiKey /> الأمان وكلمة المرور
                </button>
                <button className={`profile-nav-item ${activeTab === 'devices' ? 'active' : ''}`} onClick={() => setActiveTab('devices')}>
                    <FiSmartphone /> الأجهزة المتصلة
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-2 gap-6 stagger-children">
                    <div className="glass-card">
                        <h3 className="mb-4">المعلومات الشخصية</h3>
                        <div className="flex flex-col gap-4">
                            <div className="input-group">
                                <label>الاسم الكامل</label>
                                <input className="input" defaultValue={user?.name} />
                            </div>
                            <div className="input-group">
                                <label>البريد الإلكتروني</label>
                                <input className="input" defaultValue={user?.email} dir="ltr" readOnly />
                            </div>
                            <div className="input-group">
                                <label>رقم الجوال</label>
                                <input className="input" defaultValue="+966 50 000 0000" dir="ltr" />
                            </div>
                            <button className="btn btn-primary mt-2 w-max">حفظ التغييرات</button>
                        </div>
                    </div>
                    <div className="glass-card">
                        <h3 className="mb-4">نشاط الحساب</h3>
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-icon bg-success-light text-success"><FiCheckCircle size={14} /></div>
                                <div className="timeline-content">
                                    <p>تسجيل دخول ناجح</p>
                                    <span className="text-xs text-muted">منذ ساعتين - ج الرياض، السعودية</span>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-icon bg-primary-light text-primary"><FiShield size={14} /></div>
                                <div className="timeline-content">
                                    <p>تغيير صلاحيات الحساب</p>
                                    <span className="text-xs text-muted">منذ يومين</span>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-icon bg-warning-light text-warning"><FiClock size={14} /></div>
                                <div className="timeline-content">
                                    <p>طُلب إعادة تعيين كلمة المرور</p>
                                    <span className="text-xs text-muted">الأسبوع الماضي</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="glass-card max-w-2xl">
                    <h3 className="mb-4">تغيير كلمة المرور</h3>
                    <div className="flex flex-col gap-4">
                        <div className="input-group">
                            <label>كلمة المرور الحالية</label>
                            <input type="password" className="input" placeholder="••••••••" />
                        </div>
                        <div className="input-group">
                            <label>كلمة المرور الجديدة</label>
                            <input type="password" className="input" placeholder="••••••••" />
                        </div>
                        <div className="input-group">
                            <label>تأكيد كلمة المرور الجديدة</label>
                            <input type="password" className="input" placeholder="••••••••" />
                        </div>
                        <button className="btn btn-primary mt-2">تحديث كلمة المرور</button>
                    </div>
                </div>
            )}

            {activeTab === 'devices' && (
                <div className="glass-card">
                    <h3 className="mb-4">الأجهزة المتصلة مؤخراً</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 glass" style={{ borderRadius: 'var(--radius-md)' }}>
                            <div className="flex items-center gap-4">
                                <div className="text-primary" style={{ fontSize: '2rem' }}><FiSmartphone /></div>
                                <div>
                                    <p className="font-semibold">iPhone 14 Pro</p>
                                    <p className="text-sm text-secondary">الرياض، السعودية • تطبيق Safari</p>
                                </div>
                            </div>
                            <span className="badge badge-success">النشط الآن</span>
                        </div>
                        <div className="flex items-center justify-between p-4 glass" style={{ borderRadius: 'var(--radius-md)' }}>
                            <div className="flex items-center gap-4">
                                <div className="text-muted" style={{ fontSize: '2rem' }}><FiSmartphone /></div>
                                <div>
                                    <p className="font-semibold">MacBook Pro M2</p>
                                    <p className="text-sm text-secondary">الرياض، السعودية • Chrome</p>
                                </div>
                            </div>
                            <span className="text-sm text-muted">منذ 3 أيام</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

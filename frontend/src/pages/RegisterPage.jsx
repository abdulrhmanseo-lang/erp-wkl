import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiBriefcase, FiArrowLeft, FiFileText, FiHash, FiShield } from 'react-icons/fi';

const sectors = [
    { id: 'clinic', label: 'عيادة', icon: '🧑‍⚕️' },
    { id: 'real_estate', label: 'عقارات', icon: '🏗' },
    { id: 'workshop', label: 'ورشة', icon: '🚗' },
    { id: 'ecommerce', label: 'تجارة إلكترونية', icon: '🛒' },
];

const entityTypes = [
    { id: 'company', label: 'شركة🏢' },
    { id: 'establishment', label: 'مؤسسة🏪' },
    { id: 'individual', label: 'فرد👩‍💻' }
];

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        entityType: 'company',
        companyName: '',
        crNumber: '',
        taxNumber: '',
        sector: 'ecommerce',
    });

    const updateForm = (field, value) => setForm({ ...form, [field]: value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
            return;
        }
        setLoading(true);
        try {
            await register({
                full_name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
                entity_type: form.entityType,
                company_name: form.entityType === 'individual' ? form.name : form.companyName,
                cr_number: form.crNumber,
                tax_number: form.taxNumber,
                sector: form.sector
            });
            navigate('/app');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="bg-aurora" />
            <div className="bg-grid" />
            <div className="auth-container animate-fade-in-up">
                <div className="auth-card glass-strong" style={{ width: '100%', maxWidth: '500px' }}>
                    <div className="auth-header">
                        <div className="landing-logo justify-center mb-6">
                            <span className="wkl-brand">وكل</span>
                        </div>
                        <h2>{step === 1 ? 'إنشاء حساب جديد' : 'بيانات النشاط'}</h2>
                        <p className="text-secondary">
                            {step === 1 ? 'أدخل بياناتك الشخصية للبدء' : 'أخبرنا عن نشاطك التجاري'}
                        </p>
                        <div className="step-indicator">
                            <div className={`step-dot ${step >= 1 ? 'step-active' : ''}`}>1</div>
                            <div className="step-line" />
                            <div className={`step-dot ${step >= 2 ? 'step-active' : ''}`}>2</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {step === 1 ? (
                            <>
                                <div className="input-group">
                                    <label>الاسم الكامل</label>
                                    <div className="input-icon-wrapper">
                                        <FiUser className="input-icon" />
                                        <input type="text" className="input input-with-icon" placeholder="محمد أحمد" value={form.name} onChange={(e) => updateForm('name', e.target.value)} required />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>البريد الإلكتروني</label>
                                    <div className="input-icon-wrapper">
                                        <FiMail className="input-icon" />
                                        <input type="email" className="input input-with-icon" placeholder="example@company.com" value={form.email} onChange={(e) => updateForm('email', e.target.value)} required dir="ltr" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>رقم الجوال (اختياري)</label>
                                    <input type="tel" className="input" placeholder="05xxxxxxxx" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} dir="ltr" />
                                </div>
                                <div className="input-group">
                                    <label>كلمة المرور</label>
                                    <div className="input-icon-wrapper">
                                        <FiLock className="input-icon" />
                                        <input type="password" className="input input-with-icon" placeholder="••••••••" value={form.password} onChange={(e) => updateForm('password', e.target.value)} required dir="ltr" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="input-group">
                                    <label>نوع النشاط</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                        {entityTypes.map(t => (
                                            <button
                                                key={t.id} type="button"
                                                className={`btn ${form.entityType === t.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                                onClick={() => updateForm('entityType', t.id)}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {form.entityType !== 'individual' && (
                                    <div className="input-group">
                                        <label>{form.entityType === 'company' ? 'اسم الشركة' : 'اسم المؤسسة'}</label>
                                        <div className="input-icon-wrapper">
                                            <FiBriefcase className="input-icon" />
                                            <input type="text" className="input input-with-icon" placeholder="الاسم التجاري" value={form.companyName} onChange={(e) => updateForm('companyName', e.target.value)} required />
                                        </div>
                                    </div>
                                )}

                                {(form.entityType === 'company' || form.entityType === 'establishment') && (
                                    <div className="input-group">
                                        <label>السجل التجاري (اختياري)</label>
                                        <div className="input-icon-wrapper">
                                            <FiFileText className="input-icon" />
                                            <input type="text" className="input input-with-icon" placeholder="1010xxxxxx" value={form.crNumber} onChange={(e) => updateForm('crNumber', e.target.value)} />
                                        </div>
                                    </div>
                                )}

                                {form.entityType === 'company' && (
                                    <div className="input-group">
                                        <label>الرقم الضريبي (اختياري)</label>
                                        <div className="input-icon-wrapper">
                                            <FiHash className="input-icon" />
                                            <input type="text" className="input input-with-icon" placeholder="30xxxxxxxx" value={form.taxNumber} onChange={(e) => updateForm('taxNumber', e.target.value)} />
                                        </div>
                                    </div>
                                )}

                                <div className="input-group mb-5">
                                    <label>القطاع المستهدف</label>
                                    <div className="sector-grid">
                                        {sectors.map((s) => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                className={`sector-option glass ${form.sector === s.id ? 'sector-selected' : ''}`}
                                                onClick={() => updateForm('sector', s.id)}
                                            >
                                                <span className="sector-emoji">{s.icon}</span>
                                                <span>{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="auth-actions">
                            {step === 2 && (
                                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                                    رجوع
                                </button>
                            )}
                            <button type="submit" className="btn btn-primary flex-grow" disabled={loading}>
                                {loading ? 'جاري التسجيل...' : step === 1 ? 'التالي' : 'إنشاء الحساب'}
                                {!loading && <FiArrowLeft size={18} />}
                            </button>
                        </div>
                    </form>

                    <div className="auth-footer">
                        <p className="text-secondary text-sm">
                            لديك حساب بالفعل؟{' '}
                            <Link to="/login" className="text-gradient font-semibold">سجل دخولك</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

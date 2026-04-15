import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiBriefcase, FiArrowLeft } from 'react-icons/fi';

const sectors = [
    { id: 'clinic', label: 'عيادة', icon: '🧑‍⚕️' },
    { id: 'real_estate', label: 'عقارات', icon: '🏗' },
    { id: 'workshop', label: 'ورشة', icon: '🚗' },
    { id: 'ecommerce', label: 'تجارة إلكترونية', icon: '🛒' },
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
        companyName: '',
        sector: '',
        phone: '',
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
            await register(form);
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
                <div className="auth-card glass-strong">
                    <div className="auth-header">
                        <div className="landing-logo justify-center mb-6">
                            <span className="wkl-brand">وكل</span>
                        </div>
                        <h2>{step === 1 ? 'إنشاء حساب جديد' : 'بيانات الشركة'}</h2>
                        <p className="text-secondary">
                            {step === 1 ? 'أدخل بياناتك الشخصية للبدء' : 'أخبرنا عن شركتك'}
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
                                    <label>اسم الشركة</label>
                                    <div className="input-icon-wrapper">
                                        <FiBriefcase className="input-icon" />
                                        <input type="text" className="input input-with-icon" placeholder="اسم شركتك" value={form.companyName} onChange={(e) => updateForm('companyName', e.target.value)} required />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>رقم الجوال (اختياري)</label>
                                    <input type="tel" className="input" placeholder="05xxxxxxxx" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} dir="ltr" />
                                </div>
                                <div className="input-group">
                                    <label>القطاع</label>
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

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            if (user.role === 'super_admin') {
                navigate('/admin');
            } else {
                navigate('/app');
            }
        } catch (err) {
            setError(err.message);
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
                        <h2>مرحباً بعودتك</h2>
                        <p className="text-secondary">سجل دخولك للوصول إلى لوحة التحكم</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="auth-error">{error}</div>}

                        <div className="input-group">
                            <label>البريد الإلكتروني</label>
                            <div className="input-icon-wrapper">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    className="input input-with-icon"
                                    placeholder="example@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>كلمة المرور</label>
                            <div className="input-icon-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type="password"
                                    className="input input-with-icon"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                            {!loading && <FiArrowLeft size={18} />}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="text-secondary text-sm">
                            ليس لديك حساب؟{' '}
                            <Link to="/register" className="text-gradient font-semibold">سجل الآن</Link>
                        </p>
                    </div>

                    <div className="auth-demo-box glass">
                        <p className="text-xs text-muted mb-2">حسابات تجريبية:</p>
                        <div className="demo-accounts">
                            <button className="demo-account" onClick={() => { setEmail('admin@wkl.sa'); setPassword('123456'); }}>
                                <span>مدير النظام</span>
                                <span className="text-xs text-muted">admin@wkl.sa</span>
                            </button>
                            <button className="demo-account" onClick={() => { setEmail('owner@test.com'); setPassword('123456'); }}>
                                <span>صاحب شركة</span>
                                <span className="text-xs text-muted">owner@test.com</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

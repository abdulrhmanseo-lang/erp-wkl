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

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const user = await login('admin@smartops.com', 'admin123');
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

                    {/* Google Sign-In Button */}
                    <button
                        type="button"
                        className="btn-google w-full"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>تسجيل الدخول بـ Google</span>
                    </button>

                    <div className="auth-divider">
                        <span>أو</span>
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
                            <button type="button" className="demo-account" onClick={() => { setEmail('admin@smartops.com'); setPassword('admin123'); }}>
                                <span>مدير النظام</span>
                                <span className="text-xs text-muted">admin@smartops.com</span>
                            </button>
                            <button type="button" className="demo-account" onClick={() => { setEmail('emp@smartops.com'); setPassword('emp123'); }}>
                                <span>موظف (تجريبي)</span>
                                <span className="text-xs text-muted">emp@smartops.com</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

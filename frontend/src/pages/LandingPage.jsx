import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { features, testimonials, pricingPlans } from '../data/mockData';
import { FiArrowLeft, FiCheck, FiMenu, FiX } from 'react-icons/fi';

export default function LandingPage() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="landing-page">
            <div className="bg-aurora" />
            <div className="bg-grid" />

            {/* Navbar */}
            <nav className="landing-nav">
                <div className="container flex items-center justify-between">
                    <div className="landing-logo">
                        <span className="wkl-brand">وكل</span>
                    </div>
                    <div className={`landing-nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
                        <a href="#features">المميزات</a>
                        <a href="#testimonials">آراء العملاء</a>
                        <a href="#pricing">الأسعار</a>
                        <Link to="/login" className="btn btn-secondary btn-sm">تسجيل الدخول</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">ابدأ مجاناً</Link>
                    </div>
                    <button className="mobile-nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content animate-fade-in-up">
                        <div className="hero-badge glass">
                            <span>🇸🇦</span> منصة سعودية 100% مدعومة بالذكاء الاصطناعي
                        </div>
                        <h1 className="hero-title">
                            شغّل شركتك
                            <br />
                            <span className="text-gradient">بالذكاء الاصطناعي</span>
                        </h1>
                        <p className="hero-description">
                            نظام تشغيل ذكي للشركات السعودية. أتمت عملياتك، حلل بياناتك،
                            وزِد إيراداتك مع وكلاء الذكاء الاصطناعي المتخصصين.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                                ابدأ تجربة مجانية
                                <FiArrowLeft size={20} />
                            </button>
                            <button className="btn btn-secondary btn-lg" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                                اكتشف المميزات
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="hero-stat-number">+500</span>
                                <span className="hero-stat-label">شركة سعودية</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="hero-stat-number">%95</span>
                                <span className="hero-stat-label">رضا العملاء</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="hero-stat-number">%40</span>
                                <span className="hero-stat-label">زيادة الإيرادات</span>
                            </div>
                        </div>
                    </div>

                    {/* Floating Dashboard Preview */}
                    <div className="hero-preview animate-float">
                        <div className="preview-card glass-strong">
                            <div className="preview-header">
                                <div className="preview-dots">
                                    <span /><span /><span />
                                </div>
                                <span className="text-xs text-muted">لوحة التحكم الذكية</span>
                            </div>
                            <div className="preview-grid">
                                <div className="preview-kpi glass">
                                    <span className="preview-kpi-value text-gradient">385K</span>
                                    <span className="preview-kpi-label">ر.س إيرادات</span>
                                </div>
                                <div className="preview-kpi glass">
                                    <span className="preview-kpi-value" style={{ color: '#34D399' }}>1,247</span>
                                    <span className="preview-kpi-label">عميل</span>
                                </div>
                                <div className="preview-kpi glass">
                                    <span className="preview-kpi-value" style={{ color: '#FBBF24' }}>856</span>
                                    <span className="preview-kpi-label">طلب</span>
                                </div>
                            </div>
                            <div className="preview-chart glass">
                                <div className="preview-bars">
                                    {[40, 55, 70, 60, 80, 90, 95].map((h, i) => (
                                        <div key={i} className="preview-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="features-section">
                <div className="container">
                    <div className="section-header text-center animate-fade-in-up">
                        <h2>مميزات تجعل عملك <span className="text-gradient">أذكى</span></h2>
                        <p className="text-secondary">أدوات متقدمة مدعومة بالذكاء الاصطناعي مصممة خصيصاً للسوق السعودي</p>
                    </div>
                    <div className="features-grid stagger-children">
                        {features.map((f) => (
                            <div key={f.id} className="feature-card glass-card">
                                <div className="feature-icon">{f.icon}</div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc text-secondary">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sectors */}
            <section className="sectors-section">
                <div className="container">
                    <div className="section-header text-center animate-fade-in-up">
                        <h2>مصمم لـ <span className="text-gradient">كل القطاعات</span></h2>
                        <p className="text-secondary">وحدات متخصصة لكل نوع من الأعمال</p>
                    </div>
                    <div className="sectors-grid stagger-children">
                        {[
                            { icon: '🧑‍⚕️', title: 'العيادات', desc: 'إدارة المرضى والمواعيد والتذكيرات' },
                            { icon: '🏗', title: 'العقارات', desc: 'تتبع العقارات والعملاء والعمولات' },
                            { icon: '🚗', title: 'الورش', desc: 'تتبع الصيانة والمخزون والعملاء' },
                            { icon: '🛒', title: 'التجارة الإلكترونية', desc: 'إدارة المنتجات والطلبات والمبيعات' },
                        ].map((s, i) => (
                            <div key={i} className="sector-card glass-card">
                                <div className="sector-icon">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p className="text-secondary text-sm">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="testimonials-section">
                <div className="container">
                    <div className="section-header text-center animate-fade-in-up">
                        <h2>ماذا يقول <span className="text-gradient">عملاؤنا</span></h2>
                        <p className="text-secondary">شركات سعودية حقيقية تثق بـ وكل</p>
                    </div>
                    <div className="testimonials-grid stagger-children">
                        {testimonials.map((t) => (
                            <div key={t.id} className="testimonial-card glass-card">
                                <div className="testimonial-avatar">{t.avatar}</div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <span className="font-semibold">{t.name}</span>
                                    <span className="text-sm text-muted">{t.role}</span>
                                </div>
                                <div className="badge badge-primary">{t.sector}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="pricing-section">
                <div className="container">
                    <div className="section-header text-center animate-fade-in-up">
                        <h2>خطط <span className="text-gradient">مرنة</span> لكل الأحجام</h2>
                        <p className="text-secondary">ابدأ مجاناً وارتقِ مع نمو عملك</p>
                    </div>
                    <div className="pricing-grid stagger-children">
                        {pricingPlans.map((plan) => (
                            <div key={plan.id} className={`pricing-card glass-card ${plan.popular ? 'pricing-popular' : ''}`}>
                                {plan.popular && <div className="popular-badge">الأكثر شيوعاً</div>}
                                <h3 className="pricing-name">{plan.name}</h3>
                                <div className="pricing-price">
                                    <span className="price-amount">{plan.price}</span>
                                    <span className="price-currency">ر.س</span>
                                    <span className="price-period">{plan.period}</span>
                                </div>
                                <ul className="pricing-features">
                                    {plan.features.map((f, i) => (
                                        <li key={i}><FiCheck size={16} className="check-icon" /> {f}</li>
                                    ))}
                                </ul>
                                <button
                                    className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => navigate('/register')}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container text-center">
                    <div className="cta-content glass-strong animate-fade-in-up">
                        <h2>جاهز لتحويل عملك؟</h2>
                        <p className="text-secondary text-lg">
                            انضم لأكثر من 500 شركة سعودية تستخدم وكل
                        </p>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                            ابدأ الآن مجاناً <FiArrowLeft />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <div className="landing-logo mb-4">
                                <span className="wkl-brand">وكل</span>
                            </div>
                            <p className="text-sm text-secondary">
                                نظام تشغيل ذكي للشركات السعودية مدعوم بالذكاء الاصطناعي
                            </p>
                        </div>
                        <div className="footer-col">
                            <h4>المنتج</h4>
                            <a href="#features">المميزات</a>
                            <a href="#pricing">الأسعار</a>
                            <a href="#">التوثيق</a>
                        </div>
                        <div className="footer-col">
                            <h4>الشركة</h4>
                            <a href="#">من نحن</a>
                            <a href="#">المدونة</a>
                            <a href="#">الوظائف</a>
                        </div>
                        <div className="footer-col">
                            <h4>الدعم</h4>
                            <a href="#">مركز المساعدة</a>
                            <a href="#">تواصل معنا</a>
                            <a href="#">الشروط والأحكام</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p className="text-sm text-muted">© 2026 وكل. جميع الحقوق محفوظة. صنع بـ ❤️ في السعودية 🇸🇦</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

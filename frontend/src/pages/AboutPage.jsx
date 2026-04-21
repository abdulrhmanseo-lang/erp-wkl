import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiInfo, FiUsers, FiAward } from 'react-icons/fi';

export default function AboutPage() {
    return (
        <div className="landing-page" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            <div className="bg-aurora" />
            <div className="bg-grid" />

            <nav className="landing-nav" style={{ padding: '20px 0' }}>
                <div className="container flex items-center justify-between">
                    <Link to="/" className="landing-logo text-decoration-none">
                        <span className="wkl-brand">وكل</span>
                    </Link>
                    <Link to="/" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        العودة للرئيسية <FiArrowLeft size={16} />
                    </Link>
                </div>
            </nav>

            <div className="container mt-4 animate-fade-in-up" style={{ paddingTop: '80px' }}>
                <div className="section-header text-center mb-5">
                    <h2>عن <span className="text-gradient">وكل</span></h2>
                    <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}>
                        مهمتنا هي تمكين كل شركة سعودية من العمل بذكاء وسرعة باستخدام تقنيات الذكاء الاصطناعي لتكون جزءاً فاعلاً في رؤية 2030.
                    </p>
                </div>

                <div className="features-grid stagger-children mt-5">
                    <div className="feature-card glass-card">
                        <div className="feature-icon-wrapper" style={{ padding: '20px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.03)', display: 'inline-flex', marginBottom: '16px', color: 'var(--blue)' }}>
                            <FiUsers size={32} />
                        </div>
                        <h3 className="feature-title">من نحن</h3>
                        <p className="feature-desc text-secondary">
                            نحن فريق من المبتكرين والخبراء السعوديين في مجال التقنية والأعمال، نعمل بشغف لبناء أفضل الحلول البرمجية المدعومة بالذكاء الاصطناعي لدعم نمو الشركات في المنطقة.
                        </p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon-wrapper" style={{ padding: '20px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.03)', display: 'inline-flex', marginBottom: '16px', color: 'var(--gold)' }}>
                            <FiAward size={32} />
                        </div>
                        <h3 className="feature-title">رؤيتنا</h3>
                        <p className="feature-desc text-secondary">
                            أن نصبح نظام التشغيل الموثوق والأولى للقطاع الخاص في المملكة العربية السعودية، عبر تقديم قيمة استثنائية ونقلة نوعية في التحول الرقمي.
                        </p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon-wrapper" style={{ padding: '20px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.03)', display: 'inline-flex', marginBottom: '16px', color: 'var(--green)' }}>
                            <FiInfo size={32} />
                        </div>
                        <h3 className="feature-title">القيم الأساسية</h3>
                        <p className="feature-desc text-secondary">
                            الإبداع والابتكار، رضا العملاء في صميم اهتماماتنا، الجودة الاستثنائية، والأمان العالي للحفاظ على سرية وحساسية بيانات شركائنا.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

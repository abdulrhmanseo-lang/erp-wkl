import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiChevronLeft } from 'react-icons/fi';

const blogPosts = [
    { title: 'أهمية الذكاء الاصطناعي للشركات الناشئة', excerpt: 'كيف تقود التكنولوجيا طفرة كبيرة في تبسيط العمليات وتوفير الموارد في سياق ريادة الأعمال الحديثة.', date: '12 مايو 2026', category: 'التقنية' },
    { title: 'تجربة العملاء فيยุค الرقمنة', excerpt: 'استراتيجيات تحويل رحلة العميل ليصبح سفيراً للعلامة التجارية بالاعتماد على أدوات التواصل الآلي.', date: '05 أبريل 2026', category: 'التسويق' },
    { title: 'توافق الأنظمة مع رؤية السعودية 2030', excerpt: 'نظرة شاملة على تحديات التحول الرقمي وكيف تستعد المؤسسات لتلبية تطلعات الاقتصاد الوطني.', date: '21 مارس 2026', category: 'الأعمال' },
];

export default function BlogPage() {
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
                    <h2><span className="text-gradient">المدونة</span> والأخبار</h2>
                    <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}>
                        آخر المقالات المتخصصة، تحديثات المنصة، وأفضل الممارسات لتطوير أعمالك.
                    </p>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                    {blogPosts.map((post, idx) => (
                        <div key={idx} className="glass-card hover-glow" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '16px' }}>{post.category}</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{post.title}</h3>
                            <p className="text-secondary" style={{ flexGrow: 1, marginBottom: '20px' }}>{post.excerpt}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-muted text-sm flex items-center gap-2"><FiClock /> {post.date}</span>
                                <Link to="#" className="text-gradient flex items-center gap-1 font-semibold text-sm" style={{ textDecoration: 'none' }}>
                                    اقرأ المزيد <FiChevronLeft />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

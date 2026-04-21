import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiMinus, FiSearch, FiPhoneCall, FiMail } from 'react-icons/fi';

const faqs = [
    { q: 'كيف يعمل وكل بنظام الوكلاء المدمج؟', a: 'وكلاء الذكاء الاصطناعي عبارة عن أنظمة مدعومة بالنماذج اللغوية تقوم بتحليل بياناتك وقراءتها بدقة وتقديم رؤى ورسائل تسويقية مؤتمتة دون أي تدخل بشري.' },
    { q: 'هل متوافق مع ضريبة القيمة المضافة السعودية؟', a: 'نعم بالكامل. يحتوي وكل على وحدة فوترة ذكية تستخرج الفواتير الضريبية وتدعم القراءة الإلكترونية حسب معايير هيئة الزكاة والضريبة والجمارك.' },
    { q: 'كيف يمكنني ربط رقم واتساب بالمنصة؟', a: 'من خلال "التواصل مع العملاء" ثم خيار "الربط الآلي"، سيتم تزويدك برمز QR يمسح مباشرة عن طريق هاتفك لربط الخدمة.' },
    { q: 'هل بيانات الشركة ورسائل العملاء آمنة؟', a: 'أمان بياناتك أولويتنا القصوى، جميع البيانات مشفرة بالكامل ولا يتم التشارك بها مع أطراف ثالثة إطلاقاً وفق أعلى معايير أمن المعلومات.' },
];

export default function HelpCenterPage() {
    const [openIdx, setOpenIdx] = useState(0);

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

            <div className="container mt-4 animate-fade-in-up" style={{ paddingTop: '60px', maxWidth: '800px' }}>
                <div className="section-header text-center mb-5">
                    <h2>مركز <span className="text-gradient">المساعدة</span></h2>
                    <p className="text-secondary" style={{ fontSize: '1.2rem' }}>كيف يمكننا مساعدتك اليوم؟</p>

                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', margin: '30px auto', maxWidth: '500px', borderRadius: '100px' }}>
                        <FiSearch size={22} className="text-muted" style={{ marginLeft: '12px' }} />
                        <input type="text" placeholder="ابحث عن سؤالك هنا..." style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '30px' }}>
                    <h3 style={{ marginBottom: '24px', color: 'var(--gold)' }}>الأسئلة الشائعة</h3>
                    <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="faq-item" style={{ borderBottom: idx !== faqs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: '16px' }}>
                                <button
                                    onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                                    style={{ width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', textAlign: 'right', padding: '10px 0' }}
                                >
                                    <span>{faq.q}</span>
                                    {openIdx === idx ? <FiMinus className="text-gradient" /> : <FiPlus className="text-muted" />}
                                </button>
                                {openIdx === idx && (
                                    <div className="faq-answer text-secondary" style={{ marginTop: '12px', lineHeight: '1.7', padding: '0 10px', animation: 'fadeIn 0.3s ease-out' }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-5 grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="glass-card text-center" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ color: 'var(--blue)', marginBottom: '16px' }}><FiMail size={40} /></div>
                        <h4>الدعم عبر البريد الإلكتروني</h4>
                        <p className="text-muted mt-2 mb-4 text-sm">نحن متاحون للرد على رسائلك خلال 24 ساعة</p>
                        <a href="mailto:support@wkl.sa" className="btn btn-secondary w-full">support@wkl.sa</a>
                    </div>

                    <div className="glass-card text-center" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ color: 'var(--green)', marginBottom: '16px' }}><FiPhoneCall size={40} /></div>
                        <h4>الاتصال المباشر</h4>
                        <p className="text-muted mt-2 mb-4 text-sm">الدعم الهاتفي متاح من 9 ص حتى 5 م</p>
                        <a href="tel:+966500000000" className="btn btn-primary w-full">اتصل بنا</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

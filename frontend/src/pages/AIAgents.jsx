import { useState, useRef, useEffect } from 'react';
import { aiAgents } from '../data/mockData';
import { FiActivity, FiTrendingUp, FiCheck, FiPause, FiPlay, FiSettings, FiX, FiSend, FiMessageCircle } from 'react-icons/fi';

const agentResponses = {
    sales: [
        'بناءً على تحليل بيانات المبيعات، أوصي بزيادة التركيز على العملاء الحاليين — معدل إعادة الشراء لديهم 73%. 📊',
        'العميل "أحمد المطيري" لديه احتمال شراء 89% بناءً على سلوكه الأخير. أنصح بالتواصل معه اليوم عبر واتساب. 🎯',
        'تحليل الموسم: المنتجات الأكثر مبيعاً هذا الأسبوع هي فئة "العطور" بنسبة 34% من إجمالي المبيعات. 💰',
        'اقتراح: تفعيل خصم 10% للعملاء الذين لم يشتروا منذ 30 يوماً — هذا سيحقق عائد متوقع 15,000 ر.س. ✅',
    ],
    marketing: [
        'تحليل الأداء: حملة "رمضان كريم" حققت ROI بنسبة 340% — أفضل حملة هذا الربع! 🚀',
        'أفضل وقت للنشر على وسائل التواصل هو بين 8-10 مساءً بتوقيت السعودية. التفاعل يرتفع بنسبة 65% في هذه الفترة. 📱',
        'اقتراح: إطلاق حملة "عيد الفطر" خلال الأسبوع القادم. الميزانية المقترحة 5,000 ر.س مع عائد متوقع 17,000 ر.س. 📢',
        'جمهورك المستهدف: 70% ذكور، 30% إناث، الفئة العمرية 25-40 الأكثر تفاعلاً. المحتوى المرئي يحقق 3x تفاعل أكثر. 🎨',
    ],
    support: [
        'تقرير الدعم: تم الرد على 94% من استفسارات العملاء تلقائياً اليوم. متوسط وقت الرد: 12 ثانية ⚡',
        'الأسئلة الأكثر شيوعاً اليوم:\n1. ساعات العمل (34%)\n2. حالة الطلب (28%)\n3. سياسة الإرجاع (19%)\n4. طرق الدفع (12%)',
        'رضا العملاء عن الردود التلقائية: 4.3/5 ⭐ — ارتفاع بنسبة 8% عن الأسبوع الماضي.',
        'تنبيه: 3 عملاء أعربوا عن عدم رضاهم اليوم. تم تصعيد ملفاتهم للمسؤول المباشر. 🔔',
    ],
};

export default function AIAgents() {
    const [agents, setAgents] = useState(aiAgents);
    const [chatAgent, setChatAgent] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatBodyRef = useRef(null);

    const toggleAgent = (id) => {
        setAgents(agents.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a));
    };

    const openChat = (agent) => {
        setChatAgent(agent);
        const greeting = `مرحباً! أنا ${agent.name}. ${agent.description}.\n\nكيف يمكنني مساعدتك اليوم؟ 🤖`;
        setMessages([{ id: 1, type: 'bot', text: greeting }]);
    };

    const closeChat = () => {
        setChatAgent(null);
        setMessages([]);
        setInputMsg('');
    };

    const sendMessage = () => {
        if (!inputMsg.trim() || isTyping) return;
        const userMsg = { id: Date.now(), type: 'user', text: inputMsg };
        setMessages(prev => [...prev, userMsg]);
        setInputMsg('');
        setIsTyping(true);

        setTimeout(() => {
            const responses = agentResponses[chatAgent.id] || agentResponses.sales;
            const randomResp = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: randomResp }]);
            setIsTyping(false);
        }, 1500);
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    return (
        <div className="page-enter">
            <div className="page-header">
                <div>
                    <h1>وكلاء الذكاء الاصطناعي</h1>
                    <p className="text-secondary">إدارة ومراقبة وكلاء AI الذين يعملون لصالح عملك</p>
                </div>
            </div>

            <div className="agents-grid stagger-children">
                {agents.map((agent) => (
                    <div key={agent.id} className="agent-card glass-card">
                        <div className="agent-header">
                            <div className="agent-icon" style={{ background: `${agent.color}20` }}>
                                <span style={{ fontSize: '2rem' }}>{agent.icon}</span>
                            </div>
                            <div className="agent-status-wrap">
                                <span className={`badge ${agent.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                    {agent.status === 'active' ? 'نشط' : 'متوقف'}
                                </span>
                                <button className="btn btn-icon btn-ghost" onClick={() => toggleAgent(agent.id)}>
                                    {agent.status === 'active' ? <FiPause size={16} /> : <FiPlay size={16} />}
                                </button>
                            </div>
                        </div>

                        <h3 className="agent-name">{agent.name}</h3>
                        <p className="text-secondary text-sm">{agent.description}</p>

                        <div className="agent-stats">
                            <div className="agent-stat">
                                <FiActivity size={16} style={{ color: agent.color }} />
                                <span>{agent.tasks} مهمة اليوم</span>
                            </div>
                            <div className="agent-stat">
                                <FiTrendingUp size={16} style={{ color: agent.color }} />
                                <span>دقة {agent.accuracy}%</span>
                            </div>
                        </div>

                        <div className="agent-insights">
                            <h5>آخر الرؤى:</h5>
                            {agent.insights.map((ins, i) => (
                                <div key={i} className="agent-insight-item">
                                    <FiCheck size={14} style={{ color: agent.color, flexShrink: 0 }} />
                                    <span className="text-sm">{ins}</span>
                                </div>
                            ))}
                        </div>

                        <div className="agent-actions">
                            <button className="btn btn-sm btn-secondary">
                                <FiSettings size={14} /> إعدادات
                            </button>
                            <button className="btn btn-sm btn-primary" onClick={() => openChat(agent)}>
                                <FiMessageCircle size={14} /> محادثة
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Chat Modal */}
            {chatAgent && (
                <div className="ai-chat-overlay" onClick={(e) => e.target === e.currentTarget && closeChat()}>
                    <div className="ai-chat-modal">
                        <div className="ai-chat-header">
                            <div className="ai-chat-header-info">
                                <div className="ai-chat-avatar" style={{ background: `${chatAgent.color}20` }}>
                                    {chatAgent.icon}
                                </div>
                                <div>
                                    <div className="font-semibold">{chatAgent.name}</div>
                                    <div className="text-xs text-muted">
                                        {chatAgent.status === 'active' ? '🟢 نشط الآن' : '🟡 متوقف'}
                                    </div>
                                </div>
                            </div>
                            <button className="ai-chat-close" onClick={closeChat}>
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="ai-chat-body" ref={chatBodyRef}>
                            {messages.map(msg => (
                                <div key={msg.id} className={`ai-msg ai-msg-${msg.type === 'bot' ? 'bot' : 'user'}`}>
                                    <div className="ai-msg-bubble" style={{ whiteSpace: 'pre-line' }}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="ai-msg ai-msg-bot">
                                    <div className="ai-typing">
                                        <div className="ai-typing-dot" />
                                        <div className="ai-typing-dot" />
                                        <div className="ai-typing-dot" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="ai-chat-input-area">
                            <input
                                className="ai-chat-input"
                                placeholder="اكتب رسالتك..."
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button className="ai-chat-send" onClick={sendMessage}>
                                <FiSend size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

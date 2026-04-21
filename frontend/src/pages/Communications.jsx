import { useState } from 'react';
import { chatMessages } from '../data/mockData';
import { FiSend, FiPaperclip, FiSmile, FiUser, FiCpu, FiSearch, FiPhone, FiMoreVertical, FiZap } from 'react-icons/fi';
import { apiFetch } from '../lib/api';

const contacts = [
    { id: 1, name: 'محمد الحربي', lastMsg: 'أريد حجز موعد لغداً', time: '10:31 ص', unread: 2, online: true },
    { id: 2, name: 'فاطمة السعيد', lastMsg: 'شكراً لكم على الخدمة', time: '09:45 ص', unread: 0, online: false },
    { id: 3, name: 'خالد العمري', lastMsg: 'هل يوجد عرض خاص؟', time: 'أمس', unread: 1, online: true },
    { id: 4, name: 'نورة المطيري', lastMsg: 'تم الدفع بنجاح', time: 'أمس', unread: 0, online: false },
    { id: 5, name: 'سعاد الحربي', lastMsg: 'متى يتم التوصيل؟', time: '12/04', unread: 3, online: true },
];

export default function Communications() {
    const [activeContact, setActiveContact] = useState(contacts[0]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(chatMessages);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [suggestLoading, setSuggestLoading] = useState(false);

    const handleSend = () => {
        if (!message.trim()) return;
        setMessages([...messages, {
            id: messages.length + 1,
            sender: 'agent',
            name: 'أنت',
            text: message,
            time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        }]);
        setMessage('');
        setAiSuggestion('');
    };

    const lastCustomerText = [...messages].reverse().find((m) => m.sender === 'customer')?.text || '';

    const fetchAiReply = async () => {
        if (!lastCustomerText.trim()) return;
        setSuggestLoading(true);
        try {
            const res = await apiFetch('/ai/communications/suggest-reply', {
                method: 'POST',
                body: JSON.stringify({
                    last_customer_message: lastCustomerText,
                    contact_name: activeContact.name,
                }),
            });
            const data = res.ok ? await res.json() : null;
            setAiSuggestion(data?.suggested_reply || '');
        } catch {
            setAiSuggestion('');
        } finally {
            setSuggestLoading(false);
        }
    };

    return (
        <div className="page-enter">
            <div className="page-header">
                <div>
                    <h1>التواصل مع العملاء</h1>
                    <p className="text-secondary">إدارة محادثات واتساب والردود التلقائية</p>
                </div>
            </div>

            <div className="chat-layout glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Contacts List */}
                <div className="chat-contacts">
                    <div className="contacts-header">
                        <div className="search-box-sm">
                            <FiSearch size={16} />
                            <input type="text" placeholder="ابحث عن محادثة..." />
                        </div>
                    </div>
                    <div className="contacts-list">
                        {contacts.map((c) => (
                            <div
                                key={c.id}
                                className={`contact-item ${activeContact.id === c.id ? 'contact-active' : ''}`}
                                onClick={() => setActiveContact(c)}
                            >
                                <div className="contact-avatar-wrap">
                                    <div className="contact-avatar">{c.name.charAt(0)}</div>
                                    {c.online && <span className="online-dot" />}
                                </div>
                                <div className="contact-info">
                                    <div className="contact-name-row">
                                        <span className="font-semibold">{c.name}</span>
                                        <span className="text-xs text-muted">{c.time}</span>
                                    </div>
                                    <div className="contact-last-msg">
                                        <span className="text-sm text-secondary">{c.lastMsg}</span>
                                        {c.unread > 0 && <span className="unread-badge">{c.unread}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="chat-area">
                    <div className="chat-header">
                        <div className="flex items-center gap-3">
                            <div className="contact-avatar">{activeContact.name.charAt(0)}</div>
                            <div>
                                <span className="font-semibold">{activeContact.name}</span>
                                <span className="text-xs text-muted block">
                                    {activeContact.online ? 'متصل الآن' : 'غير متصل'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-icon btn-ghost"><FiPhone size={18} /></button>
                            <button className="btn btn-icon btn-ghost"><FiMoreVertical size={18} /></button>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.sender === 'customer' ? 'message-received' : 'message-sent'}`}>
                                <div className="message-bubble">
                                    <div className="message-sender flex items-center gap-1">
                                        {msg.sender === 'customer' ? <FiUser size={12} /> : <FiCpu size={12} />}
                                        <span className="text-xs font-semibold">{msg.name}</span>
                                    </div>
                                    <p>{msg.text}</p>
                                    <span className="message-time">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3" style={{ borderTop: '1px solid rgba(200,169,96,0.06)' }}>
                        <button type="button" className="btn btn-sm btn-secondary mb-2" onClick={fetchAiReply} disabled={suggestLoading}>
                            <FiZap size={14} /> {suggestLoading ? '…' : 'اقتراح رد ذكي'}
                        </button>
                        {aiSuggestion && (
                            <div className="glass p-3" style={{ borderRadius: 'var(--radius-md)' }}>
                                <div className="text-xs text-secondary mb-1">اقتراح وكيل الدعم</div>
                                <p className="text-sm" style={{ margin: 0 }}>{aiSuggestion}</p>
                                <button type="button" className="btn btn-sm btn-secondary mt-2" onClick={() => { setMessage(aiSuggestion); }}>
                                    نسخ إلى حقل الإرسال
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="chat-input-area">
                        <button type="button" className="btn btn-icon btn-ghost"><FiPaperclip size={18} /></button>
                        <button type="button" className="btn btn-icon btn-ghost"><FiSmile size={18} /></button>
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="اكتب رسالتك..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="btn btn-primary btn-icon" onClick={handleSend}>
                            <FiSend size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

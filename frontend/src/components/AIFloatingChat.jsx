import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiZap } from 'react-icons/fi';
import { apiFetch } from '../lib/api';

export default function AIFloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'أهلاً بك! أنا المساعد الذكي الخاص بنظام وكل. كيف يمكنني مساعدتك؟ 🤖' }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatBodyRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!inputMsg.trim() || isTyping) return;
        const msgText = inputMsg;
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: msgText }]);
        setInputMsg('');
        setIsTyping(true);

        try {
            const res = await apiFetch('/ai/agents/chat', {
                method: 'POST',
                body: JSON.stringify({ agent_id: 'general', message: msgText }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: data.reply }]);
        } catch {
            setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: 'حدث خطأ في الاتصال بالمساعد الذكي.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        if (chatBodyRef.current && isOpen) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    return (
        <div className="floating-ai-wrapper">
            {isOpen && (
                <div className="floating-ai-panel glass-strong animate-fade-in-up">
                    <div className="ai-chat-header" style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="ai-chat-header-info">
                            <div className="agent-icon" style={{ width: 40, height: 40, background: 'rgba(200, 169, 96, 0.2)' }}>
                                <FiZap size={20} color="var(--gold)" />
                            </div>
                            <div>
                                <div className="font-semibold" style={{ fontSize: '1.1rem' }}>سعد - المساعد الذكي</div>
                                <div className="text-xs text-secondary">متصل الآن 🟢</div>
                            </div>
                        </div>
                        <button className="btn-icon btn-ghost" onClick={toggleChat}>
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="ai-chat-body custom-scrollbar" ref={chatBodyRef} style={{ height: '350px', padding: '16px', overflowY: 'auto' }}>
                        {messages.map(msg => (
                            <div key={msg.id} className={`ai-msg ${msg.type === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`}>
                                <div className="ai-msg-bubble">{msg.text}</div>
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

                    <div className="ai-chat-input-area" style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <input
                            className="input w-full"
                            style={{ borderRadius: '20px', paddingRight: '40px' }}
                            placeholder="اكتب رسالتك..."
                            value={inputMsg}
                            onChange={(e) => setInputMsg(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button
                            className="bg-transparent border-none text-gold cursor-pointer"
                            style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)' }}
                            onClick={sendMessage}
                        >
                            <FiSend size={18} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                    </div>
                </div>
            )}

            <button className="floating-ai-fab" onClick={toggleChat}>
                {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
            </button>
        </div>
    );
}

import { useState } from 'react';
import { aiAgents } from '../data/mockData';
import { FiActivity, FiTrendingUp, FiCheck, FiPause, FiPlay, FiSettings } from 'react-icons/fi';

export default function AIAgents() {
    const [agents, setAgents] = useState(aiAgents);

    const toggleAgent = (id) => {
        setAgents(agents.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a));
    };

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
                            <button className="btn btn-sm btn-primary">عرض التقرير</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

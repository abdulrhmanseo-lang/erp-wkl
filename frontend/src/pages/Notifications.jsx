import { useState, useEffect } from 'react';
import { notifications as notifData } from '../data/mockData';
import { FiCheck, FiCheckCircle, FiBell } from 'react-icons/fi';
import { apiFetch } from '../lib/api';

const typeIcons = { warning: '⚠️', success: '✅', danger: '🔴', info: 'ℹ️' };

export default function Notifications() {
    const [notifs, setNotifs] = useState(notifData);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        let c = false;
        (async () => {
            try {
                const res = await apiFetch('/ai/notifications-feed');
                if (!res.ok || c) return;
                const d = await res.json();
                const extra = d.items || [];
                if (extra.length) setNotifs((prev) => [...extra, ...prev]);
            } catch {
                /* يبقى المحلي */
            }
        })();
        return () => {
            c = true;
        };
    }, []);

    const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));
    const filtered = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter(n => !n.read) : notifs.filter(n => n.type === filter);

    return (
        <div className="page-enter">
            <div className="page-header">
                <div>
                    <h1>الإشعارات</h1>
                    <p className="text-secondary">تنبيهات ذكية من النظام ووكلاء الذكاء الاصطناعي</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
                    <FiCheckCircle size={16} /> تعيين الكل كمقروء
                </button>
            </div>

            <div className="flex gap-2 mb-6" style={{ flexWrap: 'wrap' }}>
                {[
                    { id: 'all', label: 'الكل' },
                    { id: 'unread', label: 'غير مقروءة' },
                    { id: 'warning', label: 'تحذيرات' },
                    { id: 'success', label: 'نجاح' },
                    { id: 'danger', label: 'عاجلة' },
                    { id: 'info', label: 'معلومات' },
                ].map((f) => (
                    <button
                        key={f.id}
                        className={`btn btn-sm ${filter === f.id ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter(f.id)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="notifs-list stagger-children">
                {filtered.map((n) => (
                    <div key={n.id} className={`notif-card glass-card ${!n.read ? 'notif-card-unread' : ''}`}>
                        <div className="notif-card-icon">{typeIcons[n.type]}</div>
                        <div className="notif-card-content">
                            <div className="flex items-center gap-2">
                                <h4>{n.title}</h4>
                                {!n.read && <div className="unread-indicator" />}
                            </div>
                            <p className="text-secondary">{n.text}</p>
                            <span className="text-xs text-muted">{n.time}</span>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setNotifs(notifs.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                            <FiCheck size={16} />
                        </button>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="glass-card text-center p-8">
                        <FiBell size={40} className="text-muted" style={{ margin: '0 auto 16px' }} />
                        <p className="text-secondary">لا توجد إشعارات</p>
                    </div>
                )}
            </div>
        </div>
    );
}

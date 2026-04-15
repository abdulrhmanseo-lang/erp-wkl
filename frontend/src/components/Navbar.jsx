import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiBell, FiSearch, FiMenu, FiChevronDown } from 'react-icons/fi';
import { notifications } from '../data/mockData';

export default function Navbar({ onToggleSidebar }) {
    const { user } = useAuth();
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="navbar">
            <div className="navbar-right">
                <button className="btn-icon mobile-menu-btn" onClick={onToggleSidebar}>
                    <FiMenu size={22} />
                </button>
                <div className="search-box">
                    <FiSearch size={18} />
                    <input type="text" placeholder="ابحث في النظام..." className="search-input" />
                </div>
            </div>

            <div className="navbar-left">
                <div className="notif-wrapper">
                    <button className="navbar-icon-btn" onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}>
                        <FiBell size={20} />
                        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                    </button>

                    {showNotifs && (
                        <div className="dropdown-panel notif-dropdown glass-strong">
                            <div className="dropdown-header">
                                <h4>الإشعارات</h4>
                                <span className="badge badge-primary">{unreadCount} جديد</span>
                            </div>
                            <div className="dropdown-list">
                                {notifications.slice(0, 5).map(n => (
                                    <div key={n.id} className={`notif-item ${!n.read ? 'notif-unread' : ''}`}>
                                        <div className={`notif-dot notif-dot-${n.type}`} />
                                        <div className="notif-content">
                                            <span className="notif-title">{n.title}</span>
                                            <span className="notif-text">{n.text}</span>
                                            <span className="notif-time">{n.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="profile-wrapper">
                    <button className="navbar-profile-btn" onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}>
                        <div className="navbar-avatar">
                            {user?.name?.charAt(0) || '؟'}
                        </div>
                        <span className="navbar-username hide-mobile">{user?.name}</span>
                        <FiChevronDown size={16} />
                    </button>

                    {showProfile && (
                        <div className="dropdown-panel profile-dropdown glass-strong">
                            <div className="profile-dropdown-header">
                                <div className="navbar-avatar navbar-avatar-lg">{user?.name?.charAt(0)}</div>
                                <div>
                                    <div className="font-semibold">{user?.name}</div>
                                    <div className="text-sm text-muted">{user?.email}</div>
                                </div>
                            </div>
                            <div className="dropdown-divider" />
                            <button className="dropdown-item">الملف الشخصي</button>
                            <button className="dropdown-item">الإعدادات</button>
                            <div className="dropdown-divider" />
                            <button className="dropdown-item text-danger">تسجيل الخروج</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

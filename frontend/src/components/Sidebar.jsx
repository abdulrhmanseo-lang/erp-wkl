import { useNavigate, useLocation } from 'react-router-dom';
import { sidebarMenu, adminMenu } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import {
    FiGrid, FiCpu, FiMessageCircle, FiTrendingUp, FiFileText,
    FiZap, FiLayers, FiBell, FiCreditCard, FiSettings, FiLogOut,
    FiUsers, FiDollarSign, FiBarChart2, FiActivity, FiClock, FiTarget, FiUserCheck
} from 'react-icons/fi';

const iconMap = {
    dashboard: FiGrid,
    ai: FiCpu,
    chat: FiMessageCircle,
    marketing: FiTrendingUp,
    invoice: FiFileText,
    brain: FiZap,
    sector: FiLayers,
    notifications: FiBell,
    billing: FiCreditCard,
    settings: FiSettings,
    employees: FiUserCheck,
    hr: FiClock,
    clients: FiTarget,
    reports: FiBarChart2,
    companies: FiUsers,
    revenue: FiDollarSign,
    subscriptions: FiCreditCard,
    analytics: FiBarChart2,
};

export default function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const isAdmin = user?.role === 'super_admin';
    const menu = isAdmin ? adminMenu : sidebarMenu;

    const handleNav = (path) => {
        navigate(path);
        if (window.innerWidth < 768) onClose?.();
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="wkl-brand">وكل</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section-label">{isAdmin ? 'إدارة النظام' : 'القائمة الرئيسية'}</div>
                    {menu.map((item) => {
                        const Icon = iconMap[item.icon] || FiActivity;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                                onClick={() => handleNav(item.path)}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                                {isActive && <div className="nav-indicator" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="user-avatar-sm">
                            {user?.name?.charAt(0) || '؟'}
                        </div>
                        <div className="user-info-sm">
                            <span className="user-name-sm">{user?.name}</span>
                            <span className="user-role-sm">
                                {user?.role === 'super_admin' ? 'مدير النظام' :
                                    user?.role === 'company_owner' ? 'صاحب الشركة' : 'موظف'}
                            </span>
                        </div>
                    </div>
                    <button className="nav-item nav-item-logout" onClick={handleLogout}>
                        <FiLogOut size={20} />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

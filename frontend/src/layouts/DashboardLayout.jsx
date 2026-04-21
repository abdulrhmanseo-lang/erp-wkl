import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { FiGrid, FiCpu, FiMessageCircle, FiFileText, FiSettings } from 'react-icons/fi';

const mobileNavItems = [
    { icon: FiGrid, label: 'الرئيسية', path: '/app' },
    { icon: FiCpu, label: 'الذكاء', path: '/app/ai-agents' },
    { icon: FiMessageCircle, label: 'التواصل', path: '/app/communications' },
    { icon: FiFileText, label: 'الفواتير', path: '/app/invoicing' },
    { icon: FiSettings, label: 'الإعدادات', path: '/settings' },
];

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="dashboard-layout">
            <div className="bg-aurora" />
            <div className="bg-grid" />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="dashboard-main">
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="dashboard-content">
                    <div className="page-enter">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-bottom-nav">
                <div className="mobile-bottom-nav-items">
                    {mobileNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
                                onClick={() => navigate(item.path)}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}

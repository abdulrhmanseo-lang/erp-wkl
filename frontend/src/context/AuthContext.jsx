import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api/v1`;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('smartops_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'بيانات الدخول غير صحيحة');
        }

        const userData = normalizeUser(data);
        setUser(userData);
        localStorage.setItem('smartops_user', JSON.stringify(userData));
        return userData;
    };

    const googleLogin = async (credential) => {
        const response = await fetch(`${API_URL}/auth/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'فشل تسجيل الدخول عبر جوجل');
        }

        const userData = normalizeUser(data);
        setUser(userData);
        localStorage.setItem('smartops_user', JSON.stringify(userData));
        return userData;
    };

    const register = async (formData) => {
        const payload = {
            email: formData.email,
            password: formData.password || '123456',
            full_name: formData.full_name || formData.name,
            phone: formData.phone || '',
            company_name: formData.company_name || formData.companyName || '',
            entity_type: formData.entity_type || formData.entityType || 'company',
            cr_number: formData.cr_number || formData.crNumber || '',
            tax_number: formData.tax_number || formData.taxNumber || '',
            sector: formData.sector || 'ecommerce',
        };

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'حدث خطأ أثناء التسجيل');
        }

        const userData = normalizeUser(data);
        setUser(userData);
        localStorage.setItem('smartops_user', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('smartops_user');
    };

    const updateUser = (updates) => {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem('smartops_user', JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, googleLogin, updateUser, isAuthenticated: !!user, API_URL }}>
            {children}
        </AuthContext.Provider>
    );
}

function normalizeUser(data) {
    let role = data.user.role;
    if (role === 'SUPER_ADMIN') role = 'super_admin';
    if (role === 'COMPANY_OWNER') role = 'company_owner';
    if (role === 'EMPLOYEE') role = 'employee';

    return {
        ...data.user,
        token: data.access_token,
        role,
        name: data.user.full_name,
    };
}

export const useAuth = () => useContext(AuthContext);

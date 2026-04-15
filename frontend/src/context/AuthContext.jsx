import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:8000/api/v1';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('smartops_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'بيانات الدخول غير صحيحة');
            }

            let role = data.user.role;
            if (role === 'SUPER_ADMIN') role = 'super_admin';
            if (role === 'COMPANY_OWNER') role = 'company_owner';
            if (role === 'EMPLOYEE') role = 'employee';

            const userData = { ...data.user, token: data.access_token, role: role, name: data.user.full_name };
            setUser(userData);
            localStorage.setItem('smartops_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            throw new Error(error.message || 'بيانات الدخول غير صحيحة');
        }
    };

    const register = async (userDataInput) => {
        try {
            const payload = {
                email: userDataInput.email,
                password: userDataInput.password || '123456',
                full_name: userDataInput.name,
                phone: userDataInput.phone || '',
                company_name: userDataInput.companyName,
                sector: userDataInput.sector || 'ecommerce'
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

            let role = data.user.role;
            if (role === 'SUPER_ADMIN') role = 'super_admin';
            if (role === 'COMPANY_OWNER') role = 'company_owner';
            if (role === 'EMPLOYEE') role = 'employee';

            const userData = { ...data.user, token: data.access_token, role: role, name: data.user.full_name };
            setUser(userData);
            localStorage.setItem('smartops_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('smartops_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

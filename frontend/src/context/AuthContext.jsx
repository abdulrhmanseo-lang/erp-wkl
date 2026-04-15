import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const mockUsers = {
    'admin@smartops.ai': { name: 'مدير النظام', role: 'super_admin', company: null },
    'owner@test.com': { name: 'عبدالله المطيري', role: 'company_owner', company: 'مجموعة دار العقار', sector: 'real_estate' },
    'employee@test.com': { name: 'سارة أحمد', role: 'employee', company: 'مجموعة دار العقار', sector: 'real_estate' },
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('smartops_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mockUser = mockUsers[email];
                if (mockUser && password === '123456') {
                    const userData = { email, ...mockUser };
                    setUser(userData);
                    localStorage.setItem('smartops_user', JSON.stringify(userData));
                    resolve(userData);
                } else {
                    reject(new Error('بيانات الدخول غير صحيحة'));
                }
            }, 800);
        });
    };

    const register = (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const userData = {
                    email: data.email,
                    name: data.name,
                    role: 'company_owner',
                    company: data.companyName,
                    sector: data.sector,
                };
                setUser(userData);
                localStorage.setItem('smartops_user', JSON.stringify(userData));
                resolve(userData);
            }, 800);
        });
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

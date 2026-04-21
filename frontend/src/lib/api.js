/** Base origin for FastAPI (no trailing slash). Example: http://localhost:8000 */
export function getApiOrigin() {
    return (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
}

/** Path under /api/v1 — pass "/invoices" or "invoices" */
export function apiV1(path) {
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${getApiOrigin()}/api/v1${p}`;
}

export function authHeaders() {
    try {
        const raw = localStorage.getItem('smartops_user');
        if (!raw) return {};
        const u = JSON.parse(raw);
        if (u?.token) return { Authorization: `Bearer ${u.token}` };
    } catch {
        /* ignore */
    }
    return {};
}

export async function apiFetch(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...(options.headers || {}),
    };
    const res = await fetch(apiV1(path), { ...options, headers });
    return res;
}

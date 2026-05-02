from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .core.config import settings
from .core.database import create_tables, SessionLocal
from .models import models  # noqa: F401 — ensures models are registered
from .services.seeder import seed_database
from .api import auth, companies, dashboard, invoices, ai, employees, hr, reports, clients
from fastapi import Depends, Request
from .api.deps import get_current_user
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables & seed DB. Shutdown: cleanup."""
    create_tables()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="وكل - نظام تشغيل ذكي للشركات السعودية",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    debug=settings.DEBUG,
)

# Rate Limiter setup (Default limit: 100 requests per minute per IP)
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

from fastapi.responses import JSONResponse
import logging

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

if not settings.DEBUG:
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logging.error(f"Unhandled error: {exc}")
        return JSONResponse(
            status_code=500,
            content={"detail": "حدث خطأ داخلي في الخادم."},
        )

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "message": "مرحباً بك في وكل API 🚀",
        "database": "PostgreSQL — connected ✅",
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "database": "connected"}


# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(companies.router, prefix="/api/v1/companies", tags=["Companies"], dependencies=[Depends(get_current_user)])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"], dependencies=[Depends(get_current_user)])
app.include_router(invoices.router, prefix="/api/v1/invoices", tags=["Invoices"], dependencies=[Depends(get_current_user)])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"], dependencies=[Depends(get_current_user)])
app.include_router(employees.router, prefix="/api/v1/employees", tags=["Employees"], dependencies=[Depends(get_current_user)])
app.include_router(hr.router, prefix="/api/v1/hr", tags=["HR"], dependencies=[Depends(get_current_user)])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"], dependencies=[Depends(get_current_user)])
app.include_router(clients.router, prefix="/api/v1/clients", tags=["Clients"], dependencies=[Depends(get_current_user)])

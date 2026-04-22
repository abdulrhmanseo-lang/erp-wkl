from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .core.config import settings
from .core.database import create_tables, SessionLocal
from .models import models  # noqa: F401 — ensures models are registered
from .services.seeder import seed_database
from .api import auth, companies, dashboard, invoices, ai, employees, hr, reports, clients


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
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(companies.router, prefix="/api/v1/companies", tags=["Companies"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(invoices.router, prefix="/api/v1/invoices", tags=["Invoices"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(employees.router, prefix="/api/v1/employees", tags=["Employees"])
app.include_router(hr.router, prefix="/api/v1/hr", tags=["HR"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(clients.router, prefix="/api/v1/clients", tags=["Clients"])

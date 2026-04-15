from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ---- Auth ----

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    company_name: str
    sector: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# ---- Company / Tenant ----

class TenantCreate(BaseModel):
    name: str
    sector: str
    phone: Optional[str] = None
    address: Optional[str] = None


class TenantResponse(BaseModel):
    id: int
    name: str
    sector: str
    subscription_plan: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Invoice ----

class InvoiceCreate(BaseModel):
    client_name: str
    client_phone: Optional[str] = None
    amount: float
    notes: Optional[str] = None
    due_date: Optional[datetime] = None


class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    client_name: str
    amount: float
    vat_amount: float
    total: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Dashboard ----

class DashboardData(BaseModel):
    revenue_today: float
    revenue_month: float
    total_customers: int
    total_orders: int
    ai_insights: list
    activity_feed: list


# ---- AI ----

class AIInsight(BaseModel):
    text: str
    action: str
    priority: str
    type: str

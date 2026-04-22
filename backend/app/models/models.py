from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float, Text, Enum, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base
import enum


class UserRole(str, enum.Enum):
    SUPER_ADMIN = "super_admin"
    COMPANY_OWNER = "company_owner"
    EMPLOYEE = "employee"


class CompanySector(str, enum.Enum):
    CLINIC = "clinic"
    REAL_ESTATE = "real_estate"
    WORKSHOP = "workshop"
    ECOMMERCE = "ecommerce"
    LAW = "law"
    FOOD = "food"
    TECH = "tech"
    EDUCATION = "education"


class SubscriptionPlan(str, enum.Enum):
    BASIC = "basic"
    PRO = "pro"
    ENTERPRISE = "enterprise"


# ---- Users & Tenants ----

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    tenant_type = Column(String(50), default="company")
    cr_number = Column(String(50), nullable=True)
    tax_number = Column(String(50), nullable=True)
    sector = Column(Enum(CompanySector), nullable=False)
    logo_url = Column(String(500), nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    subscription_plan = Column(Enum(SubscriptionPlan), default=SubscriptionPlan.BASIC)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    users = relationship("User", back_populates="tenant")
    invoices = relationship("Invoice", back_populates="tenant")
    employees = relationship("Employee", back_populates="tenant")
    clients = relationship("Client", back_populates="tenant")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.EMPLOYEE)
    is_active = Column(Boolean, default=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tenant = relationship("Tenant", back_populates="users")


# ---- Invoicing ----

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, nullable=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    client_name = Column(String(255), nullable=False)
    client_phone = Column(String(20), nullable=True)
    amount = Column(Float, nullable=False)
    vat_amount = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    status = Column(String(20), default="pending")
    notes = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tenant = relationship("Tenant", back_populates="invoices")


# ---- Employee Management ----

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    position = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    salary = Column(Float, default=0)
    hire_date = Column(Date, nullable=True)
    status = Column(String(20), default="active")  # active, on_leave, terminated
    national_id = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tenant = relationship("Tenant", back_populates="employees")
    attendance_records = relationship("Attendance", back_populates="employee")
    leave_requests = relationship("LeaveRequest", back_populates="employee")


# ---- HR & Attendance ----

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    date = Column(Date, nullable=False)
    check_in = Column(DateTime, nullable=True)
    check_out = Column(DateTime, nullable=True)
    status = Column(String(20), default="present")  # present, absent, late, leave
    notes = Column(Text, nullable=True)

    employee = relationship("Employee", back_populates="attendance_records")


class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    leave_type = Column(String(50), nullable=False)  # annual, sick, personal, emergency
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(Text, nullable=True)
    status = Column(String(20), default="pending")  # pending, approved, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employee = relationship("Employee", back_populates="leave_requests")


# ---- CRM / Client Management ----

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    company = Column(String(255), nullable=True)
    source = Column(String(50), nullable=True)  # website, referral, social, cold_call
    status = Column(String(20), default="active")  # active, inactive, lead, prospect
    total_revenue = Column(Float, default=0)
    notes = Column(Text, nullable=True)
    last_contact = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tenant = relationship("Tenant", back_populates="clients")


# ---- Audit Log ----

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=True)
    entity_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ---- Clinic Module ----

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    medical_notes = Column(Text, nullable=True)
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=30)
    status = Column(String(20), default="scheduled")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ---- Real Estate Module ----

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    title = Column(String(500), nullable=False)
    property_type = Column(String(50), nullable=False)
    price = Column(Float, nullable=False)
    area_sqm = Column(Float, nullable=True)
    bedrooms = Column(Integer, default=0)
    location = Column(String(500), nullable=True)
    status = Column(String(20), default="available")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ---- Workshop Module ----

class ServiceRecord(Base):
    __tablename__ = "service_records"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    car_model = Column(String(255), nullable=False)
    owner_name = Column(String(255), nullable=False)
    owner_phone = Column(String(20), nullable=True)
    service_type = Column(String(255), nullable=False)
    status = Column(String(20), default="waiting")
    cost = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ---- E-Commerce Module ----

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    name = Column(String(500), nullable=False)
    category = Column(String(100), nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    sold_count = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=True)
    total_amount = Column(Float, nullable=False)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ---- Marketing Module ----

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    name = Column(String(255), nullable=False)
    campaign_type = Column(String(50), nullable=True)
    status = Column(String(20), default="draft")
    budget = Column(Float, default=0)
    reach = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    content = Column(Text, nullable=True)
    scheduled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

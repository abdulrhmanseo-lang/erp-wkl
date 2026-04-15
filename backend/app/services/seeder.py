"""
وكل — Database Seeder
Auto-populates the database with demo data on first run.
"""

from sqlalchemy.orm import Session
from ..models.models import (
    Tenant, User, Invoice, Patient, Appointment,
    Property, ServiceRecord, Product, Order, Campaign,
    CompanySector, SubscriptionPlan, UserRole,
)
from ..core.security import get_password_hash
from datetime import datetime, timedelta


def seed_database(db: Session):
    """Seed the database with demo data if empty."""
    if db.query(User).first():
        return  # Already seeded

    # ── Tenants ──
    tenants = [
        Tenant(name="عيادة لمسة جمال", sector=CompanySector.CLINIC, subscription_plan=SubscriptionPlan.PRO, phone="0551112233", address="الرياض، حي النخيل"),
        Tenant(name="مجموعة دار العقار", sector=CompanySector.REAL_ESTATE, subscription_plan=SubscriptionPlan.ENTERPRISE, phone="0559876543", address="الرياض، حي العليا"),
        Tenant(name="ورشة الخليج للسيارات", sector=CompanySector.WORKSHOP, subscription_plan=SubscriptionPlan.BASIC, phone="0553456789", address="جدة، حي الصفا"),
        Tenant(name="متجر الأناقة", sector=CompanySector.ECOMMERCE, subscription_plan=SubscriptionPlan.PRO, phone="0557654321", address="الرياض، حي الملقا"),
        Tenant(name="عيادة الشفاء", sector=CompanySector.CLINIC, subscription_plan=SubscriptionPlan.PRO, phone="0552233445", address="الدمام، حي الفيصلية"),
        Tenant(name="مؤسسة النخبة", sector=CompanySector.ECOMMERCE, subscription_plan=SubscriptionPlan.BASIC, phone="0554455667", address="الرياض، حي الربيع"),
    ]
    db.add_all(tenants)
    db.flush()

    # ── Users ──
    users = [
        User(email="admin@wkl.sa", hashed_password=get_password_hash("123456"), full_name="مدير النظام", role=UserRole.SUPER_ADMIN, phone="0500000000"),
        User(email="owner@test.com", hashed_password=get_password_hash("123456"), full_name="عبدالله المطيري", role=UserRole.COMPANY_OWNER, tenant_id=2, phone="0559876543"),
        User(email="sara@test.com", hashed_password=get_password_hash("123456"), full_name="سارة أحمد", role=UserRole.EMPLOYEE, tenant_id=2, phone="0551234567"),
        User(email="clinic@test.com", hashed_password=get_password_hash("123456"), full_name="د. نورة الحربي", role=UserRole.COMPANY_OWNER, tenant_id=1, phone="0551112233"),
        User(email="workshop@test.com", hashed_password=get_password_hash("123456"), full_name="فهد القحطاني", role=UserRole.COMPANY_OWNER, tenant_id=3, phone="0553456789"),
        User(email="ecom@test.com", hashed_password=get_password_hash("123456"), full_name="خالد العمري", role=UserRole.COMPANY_OWNER, tenant_id=4, phone="0557654321"),
    ]
    db.add_all(users)

    # ── Invoices ──
    now = datetime.utcnow()
    invoices = [
        Invoice(invoice_number="INV-1547", tenant_id=2, client_name="شركة الفجر التقنية", client_phone="0551111111", amount=15000, vat_amount=2250, total=17250, status="paid", created_at=now - timedelta(days=1)),
        Invoice(invoice_number="INV-1546", tenant_id=2, client_name="مؤسسة النخبة", client_phone="0552222222", amount=8500, vat_amount=1275, total=9775, status="pending", created_at=now - timedelta(days=2)),
        Invoice(invoice_number="INV-1545", tenant_id=1, client_name="فاطمة الدوسري", client_phone="0553333333", amount=3200, vat_amount=480, total=3680, status="paid", created_at=now - timedelta(days=3)),
        Invoice(invoice_number="INV-1544", tenant_id=2, client_name="مكتب دار العقار", client_phone="0554444444", amount=22000, vat_amount=3300, total=25300, status="overdue", created_at=now - timedelta(days=5)),
        Invoice(invoice_number="INV-1543", tenant_id=4, client_name="سعود الحربي", client_phone="0555555555", amount=6800, vat_amount=1020, total=7820, status="paid", created_at=now - timedelta(days=6)),
        Invoice(invoice_number="INV-1542", tenant_id=3, client_name="محمد العتيبي", client_phone="0556666666", amount=4500, vat_amount=675, total=5175, status="pending", created_at=now - timedelta(days=7)),
    ]
    db.add_all(invoices)

    # ── Patients (Clinic) ──
    patients = [
        Patient(tenant_id=1, full_name="نورة العتيبي", phone="0551234567", status="active"),
        Patient(tenant_id=1, full_name="فاطمة الدوسري", phone="0559876543", status="active"),
        Patient(tenant_id=1, full_name="مريم الشهري", phone="0553456789", status="inactive"),
        Patient(tenant_id=1, full_name="سارة المالكي", phone="0557654321", status="active"),
        Patient(tenant_id=5, full_name="هند القحطاني", phone="0551122334", status="active"),
    ]
    db.add_all(patients)
    db.flush()

    # ── Appointments ──
    appointments = [
        Appointment(tenant_id=1, patient_id=1, scheduled_at=now + timedelta(days=5), duration_minutes=30, status="scheduled"),
        Appointment(tenant_id=1, patient_id=2, scheduled_at=now + timedelta(days=3), duration_minutes=45, status="scheduled"),
        Appointment(tenant_id=1, patient_id=4, scheduled_at=now + timedelta(days=13), duration_minutes=30, status="scheduled"),
    ]
    db.add_all(appointments)

    # ── Properties (Real Estate) ──
    properties = [
        Property(tenant_id=2, title="فيلا فاخرة - حي الملقا", property_type="فيلا", price=2500000, area_sqm=450, bedrooms=5, location="الرياض، حي الملقا", status="available"),
        Property(tenant_id=2, title="شقة عصرية - حي العليا", property_type="شقة", price=850000, area_sqm=180, bedrooms=3, location="الرياض، حي العليا", status="reserved"),
        Property(tenant_id=2, title="أرض تجارية - طريق الملك", property_type="أرض", price=5000000, area_sqm=1200, bedrooms=0, location="الرياض، طريق الملك فهد", status="available"),
        Property(tenant_id=2, title="مكتب تجاري - حي الورود", property_type="مكتب", price=1200000, area_sqm=250, bedrooms=0, location="الرياض، حي الورود", status="sold"),
    ]
    db.add_all(properties)

    # ── Service Records (Workshop) ──
    services = [
        ServiceRecord(tenant_id=3, car_model="تويوتا كامري 2024", owner_name="خالد العمري", owner_phone="0551111111", service_type="تغيير زيت + فلتر", status="in-progress", cost=350),
        ServiceRecord(tenant_id=3, car_model="هيونداي سوناتا 2023", owner_name="سعود الحربي", owner_phone="0552222222", service_type="فحص شامل", status="completed", cost=500),
        ServiceRecord(tenant_id=3, car_model="نيسان باترول 2025", owner_name="فيصل المتعب", owner_phone="0553333333", service_type="إصلاح فرامل", status="waiting", cost=1200),
        ServiceRecord(tenant_id=3, car_model="لكزس ES 2024", owner_name="عبدالرحمن السعيد", owner_phone="0554444444", service_type="برمجة كمبيوتر", status="in-progress", cost=800),
    ]
    db.add_all(services)

    # ── Products (E-Commerce) ──
    products = [
        Product(tenant_id=4, name="عطر فاخر - مسك طيبة", category="عطور", price=350, stock=45, sold_count=128),
        Product(tenant_id=4, name="حقيبة جلد طبيعي", category="حقائب", price=680, stock=12, sold_count=89),
        Product(tenant_id=4, name="ثوب رجالي فاخر", category="ملابس", price=450, stock=67, sold_count=210),
        Product(tenant_id=4, name="ساعة كلاسيكية", category="إكسسوارات", price=1200, stock=8, sold_count=34),
    ]
    db.add_all(products)

    # ── Orders ──
    orders = [
        Order(tenant_id=4, customer_name="محمد أحمد", customer_phone="0551234567", total_amount=2500, status="pending"),
        Order(tenant_id=4, customer_name="فاطمة السعيد", customer_phone="0559876543", total_amount=1350, status="delivered"),
        Order(tenant_id=4, customer_name="عبدالله المالكي", customer_phone="0553456789", total_amount=4800, status="shipped"),
    ]
    db.add_all(orders)

    # ── Campaigns ──
    campaigns = [
        Campaign(tenant_id=4, name="حملة رمضان كريم", campaign_type="social", status="active", budget=5000, reach=12500, clicks=890, conversions=45),
        Campaign(tenant_id=4, name="خصومات نهاية الموسم", campaign_type="whatsapp", status="scheduled", budget=8000),
        Campaign(tenant_id=2, name="عروض الجمعة البيضاء", campaign_type="google", status="completed", budget=15000, reach=45000, clicks=3200, conversions=180),
        Campaign(tenant_id=1, name="إطلاق خدمة جديدة", campaign_type="social", status="draft", budget=3000),
    ]
    db.add_all(campaigns)

    db.commit()
    print("✅ Database seeded successfully with demo data!")

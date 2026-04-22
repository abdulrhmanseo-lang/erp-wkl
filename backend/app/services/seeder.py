"""
وكل — Database Seeder
Auto-populates the database with demo data on first run.
"""

from sqlalchemy.orm import Session
from ..models.models import (
    Tenant, User, Invoice, Patient, Appointment,
    Property, ServiceRecord, Product, Order, Campaign,
    Employee, Client, Attendance, LeaveRequest,
    CompanySector, SubscriptionPlan, UserRole,
)
from ..core.security import get_password_hash
from datetime import datetime, timedelta, date


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

    # ── Employees ──
    employees = [
        Employee(tenant_id=2, full_name="سارة أحمد", email="sara@test.com", phone="0551234567", position="مدير المبيعات", department="المبيعات", salary=12000, hire_date=date(2024, 1, 15), status="active"),
        Employee(tenant_id=2, full_name="محمد الشهري", email="m.shahri@test.com", phone="0552345678", position="محاسب", department="المالية", salary=9000, hire_date=date(2024, 3, 1), status="active"),
        Employee(tenant_id=2, full_name="فهد العتيبي", email="f.otaibi@test.com", phone="0553456789", position="مطور", department="التقنية", salary=15000, hire_date=date(2023, 6, 15), status="active"),
        Employee(tenant_id=2, full_name="نورة الحربي", email="n.harbi@test.com", phone="0554567890", position="مصممة", department="التقنية", salary=11000, hire_date=date(2024, 5, 1), status="active"),
        Employee(tenant_id=2, full_name="خالد المالكي", email="k.malki@test.com", phone="0555678901", position="مدير التسويق", department="التسويق", salary=13000, hire_date=date(2023, 9, 1), status="active"),
        Employee(tenant_id=2, full_name="مريم السعيد", email="m.saeed@test.com", phone="0556789012", position="خدمة عملاء", department="الدعم", salary=7500, hire_date=date(2024, 7, 1), status="active"),
        Employee(tenant_id=2, full_name="عبدالرحمن القحطاني", email="a.qahtani@test.com", phone="0557890123", position="مندوب مبيعات", department="المبيعات", salary=8000, hire_date=date(2024, 2, 15), status="on_leave"),
        Employee(tenant_id=1, full_name="د. سلمى الدوسري", email="s.dosari@test.com", phone="0558901234", position="طبيبة أسنان", department="الطب", salary=20000, hire_date=date(2023, 1, 1), status="active"),
        Employee(tenant_id=1, full_name="هند العمري", email="h.omari@test.com", phone="0559012345", position="ممرضة", department="التمريض", salary=8500, hire_date=date(2024, 4, 1), status="active"),
        Employee(tenant_id=4, full_name="سعود الحربي", email="s.harbi@test.com", phone="0550123456", position="مدير المتجر", department="العمليات", salary=10000, hire_date=date(2024, 1, 1), status="active"),
    ]
    db.add_all(employees)
    db.flush()

    # ── Attendance ──
    today = date.today()
    attendance_records = []
    for emp in employees[:7]:  # tenant_id=2 employees
        for i in range(5):
            d = today - timedelta(days=i)
            att = Attendance(
                employee_id=emp.id,
                tenant_id=2,
                date=d,
                check_in=datetime(d.year, d.month, d.day, 8, 0),
                check_out=datetime(d.year, d.month, d.day, 17, 0) if i < 4 else None,
                status="present" if i % 5 != 3 else "late",
            )
            attendance_records.append(att)
    db.add_all(attendance_records)

    # ── Leave Requests ──
    leave_requests = [
        LeaveRequest(employee_id=employees[6].id, tenant_id=2, leave_type="annual", start_date=today, end_date=today + timedelta(days=7), reason="إجازة سنوية", status="approved"),
        LeaveRequest(employee_id=employees[1].id, tenant_id=2, leave_type="sick", start_date=today + timedelta(days=3), end_date=today + timedelta(days=5), reason="مراجعة طبية", status="pending"),
    ]
    db.add_all(leave_requests)

    # ── Clients (CRM) ──
    clients = [
        Client(tenant_id=2, name="شركة الفجر التقنية", email="info@alfajr.com", phone="0111234567", company="الفجر التقنية", source="website", status="active", total_revenue=17250),
        Client(tenant_id=2, name="مؤسسة النخبة", email="info@nokhba.com", phone="0112345678", company="مؤسسة النخبة", source="referral", status="active", total_revenue=9775),
        Client(tenant_id=2, name="عبدالله السالم", email="a.salem@gmail.com", phone="0553334455", source="social", status="lead", total_revenue=0),
        Client(tenant_id=2, name="شركة الأصيل", email="info@aseel.sa", phone="0114567890", company="الأصيل للتجارة", source="cold_call", status="prospect", total_revenue=0),
        Client(tenant_id=2, name="مكتب دار العقار", email="info@dar.sa", phone="0554444444", company="دار العقار", source="referral", status="active", total_revenue=25300),
        Client(tenant_id=4, name="سعود الحربي", email="saud@gmail.com", phone="0555555555", source="website", status="active", total_revenue=7820),
        Client(tenant_id=4, name="فاطمة السعيد", email="fatima@gmail.com", phone="0559876543", source="social", status="active", total_revenue=1350),
        Client(tenant_id=1, name="نورة العتيبي", email="noura@gmail.com", phone="0551234567", source="referral", status="active", total_revenue=3680),
    ]
    db.add_all(clients)

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

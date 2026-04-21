import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.models import User, Tenant, UserRole, CompanySector, SubscriptionPlan
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def seed_db():
    db = SessionLocal()
    print("Seeding database...")
    
    # Check if a tenant already exists
    tenant = db.query(Tenant).filter(Tenant.name == "SmartOps Default Client").first()
    if not tenant:
        tenant = Tenant(
            name="SmartOps Default Client",
            sector=CompanySector.CLINIC,
            phone="+966500000000",
            subscription_plan=SubscriptionPlan.PRO
        )
        db.add(tenant)
        db.commit()
        db.refresh(tenant)
        print("Created default tenant.")

    # Check if admin user exists
    admin_user = db.query(User).filter(User.email == "admin@smartops.com").first()
    if not admin_user:
        admin_user = User(
            email="admin@smartops.com",
            hashed_password=get_password_hash("admin123"),
            full_name="System Admin",
            role=UserRole.SUPER_ADMIN,
            tenant_id=tenant.id
        )
        db.add(admin_user)
        db.commit()
        print("Created default admin user (email: admin@smartops.com, password: admin123).")

    # Check if employee user exists
    emp_user = db.query(User).filter(User.email == "emp@smartops.com").first()
    if not emp_user:
        emp_user = User(
            email="emp@smartops.com",
            hashed_password=get_password_hash("emp123"),
            full_name="Employee (Test)",
            role=UserRole.EMPLOYEE,
            tenant_id=tenant.id
        )
        db.add(emp_user)
        db.commit()
        print("Created default employee user (email: emp@smartops.com, password: emp123).")
    
    print("Database seeding completed!")
    db.close()

if __name__ == "__main__":
    seed_db()

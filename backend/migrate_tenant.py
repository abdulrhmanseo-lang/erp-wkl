from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        print("Running migrations...")
        conn.execute(text("ALTER TABLE tenants ADD COLUMN IF NOT EXISTS tenant_type VARCHAR(50) DEFAULT 'company';"))
        conn.execute(text("ALTER TABLE tenants ADD COLUMN IF NOT EXISTS cr_number VARCHAR(50);"))
        conn.execute(text("ALTER TABLE tenants ADD COLUMN IF NOT EXISTS tax_number VARCHAR(50);"))
        conn.commit()
        print("Migrations complete!")
except Exception as e:
    print(f"Migration error: {e}")

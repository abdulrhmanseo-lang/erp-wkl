"""Reset and re-seed the Neon database with new tables."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base, SessionLocal
from app.models.models import *  # noqa — registers all models
from app.services.seeder import seed_database

print("🗑️  Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("✅ Tables dropped.")

print("🔨 Creating all tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created.")

print("🌱 Seeding database...")
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

print("🎉 Done! Database is ready.")

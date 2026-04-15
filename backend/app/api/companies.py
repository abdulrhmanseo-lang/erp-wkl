from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Tenant

router = APIRouter()


@router.get("/")
async def list_companies(db: Session = Depends(get_db)):
    tenants = db.query(Tenant).all()
    companies = [
        {
            "id": t.id,
            "name": t.name,
            "sector": t.sector.value,
            "plan": t.subscription_plan.value,
            "phone": t.phone,
            "address": t.address,
            "is_active": t.is_active,
            "created_at": t.created_at.isoformat() if t.created_at else None,
        }
        for t in tenants
    ]
    return {"companies": companies, "total": len(companies)}


@router.get("/{company_id}")
async def get_company(company_id: int, db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.id == company_id).first()
    if not tenant:
        return {"error": "الشركة غير موجودة"}
    return {
        "id": tenant.id,
        "name": tenant.name,
        "sector": tenant.sector.value,
        "plan": tenant.subscription_plan.value,
        "phone": tenant.phone,
        "address": tenant.address,
        "is_active": tenant.is_active,
    }

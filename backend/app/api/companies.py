from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Tenant

router = APIRouter()


from .deps import get_current_user
from ..models.models import User

@router.get("/")
async def list_companies(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tenant_id = current_user.tenant_id
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        return {"companies": [], "total": 0}
        
    companies = [
        {
            "id": tenant.id,
            "name": tenant.name,
            "sector": tenant.sector.value,
            "plan": tenant.subscription_plan.value,
            "phone": tenant.phone,
            "address": tenant.address,
            "is_active": tenant.is_active,
            "created_at": tenant.created_at.isoformat() if tenant.created_at else None,
        }
    ]
    return {"companies": companies, "total": 1}


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

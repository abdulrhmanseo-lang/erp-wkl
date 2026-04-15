from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..schemas.schemas import UserLogin, UserRegister, Token
from ..core.security import get_password_hash, verify_password, create_access_token
from ..core.database import get_db
from ..models.models import User, Tenant, CompanySector, UserRole

router = APIRouter()


@router.post("/login", response_model=Token)
async def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="بيانات الدخول غير صحيحة")

    # Get tenant info
    tenant_sector = None
    if user.tenant_id:
        tenant = db.query(Tenant).filter(Tenant.id == user.tenant_id).first()
        tenant_sector = tenant.sector.value if tenant else None

    token = create_access_token({"sub": user.email, "role": user.role.value})
    return Token(
        access_token=token,
        user={
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value,
            "tenant_id": user.tenant_id,
            "sector": tenant_sector,
        }
    )


@router.post("/register", response_model=Token)
async def register(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="البريد الإلكتروني مسجل مسبقاً")

    # Create tenant
    sector = CompanySector(data.sector) if data.sector in [s.value for s in CompanySector] else CompanySector.ECOMMERCE
    tenant = Tenant(
        name=data.company_name,
        sector=sector,
        phone=data.phone,
    )
    db.add(tenant)
    db.flush()

    # Create user
    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        full_name=data.full_name,
        phone=data.phone,
        role=UserRole.COMPANY_OWNER,
        tenant_id=tenant.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email, "role": user.role.value})
    return Token(
        access_token=token,
        user={
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value,
            "tenant_id": user.tenant_id,
            "sector": sector.value,
        }
    )

"""وكل — Client/CRM Management API"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..core.database import get_db
from ..models.models import Client

router = APIRouter()


class ClientCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    total_revenue: Optional[float] = None


@router.get("/")
async def list_clients(tenant_id: int = 1, db: Session = Depends(get_db)):
    clients = db.query(Client).filter(Client.tenant_id == tenant_id).order_by(Client.created_at.desc()).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "company": c.company,
            "source": c.source,
            "status": c.status,
            "total_revenue": c.total_revenue,
            "notes": c.notes,
            "last_contact": str(c.last_contact) if c.last_contact else None,
            "created_at": str(c.created_at),
        }
        for c in clients
    ]


@router.post("/")
async def create_client(data: ClientCreate, tenant_id: int = 1, db: Session = Depends(get_db)):
    client = Client(
        tenant_id=tenant_id,
        name=data.name,
        email=data.email,
        phone=data.phone,
        company=data.company,
        source=data.source,
        notes=data.notes,
        last_contact=datetime.utcnow(),
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return {"id": client.id, "message": "تم إضافة العميل بنجاح"}


@router.put("/{client_id}")
async def update_client(client_id: int, data: ClientUpdate, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="العميل غير موجود")

    for field, value in data.dict(exclude_unset=True).items():
        if value is not None:
            setattr(client, field, value)

    client.last_contact = datetime.utcnow()
    db.commit()
    return {"message": "تم تحديث بيانات العميل بنجاح"}


@router.delete("/{client_id}")
async def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="العميل غير موجود")
    db.delete(client)
    db.commit()
    return {"message": "تم حذف العميل بنجاح"}

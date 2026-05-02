from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from ..core.database import get_db
from ..models.models import Invoice, User
from ..schemas.schemas import InvoiceCreate
from .deps import get_current_user

router = APIRouter()


@router.get("/")
async def list_invoices(status: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tenant_id = current_user.tenant_id
    query = db.query(Invoice).filter(Invoice.tenant_id == tenant_id)
    if status:
        query = query.filter(Invoice.status == status)
    invoices = query.order_by(Invoice.created_at.desc()).all()

    return {
        "invoices": [
            {
                "id": inv.id,
                "invoice_number": inv.invoice_number,
                "client_name": inv.client_name,
                "client_phone": inv.client_phone,
                "amount": inv.amount,
                "vat_amount": inv.vat_amount,
                "total": inv.total,
                "status": inv.status,
                "notes": inv.notes,
                "created_at": inv.created_at.isoformat() if inv.created_at else None,
            }
            for inv in invoices
        ],
        "total": len(invoices),
    }


@router.post("/")
async def create_invoice(data: InvoiceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tenant_id = current_user.tenant_id
    amount = float(data.amount)
    vat = round(amount * 0.15, 2)

    # Generate invoice number
    last = db.query(Invoice).filter(Invoice.tenant_id == tenant_id).order_by(Invoice.id.desc()).first()
    next_num = (last.id + 1548) if last else 1548

    invoice = Invoice(
        invoice_number=f"INV-{next_num}",
        tenant_id=tenant_id,
        client_name=data.client_name,
        client_phone=data.client_phone or "",
        amount=amount,
        vat_amount=vat,
        total=round(amount + vat, 2),
        status="pending",
        notes=data.notes or "",
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    return {
        "id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "client_name": invoice.client_name,
        "amount": invoice.amount,
        "vat_amount": invoice.vat_amount,
        "total": invoice.total,
        "status": invoice.status,
    }

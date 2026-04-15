from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from ..core.database import get_db
from ..models.models import Invoice

router = APIRouter()


@router.get("/")
async def list_invoices(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Invoice)
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
async def create_invoice(data: dict, db: Session = Depends(get_db)):
    amount = float(data.get("amount", 0))
    vat = round(amount * 0.15, 2)

    # Generate invoice number
    last = db.query(Invoice).order_by(Invoice.id.desc()).first()
    next_num = (last.id + 1548) if last else 1548

    invoice = Invoice(
        invoice_number=f"INV-{next_num}",
        tenant_id=data.get("tenant_id", 1),
        client_name=data.get("client_name", ""),
        client_phone=data.get("client_phone", ""),
        amount=amount,
        vat_amount=vat,
        total=round(amount + vat, 2),
        status="pending",
        notes=data.get("notes", ""),
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

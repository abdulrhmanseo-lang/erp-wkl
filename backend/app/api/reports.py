"""وكل — Reports & Analytics API"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func as sqlfunc
from ..core.database import get_db
from ..models.models import Invoice, Employee, Client, Order, Campaign, Tenant

router = APIRouter()


@router.get("/revenue")
async def revenue_report(tenant_id: int = 1, db: Session = Depends(get_db)):
    total_revenue = db.query(sqlfunc.coalesce(sqlfunc.sum(Invoice.total), 0)).filter(
        Invoice.tenant_id == tenant_id, Invoice.status == "paid"
    ).scalar()

    pending_revenue = db.query(sqlfunc.coalesce(sqlfunc.sum(Invoice.total), 0)).filter(
        Invoice.tenant_id == tenant_id, Invoice.status == "pending"
    ).scalar()

    overdue_revenue = db.query(sqlfunc.coalesce(sqlfunc.sum(Invoice.total), 0)).filter(
        Invoice.tenant_id == tenant_id, Invoice.status == "overdue"
    ).scalar()

    total_invoices = db.query(sqlfunc.count(Invoice.id)).filter(Invoice.tenant_id == tenant_id).scalar()

    return {
        "total_revenue": float(total_revenue),
        "pending_revenue": float(pending_revenue),
        "overdue_revenue": float(overdue_revenue),
        "total_invoices": total_invoices,
        "collection_rate": round(float(total_revenue) / float(total_revenue + pending_revenue + overdue_revenue) * 100, 1) if (total_revenue + pending_revenue + overdue_revenue) > 0 else 0,
    }


@router.get("/employees")
async def employee_report(tenant_id: int = 1, db: Session = Depends(get_db)):
    total = db.query(sqlfunc.count(Employee.id)).filter(Employee.tenant_id == tenant_id).scalar()
    active = db.query(sqlfunc.count(Employee.id)).filter(Employee.tenant_id == tenant_id, Employee.status == "active").scalar()
    total_salaries = db.query(sqlfunc.coalesce(sqlfunc.sum(Employee.salary), 0)).filter(Employee.tenant_id == tenant_id, Employee.status == "active").scalar()

    departments = db.query(Employee.department, sqlfunc.count(Employee.id)).filter(
        Employee.tenant_id == tenant_id, Employee.department.isnot(None)
    ).group_by(Employee.department).all()

    return {
        "total_employees": total,
        "active_employees": active,
        "total_salaries": float(total_salaries),
        "departments": [{"name": d[0], "count": d[1]} for d in departments],
    }


@router.get("/clients")
async def client_report(tenant_id: int = 1, db: Session = Depends(get_db)):
    total = db.query(sqlfunc.count(Client.id)).filter(Client.tenant_id == tenant_id).scalar()
    active = db.query(sqlfunc.count(Client.id)).filter(Client.tenant_id == tenant_id, Client.status == "active").scalar()
    total_revenue = db.query(sqlfunc.coalesce(sqlfunc.sum(Client.total_revenue), 0)).filter(Client.tenant_id == tenant_id).scalar()

    sources = db.query(Client.source, sqlfunc.count(Client.id)).filter(
        Client.tenant_id == tenant_id, Client.source.isnot(None)
    ).group_by(Client.source).all()

    return {
        "total_clients": total,
        "active_clients": active,
        "total_revenue": float(total_revenue),
        "sources": [{"name": s[0], "count": s[1]} for s in sources],
    }


@router.get("/overview")
async def overview_report(tenant_id: int = 1, db: Session = Depends(get_db)):
    revenue = db.query(sqlfunc.coalesce(sqlfunc.sum(Invoice.total), 0)).filter(Invoice.tenant_id == tenant_id, Invoice.status == "paid").scalar()
    invoices = db.query(sqlfunc.count(Invoice.id)).filter(Invoice.tenant_id == tenant_id).scalar()
    employees = db.query(sqlfunc.count(Employee.id)).filter(Employee.tenant_id == tenant_id).scalar()
    clients = db.query(sqlfunc.count(Client.id)).filter(Client.tenant_id == tenant_id).scalar()
    orders = db.query(sqlfunc.count(Order.id)).filter(Order.tenant_id == tenant_id).scalar()
    campaigns = db.query(sqlfunc.count(Campaign.id)).filter(Campaign.tenant_id == tenant_id).scalar()

    return {
        "total_revenue": float(revenue),
        "total_invoices": invoices,
        "total_employees": employees,
        "total_clients": clients,
        "total_orders": orders,
        "total_campaigns": campaigns,
    }

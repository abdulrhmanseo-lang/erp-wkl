from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..core.database import get_db
from ..models.models import Invoice, Order, Product, User, Tenant

router = APIRouter()


@router.get("/")
async def get_dashboard(db: Session = Depends(get_db)):
    # Revenue
    total_revenue = db.query(func.sum(Invoice.total)).scalar() or 0
    paid_revenue = db.query(func.sum(Invoice.total)).filter(Invoice.status == "paid").scalar() or 0

    # Counts
    total_invoices = db.query(func.count(Invoice.id)).scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_companies = db.query(func.count(Tenant.id)).scalar() or 0

    # Orders
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    pending_orders = db.query(func.count(Order.id)).filter(Order.status == "pending").scalar() or 0

    return {
        "revenue": {"total": round(total_revenue, 2), "paid": round(paid_revenue, 2), "trend": 8.5},
        "customers": {"total": total_users, "companies": total_companies, "trend": 12.3},
        "invoices": {"total": total_invoices, "trend": 5.1},
        "orders": {"total": total_orders, "pending": pending_orders, "trend": -3.2},
        "conversion": {"rate": 4.8, "trend": 1.2},
        "ai_insights": [
            {"id": 1, "type": "warning", "text": "انخفضت مبيعاتك بنسبة 12% هذا الأسبوع", "action": "نقترح إطلاق حملة خصومات", "priority": "high"},
            {"id": 2, "type": "success", "text": "زيادة في التفاعل بنسبة 25%", "action": "استمر في نفس الاستراتيجية", "priority": "medium"},
            {"id": 3, "type": "info", "text": "تم اكتشاف 15 عميل محتمل جديد", "action": "تعيين موظف مبيعات للتواصل", "priority": "medium"},
        ],
        "activity_feed": [
            {"id": 1, "text": "طلب جديد من محمد أحمد - 2,500 ر.س", "time": "منذ 5 دقائق", "type": "order"},
            {"id": 2, "text": "تم إرسال فاتورة #1547 بنجاح", "time": "منذ 15 دقيقة", "type": "invoice"},
            {"id": 3, "text": "عميل جديد: فاطمة السعيد", "time": "منذ ساعة", "type": "customer"},
        ],
        "sales_chart": {
            "labels": ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو"],
            "data": [65000, 78000, 90000, 81000, 95000, 110000, 125000],
        },
    }

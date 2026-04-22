"""وكل — HR & Attendance API"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from ..core.database import get_db
from ..models.models import Attendance, LeaveRequest, Employee

router = APIRouter()


class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: str = "present"
    notes: Optional[str] = None


class LeaveRequestCreate(BaseModel):
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: Optional[str] = None


@router.get("/attendance")
async def list_attendance(tenant_id: int = 1, target_date: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Attendance).filter(Attendance.tenant_id == tenant_id)
    if target_date:
        query = query.filter(Attendance.date == target_date)
    records = query.order_by(Attendance.date.desc()).limit(100).all()
    return [
        {
            "id": r.id,
            "employee_id": r.employee_id,
            "employee_name": r.employee.full_name if r.employee else "—",
            "date": str(r.date),
            "check_in": str(r.check_in) if r.check_in else None,
            "check_out": str(r.check_out) if r.check_out else None,
            "status": r.status,
            "notes": r.notes,
        }
        for r in records
    ]


@router.post("/attendance/check-in")
async def check_in(data: AttendanceCreate, tenant_id: int = 1, db: Session = Depends(get_db)):
    record = Attendance(
        employee_id=data.employee_id,
        tenant_id=tenant_id,
        date=data.date,
        check_in=datetime.utcnow(),
        status=data.status,
        notes=data.notes,
    )
    db.add(record)
    db.commit()
    return {"message": "تم تسجيل الحضور بنجاح"}


@router.put("/attendance/{record_id}/check-out")
async def check_out(record_id: int, db: Session = Depends(get_db)):
    record = db.query(Attendance).filter(Attendance.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="سجل الحضور غير موجود")
    record.check_out = datetime.utcnow()
    db.commit()
    return {"message": "تم تسجيل الانصراف بنجاح"}


@router.get("/leaves")
async def list_leaves(tenant_id: int = 1, db: Session = Depends(get_db)):
    leaves = db.query(LeaveRequest).filter(LeaveRequest.tenant_id == tenant_id).order_by(LeaveRequest.created_at.desc()).all()
    return [
        {
            "id": l.id,
            "employee_id": l.employee_id,
            "employee_name": l.employee.full_name if l.employee else "—",
            "leave_type": l.leave_type,
            "start_date": str(l.start_date),
            "end_date": str(l.end_date),
            "reason": l.reason,
            "status": l.status,
        }
        for l in leaves
    ]


@router.post("/leaves")
async def create_leave(data: LeaveRequestCreate, tenant_id: int = 1, db: Session = Depends(get_db)):
    leave = LeaveRequest(
        employee_id=data.employee_id,
        tenant_id=tenant_id,
        leave_type=data.leave_type,
        start_date=data.start_date,
        end_date=data.end_date,
        reason=data.reason,
    )
    db.add(leave)
    db.commit()
    return {"message": "تم تقديم طلب الإجازة بنجاح"}


@router.put("/leaves/{leave_id}")
async def update_leave_status(leave_id: int, status: str = "approved", db: Session = Depends(get_db)):
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="طلب الإجازة غير موجود")
    leave.status = status
    db.commit()
    return {"message": f"تم تحديث طلب الإجازة إلى {status}"}


@router.get("/payroll-summary")
async def payroll_summary(tenant_id: int = 1, db: Session = Depends(get_db)):
    employees = db.query(Employee).filter(Employee.tenant_id == tenant_id, Employee.status == "active").all()
    total_salaries = sum(e.salary for e in employees)
    return {
        "total_employees": len(employees),
        "total_salaries": total_salaries,
        "average_salary": total_salaries / len(employees) if employees else 0,
        "departments": list(set(e.department for e in employees if e.department)),
    }

"""وكل — Employee Management API"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date
from ..core.database import get_db
from ..models.models import Employee

router = APIRouter()


class EmployeeCreate(BaseModel):
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    salary: float = 0
    hire_date: Optional[date] = None
    national_id: Optional[str] = None


class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    salary: Optional[float] = None
    status: Optional[str] = None
    national_id: Optional[str] = None


@router.get("/")
async def list_employees(tenant_id: int = 1, db: Session = Depends(get_db)):
    employees = db.query(Employee).filter(Employee.tenant_id == tenant_id).order_by(Employee.created_at.desc()).all()
    return [
        {
            "id": e.id,
            "full_name": e.full_name,
            "email": e.email,
            "phone": e.phone,
            "position": e.position,
            "department": e.department,
            "salary": e.salary,
            "hire_date": str(e.hire_date) if e.hire_date else None,
            "status": e.status,
            "national_id": e.national_id,
            "created_at": str(e.created_at),
        }
        for e in employees
    ]


@router.post("/")
async def create_employee(data: EmployeeCreate, tenant_id: int = 1, db: Session = Depends(get_db)):
    employee = Employee(
        tenant_id=tenant_id,
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        position=data.position,
        department=data.department,
        salary=data.salary,
        hire_date=data.hire_date,
        national_id=data.national_id,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return {"id": employee.id, "message": "تم إضافة الموظف بنجاح"}


@router.put("/{employee_id}")
async def update_employee(employee_id: int, data: EmployeeUpdate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="الموظف غير موجود")

    for field, value in data.dict(exclude_unset=True).items():
        if value is not None:
            setattr(employee, field, value)

    db.commit()
    return {"message": "تم تحديث بيانات الموظف بنجاح"}


@router.delete("/{employee_id}")
async def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="الموظف غير موجود")
    db.delete(employee)
    db.commit()
    return {"message": "تم حذف الموظف بنجاح"}

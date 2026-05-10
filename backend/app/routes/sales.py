from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.sale import SaleCreate, SaleResponse
from app.services.sales_service import process_sale
from app.models.sale import Sale

router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)

@router.post("/", response_model=SaleResponse)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    return process_sale(db, sale.model_dump())


@router.get("/", response_model=list[SaleResponse])
def get_sales(db: Session = Depends(get_db)):
    return db.query(Sale).all()
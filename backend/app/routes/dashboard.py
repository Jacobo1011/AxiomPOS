from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.product import Product
from app.models.sale import Sale

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):
    total_sales = db.query(Sale).count()

    revenue = db.query(Sale).all()
    total_revenue = sum(s.total for s in revenue)

    low_stock = db.query(Product).filter(Product.stock < 10).count()

    return {
        "sales": total_sales,
        "revenue": total_revenue,
        "low_stock": low_stock
    }
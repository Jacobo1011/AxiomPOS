from sqlalchemy.orm import Session, joinedload
from app.models.sale import Sale
from app.models.sale_item import SaleItem


def create_sale(db: Session, total: float, items: list):
    sale = Sale(total=total)

    db.add(sale)
    db.commit()
    db.refresh(sale)

    for item in items:
        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=item["product_id"],
            quantity=item["quantity"],
            price=item["price"]
        )
        db.add(sale_item)

    db.commit()

    # 🔥 IMPORTANTE: recargar con items
    sale = db.query(Sale).options(
        joinedload(Sale.items)
    ).filter(Sale.id == sale.id).first()

    return sale
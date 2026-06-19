from sqlalchemy.orm import Session
from app.models.product import Product
from app.repositories.sales_repo import create_sale


def process_sale(db: Session, sale_data: dict):
    total = 0
    sale_items = []

    for item in sale_data["items"]:
        product = db.query(Product).filter(
            Product.id == item["product_id"]
        ).first()

        if not product:
            raise ValueError("Producto no existe")

        if product.stock < item["quantity"]:
            raise ValueError(f"Stock insuficiente para {product.name}")

        product.stock -= item["quantity"]

        subtotal = product.price * item["quantity"]
        total += subtotal

        sale_items.append({
            "product_id": product.id,
            "quantity": item["quantity"],
            "price": product.price
        })

    db.commit()

    return create_sale(db, total, sale_items)
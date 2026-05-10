from sqlalchemy.orm import Session
from app.repositories.product_repo import (
    create_product,
    get_products
)


def create_new_product(db: Session, product_data: dict):
    return create_product(db, product_data)


def list_products(db: Session):
    return get_products(db)
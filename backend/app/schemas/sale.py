from pydantic import BaseModel
from typing import List


class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int


class SaleCreate(BaseModel):
    items: List[SaleItemCreate]


class SaleItemResponse(BaseModel):
    product_id: int
    quantity: int
    price: float


class SaleResponse(BaseModel):
    id: int
    total: float
    items: List[SaleItemResponse]

    class Config:
        from_attributes = True
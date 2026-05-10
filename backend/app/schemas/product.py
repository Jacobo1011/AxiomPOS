from pydantic import BaseModel


class ProductCreate(BaseModel):
    barcode: str
    name: str
    price: float
    stock: int


class ProductResponse(BaseModel):
    id: int
    barcode: str
    name: str
    price: float
    stock: int

    class Config:
        from_attributes = True
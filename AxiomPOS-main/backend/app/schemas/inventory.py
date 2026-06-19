from pydantic import BaseModel


class StockUpdate(BaseModel):
    stock: int
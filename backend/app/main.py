from fastapi import FastAPI
from app.core.database import Base, engine

from app.models.user import User
from app.models.product import Product
from app.models.sale import Sale
from app.models.sale_item import SaleItem
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AxiomPOS API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes.sales import router as sales_router
app.include_router(sales_router)

from app.routes.products import router as product_router
app.include_router(product_router)

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "status": "running",
        "service": "AxiomPOS API"
    }
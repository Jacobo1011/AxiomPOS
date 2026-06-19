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

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
from app.routes import dashboard
app.include_router(dashboard.router)

from app.routes.auth import router as auth_router
app.include_router(auth_router)

from app.routes.users import router as users_router
app.include_router(users_router)

from app.routes.sales import router as sales_router
app.include_router(sales_router)

from app.routes.products import router as product_router
app.include_router(product_router)

# Initialize Database tables
Base.metadata.create_all(bind=engine)

# Auto-seed database if empty
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.models.product import Product
from app.core.security import hash_password

db = SessionLocal()
try:
    if db.query(User).count() == 0:
        admin_user = User(
            username="admin",
            email="admin@axiompos.com",
            hashed_password=hash_password("admin123"),
            role="admin"
        )
        db.add(admin_user)
        db.commit()
finally:
    db.close()


@app.get("/")
def root():
    return {
        "status": "running",
        "service": "AxiomPOS API"
    }
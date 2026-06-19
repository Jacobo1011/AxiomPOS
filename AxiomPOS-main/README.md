#  AxiomPOS

**A modern Point of Sale (POS) system built to simplify inventory management, sales tracking, and day-to-day business operations.**

AxiomPOS is a full-stack POS solution designed for small businesses, local stores, and growing shops that need a simple but scalable way to manage products, sales, and inventory in real time.

The project combines a modern frontend experience with a powerful backend architecture, providing an intuitive workflow for handling transactions, monitoring stock, and organizing business operations efficiently.

Whether you're learning full-stack development, building commercial management software, or experimenting with scalable system design, AxiomPOS offers a practical and real-world foundation.

---

![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)

---

#  Features

* Product registration with barcode support
* Real-time inventory management
* Sales processing and transaction history
* Fast product search system
* Dynamic shopping cart
* Responsive and user-friendly interface
* RESTful API architecture
* Authentication and user management
* Secure and scalable backend structure

---

#  Tech Stack

## Frontend

* **TypeScript** (57.3%) — Main frontend language
* **JavaScript** (1.4%) — Additional frontend functionality
* Modern responsive UI
* Interactive dashboard for sales and inventory management

## Backend

* **Python** (41%) — Backend and business logic
* RESTful API architecture
* Authentication and data validation

## Infrastructure

* **Docker & Docker Compose** — Containerized development and deployment
* Database support for scalable operations

---

#  Project Structure

```
AxiomPOS/
├── frontend/          # Client application
├── backend/           # Backend API
├── database/          # Database scripts and schemas
├── docker/            # Docker configurations
├── docs/              # Project documentation
├── docker-compose.yml # Container orchestration
└── README.md
```

---

#  Requirements

Before getting started, make sure you have installed:

* Docker & Docker Compose
* Node.js 18+
* Python 3.9+
* Git

---

#  Getting Started

## Docker Setup (Recommended)

```bash
# Clone repository
git clone https://github.com/Jacobo1011/AxiomPOS.git

# Enter project folder
cd AxiomPOS

# Start containers
docker-compose up -d
```

After running the containers:

```
Frontend: http://localhost:3000
API: http://localhost:8000
```

---

## Local Development Setup

### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

python manage.py runserver
```

### Frontend

```bash
cd frontend

npm install
npm start
```

---

#  Security

AxiomPOS includes basic security practices and backend validation features such as:

* Input validation
* Secure authentication flow
* SQL injection protection
* Encrypted sensitive data handling

---

#  API Reference

### Create a Product

```http
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "price": 99.99,
  "stock": 50,
  "barcode": "123456789"
}
```

### Process a Sale

```http
POST /api/sales
Content-Type: application/json

{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "payment_method": "cash"
}
```

**Note:** For complete API documentation, refer to the `/docs` folder.

---

#  Development Status

| Component | Status |
|-----------|--------|
| Core POS Features | ✅ Working |
| Inventory Management | ✅ Working |
| Sales Processing | ✅ Working |
| Docker Setup | 🟡 In Progress |
| Authentication | 🟡 In Progress |
| Advanced Reports | 🔵 Planned |

---

#  Contributing

Contributions, ideas, and improvements are always welcome.

If you'd like to contribute:

```bash
# Create a new branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m "Add some AmazingFeature"

# Push changes
git push origin feature/AmazingFeature
```

Then open a Pull Request.

---

#  Roadmap

* [ ] Advanced reports and analytics
* [ ] Online payment integrations
* [ ] Mobile application
* [ ] Multi-branch support
* [ ] Supplier management integration

---

#  License

This project is open source and available under the **Apache License 2.0**.

See the [LICENSE](./LICENSE) file for details.

---

#  Author

[Jacobo1011](https://github.com/Jacobo1011)

AxiomPOS is developed by Jacobo Carrasquilla.

If you use or fork this project, please keep visible credit to the original author.

---

#  Support

If you find a bug or want to suggest improvements:

* Open an issue on [GitHub Issues](https://github.com/Jacobo1011/AxiomPOS/issues)
* Check the project documentation inside the `/docs` folder

---

**Last updated:** 2026-05-10

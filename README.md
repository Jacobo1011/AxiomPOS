#  AxiomPOS

**Un moderno sistema de Punto de Venta (POS) diseñado para simplificar la gestión de inventario, seguimiento de ventas y operaciones diarias del negocio.**

AxiomPOS es una solución POS full-stack diseñada para pequeños negocios, tiendas locales y comercios en crecimiento que necesitan una forma simple pero escalable de gestionar productos, ventas e inventario en tiempo real.

El proyecto combina una experiencia frontend moderna con una potente arquitectura backend, proporcionando un flujo intuitivo para manejar transacciones, monitorear stock y organizar operaciones comerciales.

Tanto si estás aprendiendo desarrollo full-stack, construyendo software de gestión comercial o experimentando con diseño de sistemas escalables, AxiomPOS ofrece una base práctica y del mundo real.

---

![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)

---

#  Características

* Registro de productos con soporte de código de barras
* Gestión de inventario en tiempo real
* Procesamiento de ventas e historial de transacciones
* Sistema de búsqueda de productos rápido
* Carrito de compras dinámico
* Interfaz responsive y amigable
* Arquitectura API RESTful
* Autenticación y gestión de usuarios
* Estructura backend segura y escalable

---

#  Stack Tecnológico

## Frontend

* **TypeScript** (71%) — Lenguaje principal del frontend
* **JavaScript** — Funcionalidad adicional del frontend
* UI responsive moderna
* Dashboard interactivo para gestión de ventas e inventario

## Backend

* **Python** (27.5%) — Backend y lógica de negocio
* Arquitectura API RESTful
* Autenticación y validación de datos

## Infraestructura

* **Docker & Docker Compose** — Desarrollo y despliegue containerizado
* Soporte de base de datos para operaciones escalables

---

#  Estructura del Proyecto

```
AxiomPOS/
├── frontend/          # Aplicación cliente
├── backend/           # API Backend
├── database/          # Scripts y esquemas de base de datos
├── docker/            # Configuraciones de Docker
├── docs/              # Documentación del proyecto
├── docker-compose.yml # Orquestación de contenedores
└── README.md
```

---

#  Requisitos

Antes de comenzar, asegúrate de tener instalado:

* Docker & Docker Compose
* Node.js 18+
* Python 3.9+
* Git

---

#  Primeros Pasos

## Configuración con Docker (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/Jacobo1011/AxiomPOS.git

# Entrar en la carpeta del proyecto
cd AxiomPOS

# Iniciar contenedores
docker-compose up -d
```

Después de ejecutar los contenedores:

```
Frontend: http://localhost:3000
API: http://localhost:8000
```

---

## Configuración Local para Desarrollo

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

#  Seguridad

AxiomPOS incluye prácticas de seguridad básica y características de validación backend como:

* Validación de entrada
* Flujo de autenticación seguro
* Protección contra inyección SQL
* Manejo de datos sensibles cifrados

---

#  Referencia de API

### Crear un Producto

```http
POST /api/products
Content-Type: application/json

{
  "name": "Nombre del Producto",
  "price": 99.99,
  "stock": 50,
  "barcode": "123456789"
}
```

### Procesar una Venta

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

**Nota:** Para documentación completa de la API, consulta la carpeta `/docs`.

---

#  Estado del Desarrollo

| Componente | Estado |
|-----------|--------|
| Características POS Core | ✅ Funcionando |
| Gestión de Inventario | ✅ Funcionando |
| Procesamiento de Ventas | ✅ Funcionando |
| Configuración Docker | 🟡 En Progreso |
| Autenticación | 🟡 En Progreso |
| Reportes Avanzados | 🔵 Planeado |

---

#  Contribuciones

Las contribuciones, ideas y mejoras siempre son bienvenidas.

Si te gustaría contribuir:

```bash
# Crear una nueva rama
git checkout -b feature/AmazingFeature

# Hacer commit de tus cambios
git commit -m "Agregar AmazingFeature"

# Hacer push de los cambios
git push origin feature/AmazingFeature
```

Luego abre un Pull Request.

---

#  Roadmap

* [ ] Reportes y análisis avanzados
* [ ] Integraciones de pagos en línea
* [ ] Aplicación móvil
* [ ] Soporte multi-sucursal
* [ ] Integración de gestión de proveedores

---

#  Licencia

Este proyecto es de código abierto y está disponible bajo la **Licencia Apache 2.0**.

Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

#  Autor

[Jacobo1011](https://github.com/Jacobo1011)

AxiomPOS es desarrollado por Jacobo Carrasquilla.

Si usas o haces fork de este proyecto, por favor mantén visible el crédito al autor original.

---

#  Soporte

Si encuentras un bug o quieres sugerir mejoras:

* Abre un issue en [GitHub Issues](https://github.com/Jacobo1011/AxiomPOS/issues)
* Consulta la documentación del proyecto en la carpeta `/docs`

---

**Última actualización:** 2026-06-19

# StyleCart – Fashion E-Commerce Platform

A production-grade, responsive full-stack clothing e-commerce web platform designed for commercial apparel shopping and crafted for **Java Full-Stack Developer** portfolios and placement interviews.

---

## 🏛 Architecture Overview

```text
stylecart/
│
├── backend/                       # Java 17 + Spring Boot 3 Backend
│   ├── pom.xml                    # Maven dependencies (Spring Security, JPA, JJWT, MySQL)
│   └── src/
│       ├── main/java/com/stylecart/
│       │   ├── StyleCartApplication.java
│       │   ├── config/            # SecurityConfig, CorsConfig, OpenApiConfig
│       │   ├── controller/        # Auth, Product, Category, Cart, Wishlist, Order, User, Admin
│       │   ├── dto/               # Clean Request/Response Data Transfer Objects
│       │   ├── entity/            # JPA Entities (User, Product, Category, Cart, Order, etc.)
│       │   ├── exception/         # GlobalExceptionHandler & Custom Exceptions
│       │   ├── repository/        # Spring Data JPA Repositories
│       │   ├── security/          # JwtService, JwtAuthenticationFilter, UserDetailsService
│       │   └── service/           # Layered Business Logic Services
│       └── main/resources/
│           └── application.yml    # Database, JPA, JWT, and Server Configuration
│
├── src/                           # Modern React 19 Frontend (TypeScript + Tailwind CSS)
│   ├── components/                # Reusable UI (Navbar, CartDrawer, ProductCard, FilterSidebar, etc.)
│   ├── context/                   # AuthContext, CartContext, WishlistContext
│   ├── data/                      # Fashion Catalog Seed Data
│   ├── pages/                     # 25+ Storefront, Customer & Admin Pages
│   ├── services/                  # Axios REST API Client & Dual-Mode Mock/Live Adapter
│   └── types/                     # TypeScript Interfaces matching Spring Boot DTOs
│
├── database/
│   └── schema.sql                 # Complete MySQL 8.0 DDL, Indexes, Constraints & Seed Data
│
├── Dockerfile                     # Multi-stage production container for Spring Boot
├── docker-compose.yml             # Orchestration for MySQL 8.0, Backend & Frontend
└── README.md                      # Documentation & Placement Interview Talking Points
```

---

## 🛠 Technology Stack

### Backend
- **Language**: Java 17 (LTS)
- **Framework**: Spring Boot 3.3.0
- **Security**: Spring Security 6 with Stateless Session Management
- **Authentication**: JWT (JSON Web Tokens) with JJWT 0.12.5 (HMAC-SHA256)
- **Persistence**: Spring Data JPA & Hibernate 6
- **Database**: MySQL 8.0 with InnoDB engine and relational integrity
- **Validation**: Jakarta Bean Validation (`@NotBlank`, `@NotNull`, `@Min`, `@Email`)
- **API Documentation**: SpringDoc OpenAPI 3 / Swagger UI (`/swagger-ui.html`)
- **Build Tool**: Apache Maven

### Frontend
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with custom serif typography (`Playfair Display` + `Plus Jakarta Sans`)
- **HTTP Client**: Axios with request/response interceptors and bearer token injection
- **Icons**: Lucide React
- **Animations**: CSS Transitions + Canvas Confetti on checkout celebration

---

## 🔑 Key Features

### Customer Experience
1. **Catalog & Search**: Instant keyword search across brand, category, name, and description.
2. **Multi-Faceted Filtering**: Filter concurrently by category (Men, Women, Kids, Shoes, Accessories), price range slider, brand checkboxes, sizing (XS-XXL), and minimum star rating.
3. **Product Details Page**: Multi-angle image gallery, size selector with live Size Guide modal, color swatches, stock availability counter, and customer reviews.
4. **Interactive Shopping Cart**: Quantity stepper, size/color variant preservation, free shipping threshold tracker, subtotal, and dynamic discounts.
5. **Wishlist**: 1-click wishlist toggle with immediate "Move to Bag" capability.
6. **3-Step Checkout**: Validated delivery address, mock payment gateway (Credit/Debit Card, UPI, and Cash on Delivery), order summary review.
7. **Order Lifecycle**: Realistic order tracking through `PLACED` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`.
8. **Customer Account**: Profile management, saved delivery address, and past order history.

### Admin Suite
1. **Analytics Dashboard**: Real-time store KPIs: Total Revenue, Total Orders, Active Users, Low-Stock Alerts, and visual monthly revenue charts.
2. **Product Management**: Full CRUD operations for apparel items with multi-size, multi-color, and image management.
3. **Category Management**: Add, update, and toggle categories.
4. **Inventory Control**: Real-time stock monitor with quick restock stepper.
5. **Order Fulfillment**: Track all store orders and update statuses with tracking numbers.
6. **User Administration**: Inspect registered customers and role assignments.

---

## 🚀 How to Run Locally

### Prerequisites
- Java 17+ JDK installed
- Maven 3.8+ installed
- MySQL 8.0+ running locally (or via Docker)
- Node.js 18+ and npm installed

### 1. Database Setup
Log into your MySQL instance and run the schema script:
```bash
mysql -u root -p < database/schema.sql
```
This creates the database `stylecart_db` with pre-populated categories, apparel products, admin, and customer test accounts.

### 2. Run the Spring Boot Backend
```bash
cd backend
# Run with Maven
mvn spring-boot:run
```
The REST API will start at: `http://localhost:8080`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
- Health Check: `http://localhost:8080/actuator/health`

### 3. Run the React Frontend
```bash
# In the project root
npm install
npm run dev
```
The frontend will start at: `http://localhost:3000`

### 4. Or Run Everything via Docker Compose
```bash
docker-compose up --build
```

---

## 🔐 Default Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@stylecart.com` | `admin123` | Full access to Admin Dashboard, Inventory, Products, Orders |
| **Customer** | `user@stylecart.com` | `user123` | Browse catalog, Wishlist, Cart, Checkout, Order History |

*(Note: The live UI includes convenient 1-click Quick Login buttons for both accounts.)*

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Register new customer
- `POST /api/auth/login`: Authenticate and obtain JWT token

### Products (`/api/products`)
- `GET /api/products`: Paginated product catalog with multi-attribute filtering
- `GET /api/products/search?keyword={query}`: Search products
- `GET /api/products/{id}`: Single product details
- `GET /api/products/featured`: Featured collection
- `GET /api/products/new-arrivals`: New arrivals
- `POST /api/products`: Create product *(Admin)*
- `PUT /api/products/{id}`: Update product *(Admin)*
- `DELETE /api/products/{id}`: Soft delete product *(Admin)*
- `PUT /api/products/{id}/stock`: Adjust inventory *(Admin)*

### Cart & Wishlist
- `GET /api/cart`: Current user's cart
- `POST /api/cart/items`: Add item to cart with size & color
- `PUT /api/cart/items/{id}`: Update quantity
- `DELETE /api/cart/items/{id}`: Remove item
- `GET /api/wishlist`: Current user's wishlist
- `POST /api/wishlist/{productId}`: Add to wishlist
- `DELETE /api/wishlist/{productId}`: Remove from wishlist
- `POST /api/wishlist/{productId}/move-to-cart`: Move directly to shopping bag

### Orders & Checkout (`/api/orders`)
- `POST /api/orders`: Place order and deduct inventory
- `GET /api/orders`: User's order history
- `GET /api/orders/{orderNumber}`: Order details & tracking
- `PUT /api/orders/{orderNumber}/cancel`: Cancel order & restore inventory
- `GET /api/orders/admin/all`: List all orders across store *(Admin)*
- `PUT /api/orders/{id}/status`: Update order fulfillment status *(Admin)*

### Admin Analytics (`/api/admin`)
- `GET /api/admin/dashboard`: Metrics, recent orders & monthly revenue data
- `GET /api/admin/users`: User management list

---

## 💼 Placement Interview Talking Points

When presenting this project during a Java Full-Stack Developer interview:

1. **Layered Architecture & Separation of Concerns**:
   Explain how the backend strictly isolates responsibilities: `Controller` (HTTP routing, validation, DTO mapping), `Service` (transactional business logic, inventory verification), `Repository` (Spring Data JPA queries, pagination), `Entity` (JPA database mappings, table indexes, constraints).
2. **Spring Security & Stateless JWT**:
   Highlight the custom `JwtAuthenticationFilter` extending `OncePerRequestFilter`, decoding claims, verifying signatures with HMAC-SHA256, and setting user authorities inside `SecurityContextHolder`. Explain why stateless authentication scales better in cloud container environments than session-based auth.
3. **Database Relational Integrity**:
   Discuss the MySQL schema: `@OneToMany(orphanRemoval = true)` for carts/orders and cart items, foreign key cascade constraints, unique constraints on `email` and composite uniqueness on `(wishlist_id, product_id)`.
4. **Optimistic Locking & Stock Deductions**:
   Explain how inventory stock is validated and deducted within a `@Transactional` boundary when orders are created, and restored if an order is cancelled before shipping.
5. **Global Exception Handling**:
   Explain `@RestControllerAdvice` returning uniform `ErrorResponse` objects with standard HTTP status codes (400, 401, 403, 404, 500) and descriptive messages.

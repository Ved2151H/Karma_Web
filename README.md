# KARAM Safety Equipment E-Commerce Portal - Backend Transition Guide

This document outlines the backend-ready architecture of the KARAM safety equipment frontend clone, providing guidelines, specifications, and instructions for database/REST API integrations.

---

## 1. Directory Structure Map

```text
src/
 ├── api/               # API clients calling endpoints using axiosClient
 │    ├── authApi.js        # Auth session connections (login, register, logout)
 │    ├── productApi.js     # Products CRUD endpoints
 │    ├── categoryApi.js    # Category list administration
 │    ├── orderApi.js       # Customer orders placement and logging
 │    └── userApi.js        # User account management endpoints
 │
 ├── constants/         # Static global constants
 │    ├── categories.js     # Exact subcategory slug and label maps
 │    ├── colors.js         # Theme color codes
 │    ├── navLinks.js       # Menu categories URLs
 │    ├── roles.js          # Authorization system roles mapping (ROLES)
 │    └── routes.js         # Client-side router path mappings (ROUTES)
 │
 ├── context/           # React Context Providers for global state tracking
 │    ├── AuthContext.jsx   # Tracks user profile, JWT, and authentication status
 │    ├── CartContext.jsx   # Shopping cart selections and subtotal calculations
 │    ├── SearchContext.jsx # Real-time queries input in Header search
 │    ├── UIContext.jsx     # Boolean visibilities of CartDrawer, LoginModal, and MobileMenu
 │    └── WishlistContext.jsx # Items marked as favorites
 │
 ├── hooks/             # Custom React hooks consuming APIs and Contexts
 │    ├── useAuth.js        # Exposes authentication functions (login, logout, register)
 │    ├── useProducts.js    # Exposes filtered products, loading states, and products CRUD
 │    ├── useCategories.js  # Exposes categories, loading state, and category CRUD
 │    ├── useOrders.js      # Exposes orders log and order creation/cancellation
 │    ├── useCart.js        # Exposes shopping cart state management
 │    └── useWishlist.js    # Exposes favorite items list
 │
 ├── layouts/           # Structural page wraps
 │    └── MainLayout.jsx    # Header, Navbar, Outlet, Footer, and overlays
 │
 ├── routes/            # Route protections and groupings
 │    ├── ProtectedRoute.jsx# Authorization router guard
 │    ├── UserRoutes.jsx    # Grouping of client protected pages
 │    └── AdminRoutes.jsx   # Grouping of dark-theme administrative panels
 │
 ├── services/          # Low-level network utilities
 │    └── axiosClient.js    # Base Axios instance with bearer token request/response interceptors
 │
 ├── pages/             # View panels
 │    ├── Home.jsx          # Category grid landing page
 │    ├── CategoryPage.jsx  # Split-layout sidebar filter page
 │    └── admin/            # Administrative pages
 │         ├── AdminDashboard.jsx
 │         ├── ProductsManagement.jsx
 │         ├── CategoryManagement.jsx
 │         ├── OrdersManagement.jsx
 │         └── UsersManagement.jsx
```

---

## 2. Global Role Hierarchy

The application employs a role-based authorization model defined in `src/constants/roles.js`:

| Role | Permissions |
| :--- | :--- |
| `SUPER_ADMIN` | Full portal access: Edit products, categories, orders, user roles, logs. |
| `ADMIN` | Management access: Modify products, categories, view orders and customers. |
| `MANAGER` | View dashboard, modify product stocks, check categories. |
| `CUSTOMER` | Place orders, check personal order logs, manage wishlist and cart. |

---

## 3. Client Routing Layout

- **Public Routes**:
  - `/` (Home landing page)
  - `/category/:category` (Split-layout sidebar filters & grid)
  - `/:category/:subcategory` (Dynamic subcategory routing matching exact fields)
  - `/login`, `/register` (Authentication form entries)
- **Protected Client Routes** (Requires `CUSTOMER` or higher):
  - `/profile` (Personal profile configurations)
  - `/orders` (Personal purchase history)
  - `/cart` (Cart summary checkout page)
  - `/wishlist` (Wishlist collection panel)
- **Protected Admin Routes** (Requires `ADMIN` or `SUPER_ADMIN`):
  - `/admin/dashboard` (Statistical cards overview & audit logs)
  - `/admin/products` (Manage catalog details)
  - `/admin/categories` (Add/edit active navigation tabs)
  - `/admin/orders` (Dispatch and process orders)
  - `/admin/users` (List user database and manage roles)

---

## 4. REST API Contracts & JSON Schemas

The frontend expects the backend endpoints to adhere to the following contracts:

### A. Authentication (`/auth`)
- **`POST /auth/register`** -> Creates a new account.
- **`POST /auth/login`** -> Verifies credentials, issues JWT.
  - *Response Schema*:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": "usr-100",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "CUSTOMER"
      }
    }
    ```

### B. Products Catalog (`/products`)
- **`GET /products`** -> Returns product list (supports filtering by `category`, `subcategory`, `brand`, etc.).
  - *Response Schema*:
    ```json
    [
      {
        "id": "prod-101",
        "title": "KARAM HS61 Gloves",
        "category": "hand",
        "subcategory": "cut-resistant-gloves",
        "image": "http://localhost:5000/images/glove.jpg",
        "price": 879,
        "originalPrice": 1278,
        "discount": 31,
        "badge": "Best Seller",
        "description": "ANSI Cut level HPPE gloves.",
        "brand": "KARAM",
        "industry": "Construction",
        "material": "Nitrile",
        "resistanceType": "Cut Resistant",
        "rating": 4.8,
        "dateAdded": "2026-05-18"
      }
    ]
    ```
- **`GET /products/:id`** -> Retrieve single product details.
- **`POST /products`** -> Create product.
- **`PUT /products/:id`** -> Update product.
- **`DELETE /products/:id`** -> Delete product.

### C. Categories (`/categories`)
- **`GET /categories`** -> Retrieve active categories list.
- **`POST /categories`** -> Create category.
- **`PUT /categories/:id`** -> Update category.
- **`DELETE /categories/:id`** -> Delete category.

### D. Orders (`/orders`)
- **`GET /orders`** -> Retrieve orders (scoped to customer if CUSTOMER, full log if ADMIN).
- **`POST /orders`** -> Place order.
  - *Request Body*:
    ```json
    {
      "items": [
        { "id": "prod-101", "quantity": 2 }
      ],
      "total": 1758
    }
    ```
- **`PUT /orders/:id`** -> Update status (Pending, Dispatched, Delivered).
- **`DELETE /orders/:id`** -> Cancel order.

### E. Users (`/users`)
- **`GET /users`** -> List user database.
- **`PUT /users/:id`** -> Modify user metadata or role privilege level.
- **`DELETE /users/:id`** -> Delete user account.

---

## 5. Integrating with Backends

To activate the real-time backend API, update `.env` to point to the backend server:
`VITE_API_BASE_URL=http://<your-backend-ip>:<port>/api`

### Node.js / Express Integration (Example)
```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Auth endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Verify credentials...
  const token = jwt.sign({ id: 'usr-100', role: 'ADMIN' }, 'JWT_SECRET_KEY', { expiresIn: '1d' });
  res.json({
    token,
    user: { id: 'usr-100', name: 'Admin User', email, role: 'ADMIN' }
  });
});

// Products endpoint
app.get('/api/products', (req, res) => {
  // Query DB and return products matching schema...
  res.json(productsList);
});

app.listen(5000, () => console.log('Express API active on port 5000'));
```

### Spring Boot Integration (Example)
```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getProducts(
            @RequestParam(required = false) String category) {
        List<ProductDto> products = productService.fetchByCategory(category);
        return ResponseEntity.ok(products);
    }
}
```

### Django REST Framework Integration (Example)
```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        category = self.request.query_params.get('category')
        if category:
            return self.queryset.filter(category=category)
        return self.queryset

---

## 6. Temporary Development Admin Panel

For testing and development purposes, a frontend-only Admin Panel has been integrated with static mock logins.

### Credentials
- **Username:** `admin`
- **Password:** `1234`

### How to Access
1. Start the Vite local development server:
   ```bash
   npm run dev
   ```
2. Navigate to the login route in your browser:
   - [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
3. Enter the credentials above and click **LOGIN** to access the administration suite.

### Architecture Details
- **Auth Session**: Stored in `localStorage` as `adminAuth: "true"`.
- **Protected Paths**: All `/admin/*` console subpaths (Dashboard, Products, Categories, Orders, Users, Settings) are guarded by `AdminProtectedRoute.jsx` and will automatically redirect to `/admin/login` if the localStorage token is missing or false.
- **Data Model Operations**: The categories, users, and orders management dashboards use interactive local React states initialized from mock datasets, while the products catalog starts empty by default. All additions, edits, or deletions are executed in-memory.
- **Store Settings**: The settings configuration panel stores preferences directly in `localStorage` under the key `adminSettings`.

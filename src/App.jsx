import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';

// Import Global Context Providers
import { UIProvider } from './context/UIContext';
import { SearchProvider } from './context/SearchContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Import Route Guards
import UserRoutes from './routes/UserRoutes';
import AdminProtectedRoute from './routes/AdminProtectedRoute';

// Import Admin Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import UsersManagement from './pages/admin/UsersManagement';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <SearchProvider>
          <WishlistProvider>
            <CartProvider>
              <Routes>
                
                {/* 1. Public client-side routes wrapped in MainLayout */}
                <Route element={<MainLayout />}>
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
                  
                  {/* Category root shortcuts matching route specs */}
                  <Route path="/face" element={<Navigate to="/category/face" replace />} />
                  <Route path="/foot" element={<Navigate to="/category/foot" replace />} />
                  <Route path="/eye" element={<Navigate to="/category/eye" replace />} />
                  <Route path="/hand" element={<Navigate to="/category/hand" replace />} />
                  <Route path="/head" element={<Navigate to="/category/head" replace />} />
                  <Route path="/hearing" element={<Navigate to="/category/hearing" replace />} />
                  <Route path="/fall-protection" element={<Navigate to="/category/fall-protection" replace />} />
                  <Route path="/respiratory" element={<Navigate to="/category/respiratory" replace />} />
                  <Route path="/workwear" element={<Navigate to="/category/workwear" replace />} />
                  <Route path="/gas-detector" element={<Navigate to="/category/gas-detector" replace />} />

                  {/* Auth screen placeholders */}
                  <Route path="/login" element={<div className="p-16 text-center text-xs font-bold uppercase tracking-widest text-neutral-500">Login screen placeholder (Toggle user icon in Header)</div>} />
                  <Route path="/register" element={<div className="p-16 text-center text-xs font-bold uppercase tracking-widest text-neutral-500">Register account placeholder</div>} />
                  
                  {/* 2. Customer-protected routes */}
                  <Route element={<UserRoutes />}>
                    <Route path="/profile" element={<div className="p-16 text-center text-xs font-bold uppercase tracking-widest text-neutral-500">User Profile details</div>} />
                    <Route path="/orders" element={<div className="p-16 text-center text-xs font-bold uppercase tracking-widest text-neutral-500">User Orders History</div>} />
                    <Route path="/cart" element={<div className="p-16 text-center text-xs font-bold uppercase tracking-widest text-neutral-500">Shopping Cart View</div>} />
                    <Route path="/wishlist" element={<div className="p-16 text-center text-xs font-bold uppercase tracking-widest text-neutral-500">User Wishlist View</div>} />
                  </Route>

                  <Route path={ROUTES.PRODUCT} element={<div className="p-16 text-center text-xs font-bold uppercase tracking-widest text-neutral-500">Product Detail view placeholder</div>} />
                </Route>

                {/* 3. Admin Login route (Unprotected) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* 4. Protected Admin Console routes using custom AdminLayout */}
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<ProductsManagement />} />
                  <Route path="categories" element={<CategoryManagement />} />
                  <Route path="orders" element={<OrdersManagement />} />
                  <Route path="users" element={<UsersManagement />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

              </Routes>
            </CartProvider>
          </WishlistProvider>
        </SearchProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;

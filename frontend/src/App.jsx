import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';

// Import Global Context Providers
import { UIProvider } from './context/UIContext';
import { SearchProvider } from './context/SearchContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';

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
      <ProductProvider>
        <UIProvider>
          <SearchProvider>
            <WishlistProvider>
              <CartProvider>
                <Routes>
                
                {/* 1. Public client-side routes wrapped in MainLayout */}
                <Route element={<MainLayout />}>
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
                  <Route path="/:category/:subcategory" element={<CategoryPage />} />
                  <Route path="/:category/:subcategory/:subsection" element={<CategoryPage />} />
                  
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
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* 2. Customer-protected routes */}
                  <Route element={<UserRoutes />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                  </Route>

                  <Route path="/search" element={<SearchResults />} />
                  <Route path={ROUTES.PRODUCT} element={<ProductPage />} />
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
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;

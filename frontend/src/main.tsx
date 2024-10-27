import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AllSales from './pages/AllSales.tsx'
import Sales from './pages/Sales.tsx'
import Returns from './pages/Returns.tsx'
import Categories from './pages/Categories.tsx'
import Customers from './pages/Customers.tsx'
import OperationPopUp from './components/OperationPopUp.tsx'
import ProductPopUp from './components/ProductsPopUp.tsx'
import { Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login.tsx'

// Example authentication function
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken'); // Adjust based on your auth logic
};

// ProtectedRoute component
function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'all-sales',
        element: <ProtectedRoute />, // Protect this route
        children: [
          
          {
            
            path: '',
            element: <AllSales />,
          },
          {
            path: ":orderID",
            element: <OperationPopUp navigation_part="all-sales" />,
          },
        ],
      },
      {
        path: 'sales',
        element: <ProtectedRoute />, // Protect this route
        children: [
          {
            path: '',
            element: <Sales />,
          },
          {
            path: ":orderID",
            element: <OperationPopUp navigation_part="sales" />,
          },
        ],
      },
      {
        path: 'returns',
        element: <ProtectedRoute />, // Protect this route
        children: [
          {
            path: '',
            element: <Returns />,
          },
          {
            path: ":orderID",
            element: <OperationPopUp navigation_part="returns" />,
          },
        ],
      },
      {
        path: 'categories',
        element: <ProtectedRoute />, // Protect this route
        children: [
          {
            path: '',
            element: <Categories />,
            children:[
              {
                path: ":name",
                element: <ProductPopUp />,
              }
            ]
          },
        ],
      },
      {
        path: 'customers',
        element: <ProtectedRoute />, // Protect this route
        children: [
          {
            path: '',
            element: <Customers />,
          },
        ],
      },
      {
        path: "login",
        element: <Login/>, // Add a login route
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

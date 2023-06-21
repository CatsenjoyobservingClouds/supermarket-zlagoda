import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Products from './pages/Products';
import CustomerCards from './pages/CustomerCards';
import StoreProducts from './pages/StoreProducts';
import Categories from './pages/Categories';
import Checks from './pages/Receipts';
import Home from './pages/Home';
import jwt from 'jwt-decode';
import UserInfo from './pages/UserInfo';
import SumAllByCategory from './pages/SumAllByCategory';


interface ProtectedRouteProps {
  path: string,
  page: React.JSX.Element
}

interface RestrictedPages {
  categories: boolean;
  employees: boolean;
  products: boolean;
  receipts: boolean;
  sales: boolean;
  customer_cards: boolean;
  products_in_the_store: boolean
}

export interface IIndexable {
  [key: string]: any
}

interface UserRoles {
  [key: string]: RestrictedPages;
}

const userRoles: UserRoles = {
  Manager: {
    categories: true,
    employees: true,
    products: true,
    receipts: true,
    sales: false,
    customer_cards: true,
    products_in_the_store: true,
  },
  Cashier: {
    categories: true,
    employees: false,
    products: true,
    receipts: true,
    sales: false,
    customer_cards: true,
    products_in_the_store: true,
  },
};



function App() {
  function tokenExpired() {
    handleLogout();
    console.log('userRole deleted from localStorage');
  }

  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("jwt");
  };

  const handleLogin = (jwt_token: string) => {
    setTimeout(tokenExpired, 3600000);
    const parsedJWT = jwt(jwt_token) as IIndexable
    localStorage.setItem("username", parsedJWT["username" as keyof IIndexable])
    localStorage.setItem("role", parsedJWT["role" as keyof IIndexable])
    localStorage.setItem("jwt", jwt_token);
    setUserRole(localStorage.getItem("role"));
  }

  const hasAccess = (path: string) => {
    if (!localStorage.getItem("role")) {
      return false;
    }
    const resource = path.replace(/^\//, '').replaceAll("-", "_");
    return userRoles[userRole as keyof UserRoles][resource as keyof RestrictedPages] || false;
  };



  return (
    <div className='App'>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem("role") ? <Home user={localStorage.getItem("role")} onLogout={handleLogout} /> : <Navigate to="/login" />
            }
          />


          <Route path='/login' element={localStorage.getItem("role") ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path='/user-info' element={localStorage.getItem("role") ? <UserInfo onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path='/units-sold-by-category' element={localStorage.getItem("role") == "Manager" ? <SumAllByCategory /> : <Navigate to="/" />} />
          <Route path='/employees' element={hasAccess("/employees") ? <Employees /> : <Navigate to="/" />} />
          <Route path='/products' element={hasAccess("/products") ? <Products /> : <Navigate to="/" />} />
          <Route path='/receipts' element={hasAccess("/receipts") ? <Checks /> : <Navigate to="/" />} />
          {/* <Route path='/sales' element={hasAccess("/sales") ? <Sales /> : <Navigate to="/" />} /> */}
          <Route path='/customer-cards' element={hasAccess("/customer-cards") ? <CustomerCards /> : <Navigate to="/" />} />
          <Route path='/categories' element={hasAccess("/categories") ? <Categories /> : <Navigate to="/" />} />
          <Route path='/products-in-the-store' element={hasAccess("/products-in-the-store") ? <StoreProducts /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;

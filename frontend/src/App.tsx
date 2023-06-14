import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Products from './pages/Products';
import Sales from './pages/Sales';
import CustomerCards from './pages/CustomerCards';
import StoreProducts from './pages/StoreProducts';
import Categories from './pages/Categories';
import Checks from './pages/Receipts';
import Home from './pages/Home';
import jwt from 'jwt-decode';
import { Navbar } from 'react-bootstrap';
// import Layout from './components/Layout';


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
    categories: false,
    employees: true,
    products: true,
    receipts: true,
    sales: false,
    customer_cards: true,
    products_in_the_store: true,
  },
};


function App() {
  const [userRole, setUserRole] = useState(sessionStorage.getItem("role") || null);

  const handleLogout = () => {
    setUserRole(null);
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("jwt");
  };

  const handleLogin = (jwt_token: string) => {
    const parsedJWT = jwt(jwt_token) as IIndexable
    sessionStorage.setItem("username", parsedJWT["username" as keyof IIndexable])
    sessionStorage.setItem("role", parsedJWT["role" as keyof IIndexable])
    sessionStorage.setItem("jwt", jwt_token);
    setUserRole(sessionStorage.getItem("role"));
  }

  const hasAccess = (path: string) => {
    if (!userRole) {
      console.log("oop");
      return false;
    }
    console.log("done");
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
              userRole ? <Home user={userRole} onLogout={handleLogout} /> : <Navigate to="/login" />
            }
          />

          <Route path='/login' element={<Login onLogin={handleLogin} />} />
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

// return (
//   <div className="App">
//     <BrowserRouter>
//       {<Navigate to="/" />}
//       <Routes>
//         
//         <Route path="/login" element={<Login />} />
//         <NavBar />
// <ProtectedRoute
//   path="/employees"
//   page={<Employees />}
// />
//         <ProtectedRoute
//           path="/products"
//           page={<Products />}
//         />
//         <ProtectedRoute
//           path="/checks"
//           page={<Checks />}
//         />
//         <ProtectedRoute
//           path="/categories"
//           page={<Categories />}
//         />
//         <ProtectedRoute
//           path="/customer-cards"
//           page={<CustomerCards />}
//         />
//         <ProtectedRoute
//           path="/products-in-the-store"
//           page={<StoreProducts />}
//         />
//         <ProtectedRoute
//           path="/sales"
//           page={<Sales />}
//         />
//       </Routes>
//     </BrowserRouter>
//   </div >


// const browserRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: user ? <Menu onLogout={handleLogout} /> :
//       <Login onLogin={(role) => {
//         setUser(role);
//         sessionStorage.setItem("userRole", role);
//       }} />,
//     children: [
//       {
//         path: "*",
//         element: (
//           <Routes>
//             <ProtectedRoute
//               path="employees"
//               page={<Employees />}
//             />
//             <ProtectedRoute
//               path="products"
//               page={<Products />}
//             />
//             <ProtectedRoute
//               path="checks"
//               page={<Checks />}
//             />
//             <ProtectedRoute
//               path="categories"
//               page={<Categories />}
//             />
//             <ProtectedRoute
//               path="customer-cards"
//               page={<CustomerCards />}
//             />
//             <ProtectedRoute
//               path="products-in-the-store"
//               page={<StoreProducts />}
//             />
//             <ProtectedRoute
//               path="sales"
//               page={<Sales />}
//             />
//           </Routes>
//         ),
//       },
//     ],
//   },
// ]);

// return (
//   <div className="App">
//     <>
//       <RouterProvider router={browserRouter}>
//         <Outlet />
//       </RouterProvider>
//     </>
//   </div>
// );

// return (
//   // <Routes>
//   //   <Route path="/" element={<Login />} />
//   //   <Route path="employees" element={<Employees />} />
//   // </Routes>
//   <div className='App'>
//     <Router>
//       <NavBar />
//       <Routes>
//         <Route path='/' element={<Login />} />

//         <Route path='/employees' element={<Employees />} />
//         <Route path='/products' element={<Products />} />
//         <Route path='/checks' element={<Checks />} />
//         <Route path='/sales' element={<Sales />} />
//         <Route path='/customer-cards' element={<CustomerCards />} />
//         <Route path='/categories' element={<Categories />} />
//         <Route path='/products-in-the-store' element={<StoreProducts />} />

//         {/* <Route path='about' element={<About />} />
//         <Route path='cocktail/:id' element={<SingleCocktail />} />
//         <Route path='*' element={<Error />} /> */}
//       </Routes>
//     </Router>
//   </div>

//   // {/* <header className="App-header">
//   //   <img src={logo} className="App-logo" alt="logo" />
//   //   <p>
//   //     Edit <code>src/App.tsx</code> and save to reload.
//   //   </p>
//   //   <a
//   //     className="App-link"
//   //     href="https://reactjs.org"
//   //     target="_blank"
//   //     rel="noopener noreferrer"
//   //   >
//   //     Learn React
//   //   </a>
//   // </header> */}
// );
// }

export default App;

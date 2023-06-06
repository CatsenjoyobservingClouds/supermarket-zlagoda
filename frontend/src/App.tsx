import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Products from './pages/Products';
import Sales from './pages/Sales';
import CustomerCards from './pages/CustomerCards';
import StoreProducts from './pages/StoreProducts';
import Categories from './pages/Categories';
import Checks from './pages/Checks';
// import Layout from './components/Layout';

const ROLES = {
  'Manager': 2001,
  'Cashier': 1984
}

function App() {
  return (
    // <Routes>
    //   <Route path="/" element={<Login />} />
    //   <Route path="employees" element={<Employees />} />
    // </Routes>
    <div className='App'>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Login />} />

          <Route path='/employees' element={<Employees />} />
          <Route path='/products' element={<Products />} />
          <Route path='/checks' element={<Checks />} />
          <Route path='/sales' element={<Sales />} />
          <Route path='/customer-cards' element={<CustomerCards />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/products-in-the-store' element={<StoreProducts />} />

          {/* <Route path='about' element={<About />} />
          <Route path='cocktail/:id' element={<SingleCocktail />} />
          <Route path='*' element={<Error />} /> */}
        </Routes>
      </Router>
    </div>

    // {/* <header className="App-header">
    //   <img src={logo} className="App-logo" alt="logo" />
    //   <p>
    //     Edit <code>src/App.tsx</code> and save to reload.
    //   </p>
    //   <a
    //     className="App-link"
    //     href="https://reactjs.org"
    //     target="_blank"
    //     rel="noopener noreferrer"
    //   >
    //     Learn React
    //   </a>
    // </header> */}
  );
}

export default App;

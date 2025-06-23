import './App.css';
import "./assets/css/style.css";
import "./assets/fonts/stylesheet.css";
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import SignUp from "./pages/admin/SignUp";
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ScrappedData from './pages/admin/ScrappedData';
import SingleScrappedData from './pages/admin/SingleScrappedData';

import MembershipPlans from './pages/admin/MembershipPlans';

import { ToastContainer } from "react-toastify";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scrapped-data" element={<ScrappedData />} />
          <Route path="/scrapped-data/:id" element={<SingleScrappedData />} />

          {/* membership */}
          {/* <Route path="/membership-plans" element={<MembershipPlans />} /> */}
        </Routes>
      </Router>
      <ToastContainer />
    </PrimeReactProvider>
  );
}

export default App;

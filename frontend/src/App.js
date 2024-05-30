import "./App.css";

import  { BrowserRouter as Router, Routes,Route} from 'react-router-dom';

import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
import Header from "./components/layouts/Header";
import {Toaster} from 'react-hot-toast';
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";

function App() {
  return (
    
    <Router>
    <div className="App">
      <Toaster position='top-center'/>
      <Header/>

      <div className="container">
        <Routes>
        <Route path="/" element={<Home/>}   />
        <Route path="/product/:id" element={<ProductDetails />}  />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/me/profile" element={<Profile />} />
        <Route path="/me/update_profile" element={<UpdateProfile />} />
   
       
        </Routes>
      </div>

      <Footer/>
   </div>
   </Router>
  );
}

export default App;

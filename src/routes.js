import React from "react";
import {BrowserRouter, Routes, Route,  Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";

import auth from "./auth";

function PrivateRoute({children}) {
  return auth.isAuthenticated() ? children  : <Navigate to="/login"/>    
};

export default function RoutesApp(props) {
  return (

    <BrowserRouter>
      <Routes>    
        <Route  path="/" element={
          <PrivateRoute>
            <Layout />
            <h1>Tela principal</h1>
            <button onClick={auth.logout}>Logout</button>
          </PrivateRoute>} />
        <Route path="/login" element={<Login/>} />     
      </Routes>
    </BrowserRouter>
  )
}
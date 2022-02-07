import React from "react";
import {BrowserRouter, Routes, Route,  Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ListUsuario from "./pages/ListUsuario";
import CadUsuario from "./pages/CadUsuario";
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
            <Home />
          </PrivateRoute>} />

        <Route  path="/usuarios" element={
          <PrivateRoute>
            <Layout />
            <ListUsuario />
          </PrivateRoute>} />

        <Route  path="/usuarios/add" element={
          <PrivateRoute>
            <Layout />
            <CadUsuario />
          </PrivateRoute>} />
        <Route  path="/usuarios/:id" element={
          <PrivateRoute>
            <Layout />
            <CadUsuario />
          </PrivateRoute>} />
        <Route path="/login" element={<Login/>} />     
      </Routes>
    </BrowserRouter>
  )
}
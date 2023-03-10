import React from "react";
import {BrowserRouter, Routes, Route,  Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CadUsuario from "./pages/CadUsuario";
import Layout from "./components/Layout";
import CadGrupoConta from "./pages/CadGrupoConta";

import auth from "./auth";
import ListGrupoConta from "./pages/ListGrupoConta";
import CadConta from "./pages/CadConta";
import ListConta from "./pages/ListConta";

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

        <Route  path="/usuarios/" element={
          <PrivateRoute>
            <Layout />
            <CadUsuario />
          </PrivateRoute>} />
        <Route  path="/grupo-contas/add" element={
          <PrivateRoute>
            <Layout />
            <CadGrupoConta />
          </PrivateRoute>} />
        <Route  path="/grupo-contas" element={
          <PrivateRoute>
            <Layout />
            <ListGrupoConta />
          </PrivateRoute>} />
        <Route  path="/grupo-contas/:id" element={
          <PrivateRoute>
            <Layout />
            <CadGrupoConta />
          </PrivateRoute>} />

          <Route  path="/contas/add" element={
          <PrivateRoute>
            <Layout />
            <CadConta />
          </PrivateRoute>} /> 

          <Route  path="/contas/:id" element={
          <PrivateRoute>
            <Layout />
            <CadConta />
          </PrivateRoute>} />          
          <Route  path="/contas" element={
          <PrivateRoute>
            <Layout />
            <ListConta />
          </PrivateRoute>} /> 
          
        <Route path="/login" element={<Login/>} /> 
        <Route path="/usuarios/add" element={<CadUsuario/>} />     
      </Routes>
    </BrowserRouter>
  )
}
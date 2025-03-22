import React, { useState } from "react";
import "./NewAccount.css";
import login from "./lo.svg";
import reg from "./re.svg";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewAccount = () => {
  const [style, setStyle] = useState("container");
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const signUpBtnClick = () => {
    setStyle("container sign-up-mode");
  };

  const signInBtnClick = () => {
    setStyle("container");
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/register", registerData);
      Swal.fire("Succès", "Inscription réussie !", "success");
    } catch (error) {
      Swal.fire("Erreur", error.response.data.message, "error");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        loginData
      );

      // Stocker le token et les informations de l'utilisateur dans le localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Stocke toutes les informations de l'utilisateur

      Swal.fire("Succès", "Connexion réussie !", "success").then(() => {
        navigate("/"); // Rediriger vers l'accueil après connexion
      });
    } catch (error) {
      Swal.fire("Erreur", "Email ou mot de passe incorrect.", "error");
    }
  };

  return (
    <div className={style}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Formulaire de connexion */}
          <form className="sign-in-form form" onSubmit={handleLogin}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleLoginChange}
                required
              />
            </div>
            <button type="submit" className="btn">
              Login
            </button>
          </form>

          {/* Formulaire d'inscription */}
          <form className="sign-up-form form" onSubmit={handleRegister}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="name"
                placeholder="Username"
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleRegisterChange}
                required
              />
            </div>
            <button type="submit" className="btn">
              Sign up
            </button>
          </form>
        </div>
      </div>

      {/* Panels gauche et droit */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New Customers</h3>
            <p>
              By creating an account with our store, you will be able to move
              through the checkout process faster, store multiple shipping
              addresses, view and track your orders in your account and more.
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={signUpBtnClick}
            >
              Sign up
            </button>
          </div>
          <img src={login} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Registered Customers</h3>
            <p>If you have an account with us, please login.</p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={signInBtnClick}
            >
              Sign in
            </button>
          </div>
          <img src={reg} className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default NewAccount;

import React, { useEffect, useState } from "react";
import "./Header.css";
import { CardBank } from "./CardBank";
import Navbar from "./Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Header = () => {
  const [navbar, setNavbar] = useState("navbar");
  const [search, setSearch] = useState("search-form");
  const [card, setCard] = useState("shopping-cart");
  const [login, setLogin] = useState("login-form");
  const [userMenu, setUserMenu] = useState("user-menu");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = localStorage.getItem("role");
    if (user) {
      setUserName(user.name);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUserName("");
    setUserRole("");
    navigate("/new-user");
  };

  const navToggle = () => {
    setNavbar(navbar === "navbar" ? "navbar active" : "navbar");
    setSearch("search-form");
    setCard("shopping-cart");
    setLogin("login-form");
    setUserMenu("user-menu");
  };

  const btnSearchClick = () => {
    setSearch(search === "search-form" ? "search-form active" : "search-form");
    setNavbar("navbar");
    setCard("shopping-cart");
    setLogin("login-form");
    setUserMenu("user-menu");
  };

  const btnCardClick = () => {
    setCard(card === "shopping-cart" ? "shopping-cart active" : "shopping-cart");
    setNavbar("navbar");
    setSearch("search-form");
    setLogin("login-form");
    setUserMenu("user-menu");
  };

  const btnUserClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/new-user"); // Rediriger vers la page de connexion
      return; // Arrêter l'exécution de la fonction
    }

    // Si l'utilisateur est connecté, basculer l'affichage du menu utilisateur
    setUserMenu(userMenu === "user-menu" ? "user-menu active" : "user-menu");
    setNavbar("navbar");
    setSearch("search-form");
    setCard("shopping-cart");
    setLogin("login-form");
  };

  useEffect(() => {
    const handleScroll = () => {
      setNavbar("navbar");
      setSearch("search-form");
      setCard("shopping-cart");
      setLogin("login-form");
      setUserMenu("user-menu");
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const removeFromCart = (id) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));

    setCartItems(cart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  useEffect(() => {
    const updateCart = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(updatedCart);
    };

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  return (
    <header className="header">
      <Link to="/">
        <div className="logo fas fa-shopping-basket"></div>
      </Link>

      <Navbar className={navbar} />

      <div className="icons">
        <div className="fas fa-bars" id="menu-btn" onClick={navToggle}></div>
        <div
          className="fas fa-shopping-cart"
          id="card-btn"
          onClick={btnCardClick}
        ></div>
        <div className="fas fa-user" id="user-btn" onClick={btnUserClick}></div>
      </div>

      <form action="" className={search}>
        <input
          type="search"
          name=""
          id="search-box"
          placeholder="search here.."
        />
        <label htmlFor="search-box" className="fas fa-search"></label>
      </form>

      <div className={card}>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div className="box" key={index}>
              <i
                className="fas fa-trash"
                onClick={() => removeFromCart(item.id)}
              ></i>
              <img
                src={`http://127.0.0.1:8000/storage/${item.image}`}
                alt=""
                width={50}
              />
              <div className="content">
                <h3>{item.title}</h3>
                <span className="price">{item.price} DH</span>
                <span className="quantity">
                  qty : {item.quantity} {item.sale_attribute}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No items in cart</p>
        )}
        <div className="total">
          Total:{" "}
          {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}{" "}
          DH
        </div>
        <Link to="/checkout" className="btn">
          Checkout
        </Link>
      </div>

      <div className={userMenu}>
        {userName ? (
          <div className="user-content">
            <p>Welcome, {userName}</p>
            <div className="buttons-container">
              <button
                className="profil-btn"
                onClick={() => navigate(userRole === "admin" ? "/admin/dashboard" : "/profile")}
              >
                {userRole === "admin" ? "Dashboard" : "Profile"}
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <form action="" className={login}>
        <div className="tittle">
          <h3>Login now</h3>
        </div>

        <div className="form-p">
          <div className="row">
            <i className="fas fa-user"></i>
            <input type="text" placeholder="Email or Phone" required />
          </div>

          <div className="row">
            <i className="fas fa-lock"></i>
            <input type="password" placeholder="Password" required />
          </div>

          <div className="pass">
            <a href="#">Forgot password?</a>
          </div>
          <div className="row button">
            <input type="submit" value="Login" />
          </div>
          <div className="signup-link">
            Not a member? <Link to="/new-user">Signup now</Link>
          </div>
        </div>
      </form>
    </header>
  );
};

export default Header;
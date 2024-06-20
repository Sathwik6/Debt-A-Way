import axios from "axios";
import React, { useEffect } from "react";
import $ from "jquery";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/auth/logout`);
      console.log(response);
      navigate("/login");
    } catch (error) {
      toast.error('Invalid Credentials');
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    const updateSelectorPosition = () => {
      var tabsNewAnim = $('#navbarSupportedContent');
      var activeItemNewAnim = tabsNewAnim.find('.active');
      var itemPosNewAnim = activeItemNewAnim.position();
      var activeWidthNewAnim = activeItemNewAnim.innerWidth();
      var activeHeightNewAnim = activeItemNewAnim.innerHeight();

      $(".hori-selector").css({
        "top": itemPosNewAnim.top + "px",
        "left": itemPosNewAnim.left + "px",
        "width": activeWidthNewAnim + "px",
        "height": activeHeightNewAnim + "px"
      });
    };

    $(document).ready(function () {
      setTimeout(updateSelectorPosition, 1);
    });
    $(window).on('resize', function () {
      setTimeout(updateSelectorPosition, 500);
    });
    $("#navbarSupportedContent").on("click", "li", function () {
      $('#navbarSupportedContent ul li').removeClass("active");
      $(this).addClass('active');
      updateSelectorPosition();
    });
    $(".navbar-toggler").click(function () {
      $(".navbar-collapse").slideToggle(300);
      setTimeout(updateSelectorPosition);
    });
  }, []);

  return (
    <nav className="navbar navbar-expand-custom navbar-mainbg">
      <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <i className="fas fa-bars text-white"></i>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <NavLink className="navbar-brand navbar-logo" activeClassName="active" to="/">Debt-A-Way</NavLink>
        <ul className="navbar-nav ml-auto">
          <div className="hori-selector"><div className="left"></div><div className="right"></div></div>
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="active" to="/home"><i className="fas fa-tachometer-alt"></i>Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="active"  to="/shopping"><i className="fa fa-shopping-bag"></i>Shopping</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="active"  to="/mylistings"><i className="far fa-chart-bar"></i>My Listings</NavLink>
          </li>
          <li className="nav-item">
            <a className="nav-link btn" onClick={handleLogout}><i className="fa fa-user"></i>Log-Out</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

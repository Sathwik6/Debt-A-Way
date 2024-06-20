import axios from "axios";
import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import $ from "jquery";
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faShoppingBag, faChartBar, faHome } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes/auth/logout`);
      console.log(response);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateSelectorPosition = () => {
    var tabsNewAnim = $('#navbarSupportedContent');
    var activeItemNewAnim = tabsNewAnim.find('.active');
    if (activeItemNewAnim.length > 0) {
      var itemPosNewAnim = activeItemNewAnim.position();
      var activeWidthNewAnim = activeItemNewAnim.innerWidth();
      var activeHeightNewAnim = activeItemNewAnim.innerHeight();

      $(".hori-selector").css({
        "top": itemPosNewAnim.top + "px",
        "left": itemPosNewAnim.left + "px",
        "width": activeWidthNewAnim + "px",
        "height": activeHeightNewAnim + "px"
      });
    }
  };

  useEffect(() => {
    updateSelectorPosition();
    $(window).on('resize', function () {
      updateSelectorPosition();
    });
    $("#navbarSupportedContent").on("click", "li", function () {
      $('#navbarSupportedContent ul li').removeClass("active");
      $(this).addClass('active');
      updateSelectorPosition();
    });
    $(".navbar-toggler").click(function () {
      $(".navbar-collapse").slideToggle(300);
      setTimeout(updateSelectorPosition, 300);
    });
  }, []);



  return (
    <nav className="navbar navbar-expand-custom navbar-mainbg">
      <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <i className="fas fa-bars text-white"></i>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <NavLink className="navbar-brand navbar-logo" to="/">Debt-A-Way</NavLink>
        <ul className="navbar-nav ml-auto">
          <div className="hori-selector"><div className="left"></div><div className="right"></div></div>
          <li className="nav-item">
            <NavLink className="nav-link" to="/home" activeClassName="active">
              <FontAwesomeIcon icon={faHome} /> Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/shopping" activeClassName="active">
              <FontAwesomeIcon icon={faShoppingBag} /> Shopping
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/mylistings" activeClassName="active">
              <FontAwesomeIcon icon={faChartBar} /> My Listings
            </NavLink>
          </li>
          <li className="nav-item">
            <a className="nav-link btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Log-Out
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

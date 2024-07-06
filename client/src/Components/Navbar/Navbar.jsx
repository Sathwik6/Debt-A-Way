import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import $ from "jquery";
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faShoppingBag, faChartBar, faHome, faUser, faBook, faAddressCard} from '@fortawesome/free-solid-svg-icons';
import { faFaceGrinTears } from "@fortawesome/free-regular-svg-icons";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('User');

  const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };


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

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes/user/get-user`);
            setUsername(response.data.username);
        } catch (error) {
            console.log("Username fetching failed", error);
        }
    };

    fetchUser();
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
            <a className="nav-link btn" onClick={toggleDropdown}>
              <FontAwesomeIcon icon={faUser} /> {username}
            </a>
          </li>
        </ul>
      </div>
      {(!dropdownOpen)? <></>: (
        <div className="dropdown-section">
          <ul className="dropdownbox">
          <li>
            <NavLink to="/transaction-logs" className="drop-nav-link">
              <FontAwesomeIcon icon={faBook} />{" "}
              <span className="nav-item-name ">Transactions</span>
            </NavLink>
          </li>
          <li>
          <NavLink to="/user-details" className="drop-nav-link">
          <FontAwesomeIcon icon={faAddressCard} />{" "}
              <span className="nav-item-name">User Details</span>
            </NavLink>
          </li>
          <li>
          <a to="/home" className="drop-nav-link" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> {" "}Log-Out
            </a>
          </li>
        </ul>
      </div>
      )}
    </nav>
  );
};

export default Navbar;

import { NavLink } from "react-router-dom";
import { FaHome, FaPlus, FaUser, FaSyncAlt } from "react-icons/fa";
import "./navbar.css";

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="navbar-title">
        <img src="Food-hub.svg" alt=""/>
      </div>
      <nav className="nav-menu">
        <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaHome className="icon" /> Home
        </NavLink>
        <NavLink to="/create" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaPlus className="icon" /> Add Food
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaUser className="icon" /> Profile
        </NavLink>
      </nav>

    </div>
  );
};

export default NavBar;
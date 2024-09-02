import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTachometerAlt,
  faAddressBook,
  faUsers,
  faCopy,
  faExchangeAlt,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ onToggle, isHeaderHidden }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    
    if (typeof onToggle === 'function') {
      onToggle();  // Only call onToggle if it's a valid function
    } else {
      console.warn('onToggle is not a function');  // Warn in console if onToggle is not a function
    }
  };

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : ''} ${isHeaderHidden ? 'no-header' : ''}`}>
      <nav className="sidebar-nav">
        <div className="hamburger" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <ul className="main-menu">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              <FontAwesomeIcon icon={faTachometerAlt} />
              {isExpanded && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/bibliotekari" className={({ isActive }) => isActive ? 'active' : ''}>
              <FontAwesomeIcon icon={faAddressBook} />
              {isExpanded && <span>Librarians</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/ucenici" className={({ isActive }) => isActive ? 'active' : ''}>
              <FontAwesomeIcon icon={faUsers} />
              {isExpanded && <span>Students</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/books" className={({ isActive }) => isActive ? 'active' : ''}>
              <FontAwesomeIcon icon={faCopy} />
              {isExpanded && <span>Books</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/authors" className={({ isActive }) => isActive ? 'active' : ''}>
              <FontAwesomeIcon icon={faAddressBook} />
              {isExpanded && <span>Authors</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/publishing" className={({ isActive }) => isActive ? 'active' : ''}>
              <FontAwesomeIcon icon={faExchangeAlt} />
              {isExpanded && <span>Book Publishing</span>}
            </NavLink>
          </li>
        </ul>
        <ul className="bottom-menu">
          <li>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              <FontAwesomeIcon icon={faCog} />
              {isExpanded && <span>Settings</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default React.memo(Sidebar);
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <div className="hamburger" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="#dashboard">
              <FontAwesomeIcon icon={faTachometerAlt} />
              {isExpanded && <span>Dashboard</span>}
            </a>
          </li>
          <li>
            <a href="#librarians">
              <FontAwesomeIcon icon={faAddressBook} />
              {isExpanded && <span>Librarians</span>}
            </a>
          </li>
          <li>
            <a href="#students">
              <FontAwesomeIcon icon={faUsers} />
              {isExpanded && <span>Students</span>}
            </a>
          </li>
          <li>
            <Link to="/books">
              <FontAwesomeIcon icon={faCopy} />
              {isExpanded && <span>Books</span>}
            </Link>
          </li>
          <li>
            <a href="#authors">
              <FontAwesomeIcon icon={faAddressBook} />
              {isExpanded && <span>Authors</span>}
            </a>
          </li>
          <li>
            <a href="#publishing">
              <FontAwesomeIcon icon={faExchangeAlt} />
              {isExpanded && <span>Book Publishing</span>}
            </a>
          </li>
          <li>
            <a href="/">
              <FontAwesomeIcon icon={faCog} />
              {isExpanded && <span>Settings</span>}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
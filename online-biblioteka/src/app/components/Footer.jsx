import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css'; // Assuming you have some CSS for styling

const Footer = () => {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-section about">
                    <h2>Online Biblioteka</h2>
                    <p>
                        A Modern Library Web App for managing and accessing a wide range of
                        resources. Discover a world of knowledge at your fingertips.
                    </p>
                </div>
                <div className="footer-section links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><NavLink to="/" activeClassName="active">Home</NavLink></li>
                        <li><NavLink to="/books" activeClassName="active">Catalog</NavLink></li>
                        <li><NavLink to="/membership" activeClassName="active">Membership</NavLink></li>
                        <li><NavLink to="/support" activeClassName="active">Support</NavLink></li>
                    </ul>
                </div>
                <div className="footer-section contact">
                    <h2>Contact Us</h2>
                    <p>Email: <a href="mailto:support@biblioteka.com">support@biblioteka.com</a></p>
                    <p>Phone: +382 (555) 123-567</p>
                    <p>Address: 123 Library St, Booktown, BK 12345</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 ICT Cortex. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;

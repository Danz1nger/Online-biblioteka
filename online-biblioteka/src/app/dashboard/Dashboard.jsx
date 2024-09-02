import React from 'react';
import './Dashboard.css';  // Import the CSS file for styling

const Dashboard = () => {
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        {/* Activities Card */}
        <div className="dashboard-card">
          <h2>Aktivnosti</h2>
          <ul className="activity-list">
            <li className="activity-item">
              <img src="https://biblioteka.simonovicp.com/img/profile.jpg" alt="User avatar" className="activity-avatar" />
              <div>
                <strong>Marko Marković</strong> je iznajmio knjigu "Rat i mir"
                <small>prije 2 sata</small>
              </div>
            </li>
            <li className="activity-item">
              <img src="https://biblioteka.simonovicp.com/img/profile.jpg" alt="User avatar" className="activity-avatar" />
              <div>
                <strong>Ana Anić</strong> je vratila knjigu "1984"
                <small>prije 5 sati</small>
              </div>
            </li>
            <li className="activity-item">
              <img src="https://biblioteka.simonovicp.com/img/profile.jpg" alt="User avatar" className="activity-avatar" />
              <div>
                <strong>Ivan Ivić</strong> je produžio rok za knjigu "Majstor i Margarita"
                <small>prije 1 dan</small>
              </div>
            </li>
          </ul>
        </div>

        {/* Reservations Card */}
        <div className="dashboard-card">
          <h2>Rezervacije knjiga</h2>
          <ul className="reservations-list">
            <li className="reservation-item">
              <img src="https://biblioteka.simonovicp.com/img/profile.jpg" alt="User avatar" className="reservation-avatar" />
              <div>
                <strong>Petar Petrović</strong>
                <div>Gospodar prstenova</div>
                <small>31.05.2023</small>
              </div>
            </li>
            <li className="reservation-item">
              <img src="https://biblioteka.simonovicp.com/img/profile.jpg" alt="User avatar" className="reservation-avatar" />
              <div>
                <strong>Ivana Ivanović</strong>
                <div>Hari Poter i kamen mudrosti</div>
                <small>02.06.2023</small>
              </div>
            </li>
            <li className="reservation-item">
              <img src="https://biblioteka.simonovicp.com/img/profile.jpg" alt="User avatar" className="reservation-avatar" />
              <div>
                <strong>Nikola Nikolić</strong>
                <div>Sto godina samoće</div>
                <small>05.06.2023</small>
              </div>
            </li>
          </ul>
        </div>

        {/* Statistics Card */}
        <div className="dashboard-card">
          <h2>Statistika</h2>
          <div className="statistics">
            <div>
              <strong>Iznajmljene knjige</strong>
              <div className="stat-bar" style={{ width: '75%', backgroundColor: '#4CAF50' }}></div>
              <span>75</span>
            </div>
            <div>
              <strong>Rezervisane knjige</strong>
              <div className="stat-bar" style={{ width: '45%', backgroundColor: '#FFC107' }}></div>
              <span>45</span>
            </div>
            <div>
              <strong>Knjige van roka</strong>
              <div className="stat-bar" style={{ width: '15%', backgroundColor: '#F44336' }}></div>
              <span>15</span>
            </div>
          </div>
        </div>

        {/* Most Popular Books Card */}
        <div className="dashboard-card">
          <h2>Najpopularnije knjige</h2>
          <ol>
            <li>Na Drini ćuprija - Ivo Andrić</li>
            <li>Derviš i smrt - Meša Selimović</li>
            <li>Prokleta avlija - Ivo Andrić</li>
            <li>Tvrđava - Meša Selimović</li>
            <li>Koreni - Dobrica Ćosić</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

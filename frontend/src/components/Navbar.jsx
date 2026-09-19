import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div className="navbar-logo">DevTinder</div>
      <div className="navbar-right">
        {user && <span className="welcome-text">Welcome, {user.name}</span>}
        <div className="hamburger-wrapper" ref={ref}>
          <button className="hamburger-btn" onClick={() => setOpen(!open)}>☰</button>
          {open && (
            <div className="dropdown-menu">
              {user && (
                <div className="user-card">
                  <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
              )}
              <Link to="/premium" className="dropdown-item" onClick={() => setOpen(false)}>
                💎 Buy Membership
              </Link>
              {user
                ? <button className="dropdown-item logout" onClick={handleLogout}>🚪 Logout</button>
                : <Link to="/login" className="dropdown-item" onClick={() => setOpen(false)}>🔐 Login</Link>
              }
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

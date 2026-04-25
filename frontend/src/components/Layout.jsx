import { Link, useLocation } from 'react-router-dom';
import '../App.css';

export default function Layout({ children, projectId }) {
  const location = useLocation();
  const onDetailPage = location.pathname.startsWith('/projects/');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Oktawave</Link>
        <div className="nav-links">
          <Link to="/" className={!onDetailPage ? 'active' : ''}>Projects</Link>
          {onDetailPage && projectId && (
            <>
              <a href="#bids">Bids</a>
              <a href="#assignment">Assignment</a>
              <a href="#milestones">Milestones</a>
              <a href="#payments">Payments</a>
            </>
          )}
        </div>
      </nav>
      <main className="page-container" style={{ flex: 1 }}>
        {children}
      </main>
      <footer className="footer">Oktawave &copy; 2024</footer>
    </div>
  );
}

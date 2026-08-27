import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-mark">CRS Gateway</p>
          <h1 className="brand-title">Course Registration Portal</h1>
        </div>

        <div className="topbar-right">
          <nav className="nav-links" aria-label="Main navigation">
            <NavLink
              to="/courses"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Mon hoc
            </NavLink>
            {user ? <NavLink to="/registrations" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Dang ky hoc phan</NavLink> : null}
            {user?.role === "ADMIN" ? <NavLink to="/admin/courses" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Quan tri mon hoc</NavLink> : null}
          </nav>

          {user ? <div className="user-box">
            <span>Xin chao, {user.username} ({user.role})</span>
            <button type="button" className="btn ghost" onClick={logout}>Dang xuat</button>
          </div> : <NavLink to="/login" className="btn ghost">Dang nhap</NavLink>}
        </div>
      </header>

      <main className="content-wrap">
        <Outlet />
      </main>
    </div>
  );
}

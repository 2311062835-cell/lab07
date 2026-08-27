import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

interface RouterState {
  from?: string;
}

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as RouterState | null;

  const [username, setUsername] = useState("student1");
  const [password, setPassword] = useState("student123");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const targetPath = state?.from ?? "/courses";

  if (isLoading) {
    return <div className="route-loading" role="status">Dang kiem tra phien dang nhap...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={targetPath} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ username, password });
      navigate(targetPath, { replace: true });
    } catch {
      setError("Dang nhap that bai. Vui long kiem tra username/password hoac API Gateway.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <section className="auth-card">
        <p className="eyebrow">Microservices CRS</p>
        <h1>Dang nhap he thong</h1>
        <p className="muted">
          Frontend ket noi qua API Gateway: <strong>http://localhost:8080</strong>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="student1"
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="student123"
            type="password"
            autoComplete="current-password"
            required
          />

          {error ? <p className="error-text">{error}</p> : null}

          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Dang xu ly..." : "Dang nhap"}
          </button>
        </form>
      </section>
    </div>
  );
}

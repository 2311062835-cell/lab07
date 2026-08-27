import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="notfound-page">
      <h1>404</h1>
      <p>Trang ban tim khong ton tai.</p>
      <Link className="btn" to="/">
        Ve trang chu
      </Link>
    </div>
  );
}

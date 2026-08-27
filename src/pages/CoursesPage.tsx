import { useEffect, useMemo, useState } from "react";
import { getCourses } from "../api/courseApi";
import type { Course } from "../types/course";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getCourses(keyword || undefined, 0, 100);
        if (!controller.signal.aborted) {
          setCourses(result);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Khong lay duoc danh sach mon hoc. Kiem tra course-service va gateway.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => controller.abort();
  }, [keyword]);

  const stats = useMemo(() => {
    const total = courses.length;
    const totalSeat = courses.reduce((sum, item) => sum + item.soChoToiDa, 0);
    const openSeat = courses.reduce((sum, item) => sum + item.soChoConLai, 0);

    return { total, totalSeat, openSeat };
  }, [courses]);

  return (
    <section className="page-panel">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Course Service</p>
          <h2>Danh sach mon hoc</h2>
        </div>

        <input
          className="search-input"
          placeholder="Tim theo ten mon hoc"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Tong so mon</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="stat-card">
          <span>Tong so cho</span>
          <strong>{stats.totalSeat}</strong>
        </article>
        <article className="stat-card">
          <span>Cho con lai</span>
          <strong>{stats.openSeat}</strong>
        </article>
      </div>

      {loading ? <p className="muted">Dang tai du lieu...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !error ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ten mon hoc</th>
                <th>Tin chi</th>
                <th>So cho toi da</th>
                <th>Con lai</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.tenMonHoc}</td>
                  <td>{course.soTinChi}</td>
                  <td>{course.soChoToiDa}</td>
                  <td>{course.soChoConLai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

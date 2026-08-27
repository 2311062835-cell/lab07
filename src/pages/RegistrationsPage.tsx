import { useEffect, useState } from "react";
import { cancelRegistration, createRegistration, getRegistrations } from "../api/registrationApi";
import type { Registration } from "../types/registration";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [studentId, setStudentId] = useState("1");
  const [courseId, setCourseId] = useState("1");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const data = await getRegistrations();
      setRegistrations(data);
      setError("");
    } catch {
      setError("Khong lay duoc du lieu dang ky. Kiem tra registration-service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const data = await getRegistrations();
        if (active) {
          setRegistrations(data);
          setError("");
        }
      } catch {
        if (active) {
          setError("Khong lay duoc du lieu dang ky. Kiem tra registration-service.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, []);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createRegistration({
        studentId: Number(studentId),
        courseId: Number(courseId),
      });
      await loadData();
      setCourseId("1");
    } catch {
      setError("Tao dang ky that bai. Kiem tra du lieu student_id/course_id.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id: number) => {
    setError("");

    try {
      await cancelRegistration(id);
      await loadData();
    } catch {
      setError("Khong huy duoc dang ky. Kiem tra endpoint cancel ben backend.");
    }
  };

  return (
    <section className="page-panel">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Registration Service</p>
          <h2>Quan ly dang ky mon hoc</h2>
        </div>
      </div>

      <form className="inline-form" onSubmit={handleCreate}>
        <label htmlFor="studentId">Student ID</label>
        <input
          id="studentId"
          value={studentId}
          onChange={(event) => setStudentId(event.target.value)}
          required
        />

        <label htmlFor="courseId">Course ID</label>
        <input
          id="courseId"
          value={courseId}
          onChange={(event) => setCourseId(event.target.value)}
          required
        />

        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Dang tao..." : "Tao dang ky"}
        </button>
      </form>

      {loading ? <p className="muted">Dang tai danh sach dang ky...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student ID</th>
                <th>Course ID</th>
                <th>Ngay dang ky</th>
                <th>Trang thai</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.studentId}</td>
                  <td>{item.courseId}</td>
                  <td>{item.ngayDangKy ? new Date(item.ngayDangKy).toLocaleString("vi-VN") : "-"}</td>
                  <td>
                    <span className={item.trangThai === "DA_HUY" ? "status canceled" : "status active"}>
                      {item.trangThai}
                    </span>
                  </td>
                  <td>
                    {item.trangThai !== "DA_HUY" ? (
                      <button type="button" className="btn danger" onClick={() => handleCancel(item.id)}>
                        Huy
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

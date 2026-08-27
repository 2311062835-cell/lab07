import { useEffect, useState } from "react";
import { createCourse, deleteCourse, getCourses, updateCourse } from "../api/courseApi";
import type { Course } from "../types/course";

interface CourseForm {
  tenMonHoc: string;
  soTinChi: string;
  soChoToiDa: string;
}

const emptyForm: CourseForm = { tenMonHoc: "", soTinChi: "3", soChoToiDa: "50" };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    setLoading(true);
    try {
      setCourses(await getCourses(undefined, 0, 100));
      setError("");
    } catch {
      setError("Khong tai duoc danh sach mon hoc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      await loadCourses();
    };

    void run();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      tenMonHoc: form.tenMonHoc.trim(),
      soTinChi: Number(form.soTinChi),
      soChoToiDa: Number(form.soChoToiDa),
    };

    try {
      if (editingId === null) {
        await createCourse(payload);
      } else {
        await updateCourse(editingId, payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadCourses();
    } catch {
      setError("Khong luu duoc mon hoc. Kiem tra quyen ADMIN va course-service.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setForm({
      tenMonHoc: course.tenMonHoc,
      soTinChi: String(course.soTinChi),
      soChoToiDa: String(course.soChoToiDa),
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Ban co chac muon xoa mon hoc nay?")) return;
    try {
      await deleteCourse(id);
      await loadCourses();
    } catch {
      setError("Khong xoa duoc mon hoc.");
    }
  };

  return (
    <section className="page-panel">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Quan tri mon hoc</h2>
        </div>
      </div>

      <form className="course-form" onSubmit={handleSubmit}>
        <input aria-label="Ten mon hoc" placeholder="Ten mon hoc" value={form.tenMonHoc} onChange={(event) => setForm({ ...form, tenMonHoc: event.target.value })} required />
        <input aria-label="So tin chi" type="number" min="1" value={form.soTinChi} onChange={(event) => setForm({ ...form, soTinChi: event.target.value })} required />
        <input aria-label="So cho toi da" type="number" min="1" value={form.soChoToiDa} onChange={(event) => setForm({ ...form, soChoToiDa: event.target.value })} required />
        <button className="btn" type="submit" disabled={saving}>{saving ? "Dang luu..." : editingId === null ? "Them moi" : "Cap nhat"}</button>
        {editingId !== null ? <button className="btn ghost-dark" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Huy</button> : null}
      </form>

      {error ? <p className="error-text">{error}</p> : null}
      {loading ? <p className="muted">Dang tai du lieu...</p> : null}
      {!loading ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Ten mon hoc</th><th>Tin chi</th><th>So cho</th><th>Thao tac</th></tr></thead>
            <tbody>{courses.map((course) => <tr key={course.id}><td>{course.id}</td><td>{course.tenMonHoc}</td><td>{course.soTinChi}</td><td>{course.soChoToiDa}</td><td className="action-cell"><button className="btn small" type="button" onClick={() => handleEdit(course)}>Sua</button><button className="btn danger small" type="button" onClick={() => void handleDelete(course.id)}>Xoa</button></td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

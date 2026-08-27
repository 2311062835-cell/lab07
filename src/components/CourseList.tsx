import type { Course } from "../types/course";
import type { LoadState } from "../api/useCourses";

interface CourseListProps {
  courses: Course[];
  state: LoadState;
  errorMessage: string;
  onRetry: () => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

export default function CourseList({ courses, state, errorMessage, onRetry, onEdit, onDelete }: CourseListProps) {
  if (state === "loading") return <p className="muted">Dang tai danh sach mon hoc...</p>;
  if (state === "error") return <div className="error-panel"><p className="error-text">{errorMessage}</p><button className="btn" onClick={onRetry}>Thu lai</button></div>;
  if (state === "empty") return <p className="muted">Khong tim thay mon hoc nao phu hop.</p>;

  const showActions = Boolean(onEdit && onDelete);
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Ten mon hoc</th><th>Tin chi</th><th>So cho con lai</th>{showActions ? <th>Thao tac</th> : null}</tr></thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.tenMonHoc}</td>
              <td>{course.soTinChi}</td>
              <td className={course.soChoConLai === 0 ? "no-seats" : ""}>{course.soChoConLai} / {course.soChoToiDa}</td>
              {showActions ? <td className="action-cell"><button className="btn small" onClick={() => onEdit?.(course)}>Sua</button><button className="btn danger small" onClick={() => onDelete?.(course)}>Xoa</button></td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

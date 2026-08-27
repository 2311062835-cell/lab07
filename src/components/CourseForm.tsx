import { useState } from "react";
import type { Course, CourseFormValues } from "../types/course";
import { emptyCourseForm } from "../types/course";

interface CourseFormProps {
  editingCourse: Course | null;
  onSubmit: (values: CourseFormValues) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
  serverError: string | null;
}

type CourseFormErrors = Partial<Record<keyof CourseFormValues, string>>;

export default function CourseForm({
  editingCourse,
  onSubmit,
  onCancel,
  submitting,
  serverError,
}: CourseFormProps) {
  const [values, setValues] = useState<CourseFormValues>(() =>
    editingCourse
      ? {
          tenMonHoc: editingCourse.tenMonHoc,
          soTinChi: String(editingCourse.soTinChi),
          soChoToiDa: String(editingCourse.soChoToiDa),
        }
      : emptyCourseForm,
  );
  const [clientErrors, setClientErrors] = useState<CourseFormErrors>({});

  const validate = () => {
    const errors: CourseFormErrors = {};
    const credits = Number(values.soTinChi);
    const seats = Number(values.soChoToiDa);

    if (!values.tenMonHoc.trim())
      errors.tenMonHoc = "Ten mon hoc khong duoc de trong";
    if (!values.soTinChi || Number.isNaN(credits) || credits <= 0)
      errors.soTinChi = "So tin chi phai la so lon hon 0";
    if (!values.soChoToiDa || Number.isNaN(seats) || seats <= 0)
      errors.soChoToiDa = "So cho toi da phai la so lon hon 0";

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateValue = (field: keyof CourseFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) await onSubmit(values);
  };

  return (
    <form className="course-form-panel" onSubmit={handleSubmit} noValidate>
      <h3>{editingCourse ? "Sua mon hoc" : "Them mon hoc moi"}</h3>
      <label htmlFor="course-name">Ten mon hoc</label>
      <input
        id="course-name"
        value={values.tenMonHoc}
        onChange={(event) => updateValue("tenMonHoc", event.target.value)}
      />
      {clientErrors.tenMonHoc ? (
        <p className="field-error">{clientErrors.tenMonHoc}</p>
      ) : null}

      <label htmlFor="course-credits">So tin chi</label>
      <input
        id="course-credits"
        type="number"
        min="1"
        value={values.soTinChi}
        onChange={(event) => updateValue("soTinChi", event.target.value)}
      />
      {clientErrors.soTinChi ? (
        <p className="field-error">{clientErrors.soTinChi}</p>
      ) : null}

      <label htmlFor="course-seats">So cho toi da</label>
      <input
        id="course-seats"
        type="number"
        min="1"
        value={values.soChoToiDa}
        onChange={(event) => updateValue("soChoToiDa", event.target.value)}
      />
      {clientErrors.soChoToiDa ? (
        <p className="field-error">{clientErrors.soChoToiDa}</p>
      ) : null}

      {serverError ? <p className="error-text">{serverError}</p> : null}
      <div className="form-actions">
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Dang luu..." : editingCourse ? "Cap nhat" : "Them moi"}
        </button>
        {editingCourse ? (
          <button className="btn ghost-dark" type="button" onClick={onCancel}>
            Huy
          </button>
        ) : null}
      </div>
    </form>
  );
}

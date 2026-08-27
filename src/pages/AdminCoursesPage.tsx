import { useState } from "react";
import axios from "axios";
import { createCourse, deleteCourse, updateCourse } from "../api/courseApi";
import { useCourses } from "../api/useCourses";
import CourseForm from "../components/CourseForm";
import CourseList from "../components/CourseList";
import Pagination from "../components/Pagination";
import SearchBox from "../components/SearchBox";
import type { ApiErrorResponse } from "../types/apiError";
import type { Course, CourseFormValues } from "../types/course";

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;
    if (data?.message) return data.message;
    if (data) {
      const fieldError = Object.values(data).find(
        (value) => typeof value === "string",
      );
      if (fieldError) return fieldError;
    }
    if (error.response?.status === 401)
      return "Phien dang nhap da het han. Vui long dang nhap lai.";
    if (error.response?.status === 403)
      return "Tai khoan khong co quyen ADMIN.";
  }
  return "Da xay ra loi, vui long thu lai.";
}

export default function AdminCoursesPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(
    keyword,
    page,
  );

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0);
  };

  const handleFormSubmit = async (values: CourseFormValues) => {
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingCourse) await updateCourse(editingCourse.id, values);
      else await createCourse(values);
      setEditingCourse(null);
      setFormVersion((version) => version + 1);
      await refetch();
    } catch (error) {
      setFormError(extractErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Xoa mon hoc "${course.tenMonHoc}"?`)) return;
    try {
      await deleteCourse(course.id);
      await refetch();
    } catch (error) {
      setFormError(extractErrorMessage(error));
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
      <CourseForm
        key={`${editingCourse?.id ?? "new"}-${formVersion}`}
        editingCourse={editingCourse}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingCourse(null)}
        submitting={submitting}
        serverError={formError}
      />
      <SearchBox value={keyword} onSearch={handleSearch} />
      <div className="course-list-wrap">
        <CourseList
          courses={courses}
          state={state}
          errorMessage={errorMessage}
          onRetry={refetch}
          onEdit={setEditingCourse}
          onDelete={handleDelete}
        />
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </section>
  );
}

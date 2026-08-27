import { useState } from "react";
import { useCourses } from "../api/useCourses";
import CourseList from "../components/CourseList";
import Pagination from "../components/Pagination";
import SearchBox from "../components/SearchBox";

export default function CoursesPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  return (
    <section className="page-panel">
      <div className="page-heading">
        <div><p className="eyebrow">Course Service</p><h2>Danh sach mon hoc</h2></div>
        <SearchBox value={keyword} onSearch={handleSearch} />
      </div>
      <CourseList courses={courses} state={state} errorMessage={errorMessage} onRetry={refetch} />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}

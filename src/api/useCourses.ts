import { useCallback, useEffect, useState } from "react";
import { getCourses } from "./courseApi";
import type { Course } from "../types/course";

export type LoadState = "loading" | "success" | "empty" | "error";

export function useCourses(keyword: string, page: number, size = 10) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [state, setState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const refetch = useCallback(async () => {
    setState("loading");
    setErrorMessage("");
    try {
      const result = await getCourses(keyword || undefined, page, size);
      setCourses(result.content);
      setTotalPages(result.totalPages);
      setState(result.content.length ? "success" : "empty");
    } catch {
      setCourses([]);
      setTotalPages(0);
      setState("error");
      setErrorMessage("Khong tai duoc danh sach mon hoc. Vui long thu lai.");
    }
  }, [keyword, page, size]);

  useEffect(() => {
    const run = async () => {
      await refetch();
    };

    void run();
  }, [refetch]);

  return { courses, totalPages, state, errorMessage, refetch };
}

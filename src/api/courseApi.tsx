import axiosClient from "./axiosClient";
import type { Course } from "../types/course";

type RawCourse = {
	id?: number;
	tenMonHoc?: string;
	ten_mon_hoc?: string;
	soTinChi?: number;
	so_tin_chi?: number;
	soChoToiDa?: number;
	so_cho_toi_da?: number;
	soChoConLai?: number;
	so_cho_con_lai?: number;
};

export interface CoursePayload {
	tenMonHoc: string;
	soTinChi: number;
	soChoToiDa: number;
}

function normalizeCourse(item: RawCourse): Course {
	return {
		id: item.id ?? 0,
		tenMonHoc: item.tenMonHoc ?? item.ten_mon_hoc ?? "",
		soTinChi: item.soTinChi ?? item.so_tin_chi ?? 0,
		soChoToiDa: item.soChoToiDa ?? item.so_cho_toi_da ?? 0,
		soChoConLai: item.soChoConLai ?? item.so_cho_con_lai ?? 0,
	};
}

export async function getCourses(keyword?: string, page = 0, size = 20): Promise<Course[]> {
	const { data } = await axiosClient.get<RawCourse[] | { content: RawCourse[] }>("/api/courses", {
		params: { keyword, page, size },
	});

	const list = Array.isArray(data) ? data : data.content ?? [];
	return list.map(normalizeCourse);
}

export async function createCourse(payload: CoursePayload): Promise<Course> {
	const { data } = await axiosClient.post<RawCourse>("/api/courses", payload);
	return normalizeCourse(data);
}

export async function updateCourse(id: number, payload: CoursePayload): Promise<Course> {
	const { data } = await axiosClient.put<RawCourse>(`/api/courses/${id}`, payload);
	return normalizeCourse(data);
}

export async function deleteCourse(id: number): Promise<void> {
	await axiosClient.delete(`/api/courses/${id}`);
}
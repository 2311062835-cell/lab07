import axiosClient from "./axiosClient";
import type { Course, CourseFormValues, PagedResponse } from "../types/course";

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

function normalizeCourse(item: RawCourse): Course {
	return {
		id: item.id ?? 0,
		tenMonHoc: item.tenMonHoc ?? item.ten_mon_hoc ?? "",
		soTinChi: item.soTinChi ?? item.so_tin_chi ?? 0,
		soChoToiDa: item.soChoToiDa ?? item.so_cho_toi_da ?? 0,
		soChoConLai: item.soChoConLai ?? item.so_cho_con_lai ?? 0,
	};
}

export async function getCourses(keyword?: string, page = 0, size = 10): Promise<PagedResponse<Course>> {
	const { data } = await axiosClient.get<RawCourse[] | { content: RawCourse[]; totalElements?: number; totalPages?: number; number?: number; size?: number }>("/api/courses", {
		params: { keyword, page, size },
	});

	if (Array.isArray(data)) {
		const allCourses = data.map(normalizeCourse);
		const start = page * size;
		const content = allCourses.slice(start, start + size);
		return { content, totalElements: allCourses.length, totalPages: Math.ceil(allCourses.length / size), number: page, size };
	}

	const content = (data.content ?? []).map(normalizeCourse);
	return {
		content,
		totalElements: data.totalElements ?? content.length,
		totalPages: data.totalPages ?? (content.length ? 1 : 0),
		number: data.number ?? page,
		size: data.size ?? size,
	};
}

function toPayload(values: CourseFormValues) {
	return {
		tenMonHoc: values.tenMonHoc.trim(),
		soTinChi: Number(values.soTinChi),
		soChoToiDa: Number(values.soChoToiDa),
	};
}

export async function createCourse(values: CourseFormValues): Promise<Course> {
	const { data } = await axiosClient.post<RawCourse>("/api/courses", toPayload(values));
	return normalizeCourse(data);
}

export async function updateCourse(id: number, values: CourseFormValues): Promise<Course> {
	const { data } = await axiosClient.put<RawCourse>(`/api/courses/${id}`, toPayload(values));
	return normalizeCourse(data);
}

export async function deleteCourse(id: number): Promise<void> {
	await axiosClient.delete(`/api/courses/${id}`);
}
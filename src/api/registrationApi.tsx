import axiosClient from "./axiosClient";
import type { Registration, RegistrationRequest } from "../types/registration";

type RawRegistration = {
  id?: number;
  studentId?: number;
  student_id?: number;
  courseId?: number;
  course_id?: number;
  trangThai?: string;
  trang_thai?: string;
  ngayDangKy?: string;
  ngay_dang_ky?: string;
};

function normalizeRegistration(item: RawRegistration): Registration {
  return {
    id: item.id ?? 0,
    studentId: item.studentId ?? item.student_id ?? 0,
    courseId: item.courseId ?? item.course_id ?? 0,
    trangThai: item.trangThai ?? item.trang_thai ?? "DA_DANG_KY",
    ngayDangKy: item.ngayDangKy ?? item.ngay_dang_ky ?? "",
  };
}

export async function getRegistrations(): Promise<Registration[]> {
  const { data } = await axiosClient.get<RawRegistration[] | { content: RawRegistration[] }>(
    "/api/registrations",
  );

  const list = Array.isArray(data) ? data : data.content ?? [];
  return list.map(normalizeRegistration);
}

export async function createRegistration(payload: RegistrationRequest): Promise<Registration> {
  const { data } = await axiosClient.post<RawRegistration>("/api/registrations", payload);
  return normalizeRegistration(data);
}

export async function cancelRegistration(id: number): Promise<void> {
  try {
    await axiosClient.patch(`/api/registrations/${id}/cancel`);
    return;
  } catch {
    // Fallback for alternate backend mapping.
  }

  try {
    await axiosClient.put(`/api/registrations/${id}/cancel`);
    return;
  } catch {
    // Fallback for status update endpoint.
  }

  await axiosClient.patch(`/api/registrations/${id}`, { trangThai: "DA_HUY" });
}

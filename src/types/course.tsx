export interface Course {
  id: number;
  tenMonHoc: string;
  soTinChi: number;
  soChoToiDa: number;
  soChoConLai: number;
}

export interface CourseFormValues {
  tenMonHoc: string;
  soTinChi: string;
  soChoToiDa: string;
}

export const emptyCourseForm: CourseFormValues = {
  tenMonHoc: "",
  soTinChi: "",
  soChoToiDa: "",
};
// Khop voi cau truc Page<CourseDTO> ma Spring Data JPA tra ve (Buoi3, muc A)
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // trang hien tai (bat dau tu 0)
  size: number;
}

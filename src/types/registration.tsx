export interface Registration {
  id: number;
  studentId: number;
  courseId: number;
  trangThai: string;
  ngayDangKy: string; // ISO date string tu backend, se format laikhi hien thi
}

export interface RegistrationRequest {
  studentId: number;
  courseId: number;
}

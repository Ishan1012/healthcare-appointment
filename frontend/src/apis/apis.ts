import { AppointmentDetails, DoctorFormData, FormDataConsult, PatientFormData, SignInRequest, SignUpRequest } from "@/types/type";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:5000/api/v1";

const api = axios.create({ baseURL });

api.interceptors.request.use(
  (config) => {
    const userSession = localStorage.getItem("userSession");

    const excludedPaths = [
      '/auth/signin', '/auth/signup', '/auth/signin/google',
      '/auth/patient/signin', '/auth/patient/signup', '/auth/patient/google',
      '/auth/doctor/signin', '/auth/doctor/signup', '/auth/doctor/google',
      '/auth/admin/signin', '/auth/admin/signup', '/auth/admin/google'
    ];

    const shouldExclude = excludedPaths.some(path =>
      config.url?.includes(path)
    );

    if (!shouldExclude && userSession) {
      const token = JSON.parse(userSession).token;

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const expressApi = () => api.get('/');

export const signInApi = (signInRequest: SignInRequest, role: string) => 
  api.post(`/auth/${role.toLowerCase()}/signin`, signInRequest);

export const signUpApi = (signUpRequest: Omit<SignUpRequest, 'role'>, role: string) => 
  api.post(`/auth/${role.toLowerCase()}/signup`, signUpRequest);

export const signInByGoogleApi = (code: string, role: string) => 
  api.post(`/auth/${role.toLowerCase()}/google`, { code }, { headers: { 'Content-Type': 'application/json' } });

export const userApi = () => api.get('/auth/me');

export const registerPatientApi = (registrationForm: PatientFormData) => api.put(`/patient`, registrationForm);

export const registerDoctorApi = (registrationForm: DoctorFormData) => api.put(`/doctor`, registrationForm);

export const getDoctorsApi = () => api.get('/doctor/registered/');

export const bookAppointmentApi = (appointment: Omit<AppointmentDetails, 'id'>) => api.post('/appointment', appointment);

export const getAppointmentApi = (id: string) => api.get(`/appointment/${id}`);

export const smartConsultApi = (symptoms: string) => api.post('/consult', { symptoms });

export const adminGetStatsApi = () => api.get('/admin/stats');

export const adminGetAppointmentsApi = () => api.get('/admin/appointments');

export const doctorGetAppointmentsApi = () => api.get('/doctor/appointments');

export const doctorSubmitSummaryApi = (appointmentId: string, summaryData: { doctorNotes: string; prescription: string }) => 
  api.post(`/appointment/${appointmentId}/summary`, summaryData);

export const adminCreateDoctorApi = (doctorData: any) => api.post('/doctor', doctorData);

export const adminUpdateDoctorApi = (doctorId: string, doctorData: any) => api.put(`/doctor/${doctorId}`, doctorData);

export const getDoctorSlotsApi = (doctorId: string, date: string) => api.get(`/doctor/${doctorId}/slots?date=${date}`);

export const getRecordApi = async (id: string) => {
  const res = await api.get(`/appointment/${id}`);
  return {
    data: {
      success: res.data.success,
      record: {
        ...res.data.appointment,
        summary: res.data.summary
      }
    }
  };
};
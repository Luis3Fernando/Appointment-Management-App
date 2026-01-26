import { useState } from 'react';
import { appointmentService, Appointment } from '../services/appointmentService';

export const useAppointments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Appointment[]>([]);

  const handleErrorMessage = (err: any) => {
    console.log("Error Log:", err);
    if (err.message.includes('500') || err.message.includes('Network request failed')) {
      return "El servicio se encuentra temporalmente fuera de servicio. Intente más tarde.";
    }
    if (err.message.includes('404')) {
      return "No se encontró el recurso solicitado en el servidor.";
    }
    return "No se pudo procesar la solicitud. Verifique su conexión.";
  };

  const fetchAppointments = async (area?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await appointmentService.getAppointments(area);
      setData(response);
    } catch (err: any) {
      setError(handleErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const createNewAppointment = async (formData: Appointment) => {
    setLoading(true);
    setError(null);
    try {
      await appointmentService.createAppointment(formData);
      return { success: true };
    } catch (err: any) {
      const msg = handleErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    fetchAppointments,
    createNewAppointment,
    clearError: () => setError(null)
  };
};
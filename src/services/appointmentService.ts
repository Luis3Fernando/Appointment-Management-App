import { API_CONFIG } from '../constants/Config';

export interface Appointment {
  id?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  edad: number | string;
  genero: string;
  area: string;
  entidad: string;
  tipoConsulta: string;
  tematica: string;
  descripcion: string;
  fechaCreacion?: string;
}

const BASE_URL = API_CONFIG.baseUrl;

export const appointmentService = {
  
  getAppointments: async (area?: string): Promise<Appointment[]> => {
    try {
      const query = (area && area !== 'Todos') ? `list?area=${encodeURIComponent(area)}` : 'list';
      const response = await fetch(`${BASE_URL}${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al obtener las consultas');
      
      return await response.ok ? response.json() : [];
    } catch (error) {
      console.error("Service Error [getAppointments]:", error);
      throw error;
    }
  },

  createAppointment: async (data: Appointment) => {
    try {
      const response = await fetch(`${BASE_URL}crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al enviar la consulta');
      }

      return result;
    } catch (error) {
      console.error("Service Error [createAppointment]:", error);
      throw error;
    }
  }
};
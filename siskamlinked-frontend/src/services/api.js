import axios from 'axios';

// URL Backend (Nanti kita atur di .env)
const PATROL_URL = import.meta.env.VITE_PATROL_API_URL;
const INCIDENT_URL = import.meta.env.VITE_INCIDENT_API_URL;

// Instance API
const patrolApi = axios.create({ baseURL: PATROL_URL });
const incidentApi = axios.create({ baseURL: INCIDENT_URL });

// Interceptor: Otomatis pasang token admin jika ada
patrolApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const api = {
    // === SERVICE 1: PATROL (Punya Teman) ===
    login: async (username, password) => {
        const res = await patrolApi.post('/auth/login', { username, password });
        if (res.data.token) localStorage.setItem('adminToken', res.data.token);
        return res.data;
    },
    
    getActiveOfficers: async () => {
        // Ambil petugas ON_DUTY
        const res = await patrolApi.get('/officers?status=on_duty');
        return res.data.data; 
    },

    // === SERVICE 2: INCIDENT (Punya Kamu) ===
    createIncident: async (data) => {
        return await incidentApi.post('/incidents', data);
    },

    getAllIncidents: async () => {
        const res = await incidentApi.get('/incidents');
        return res.data.data;
    },

    assignOfficer: async (incidentId, officerData) => {
        // Update insiden dengan petugas terpilih
        return await incidentApi.put(`/incidents/${incidentId}`, {
            status: 'ASSIGNED',
            officer_id: officerData.id,
            officer_name: officerData.name
        });
    }
};
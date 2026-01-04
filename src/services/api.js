import axios from 'axios';

const PATROL_URL = import.meta.env.VITE_PATROL_API_URL;
const INCIDENT_URL = import.meta.env.VITE_INCIDENT_API_URL;

const patrolApi = axios.create({ baseURL: PATROL_URL });
const incidentApi = axios.create({ baseURL: INCIDENT_URL });

patrolApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const api = {
    login: async (username, password) => {
        const res = await patrolApi.post('/auth/login', { username, password });
        if (res.data.token) localStorage.setItem('adminToken', res.data.token);
        return res.data;
    },
    
    getActiveOfficers: async () => {
        const res = await patrolApi.get('/officers?status=on_duty');
        return res.data.data; 
    },

    getAllOfficers: async () => {
        const res = await patrolApi.get('/officers');
        return res.data.data;
    },

    checkIn: async (officerId, location = '', notes = '') => {
        const res = await patrolApi.post(`/officers/${officerId}/attendance`, {
            type: 'check_in',
            location,
            notes
        });
        return res.data;
    },

    checkOut: async (officerId, location = '', notes = '') => {
        const res = await patrolApi.post(`/officers/${officerId}/attendance`, {
            type: 'check_out',
            location,
            notes
        });
        return res.data;
    },

    getCheckHistory: async (officerId = null) => {
        if (!officerId) {
            const officers = await patrolApi.get('/officers');
            const allHistory = [];
            for (const officer of officers.data.data || []) {
                try {
                    const history = await patrolApi.get(`/officers/${officer.id}/attendance`);
                    if (history.data.data) {
                        allHistory.push(...history.data.data.map(h => ({
                            ...h,
                            officer_name: officer.name
                        })));
                    }
                } catch (err) {
                    console.error(`Failed to fetch history for officer ${officer.id}`, err);
                }
            }
            return allHistory;
        }
        const res = await patrolApi.get(`/officers/${officerId}/attendance`);
        return res.data.data;
    },

    createIncident: async (data) => {
        return await incidentApi.post('/incidents', data);
    },

    getAllIncidents: async () => {
        const res = await incidentApi.get('/incidents');
        return res.data.data;
    },

    assignOfficer: async (incidentId, officerData) => {
        return await incidentApi.put(`/incidents/${incidentId}`, {
            status: 'ASSIGNED',
            officer_id: officerData.id,
            officer_name: officerData.name
        });
    }
};
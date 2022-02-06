import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8001' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }

    return req;
});

// Auth
export const signIn = (formData) => API.post('/auth/signin', formData);
export const signUp = (formData) => API.post('/auth/signup', formData);

// Events
export const getEvents = () => API.post('/events/all');
export const getEventsByTime = (formData) => API.post('/events/byTime', formData);
export const createEvent = (formData) => API.post('/events/create', formData);
export const editEvent = (formData) => API.post('/events/update', formData);
export const deleteEvent = (eventId) => API.post('/events/delete', eventId);
export const getEvent = (eventId) => API.post('/events/getOne', eventId);

// Subjects
export const getSubjects = () => API.post('/events/subjects');

// Event types
export const getEventTypes = () => API.post('/events/types');
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Projects
export const getProjects = () => api.get('/projects').then(r => r.data);
export const createProject = (data) => api.post('/projects', data).then(r => r.data);
export const getProject = (id) => api.get(`/projects/${id}`).then(r => r.data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data).then(r => r.data);
export const deleteProject = (id) => api.delete(`/projects/${id}`).then(r => r.data);

// Bids
export const getBids = (params) => api.get('/bids', { params }).then(r => r.data);
export const createBid = (data) => api.post('/bids', data).then(r => r.data);
export const acceptBid = (id) => api.put(`/bids/${id}/accept`).then(r => r.data);
export const rejectBid = (id) => api.put(`/bids/${id}/reject`).then(r => r.data);

// Assignments
export const getAssignments = (params) => api.get('/assignments', { params }).then(r => r.data);
export const createAssignment = (data) => api.post('/assignments', data).then(r => r.data);
export const updateAssignment = (id, data) => api.put(`/assignments/${id}`, data).then(r => r.data);
export const deleteAssignment = (id) => api.delete(`/assignments/${id}`).then(r => r.data);

// Stage Progress
export const getStageProgress = (params) => api.get('/stage-progress', { params }).then(r => r.data);
export const createStageProgress = (data) => api.post('/stage-progress', data).then(r => r.data);

// Milestones
export const getMilestones = (params) => api.get('/milestones', { params }).then(r => r.data);
export const createMilestone = (data) => api.post('/milestones', data).then(r => r.data);
export const updateMilestone = (id, data) => api.put(`/milestones/${id}`, data).then(r => r.data);
export const deleteMilestone = (id) => api.delete(`/milestones/${id}`).then(r => r.data);

// Payments
export const getPayments = (params) => api.get('/payments', { params }).then(r => r.data);
export const createPayment = (data) => api.post('/payments', data).then(r => r.data);
export const updatePayment = (id, data) => api.put(`/payments/${id}`, data).then(r => r.data);

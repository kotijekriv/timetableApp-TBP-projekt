import * as actionType from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getEvents = () => async (dispatch) => {
    try {
        const { data } = await api.getEvents();

        dispatch({ type: actionType.GET_EVENTS, payload: data });
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}

export const getEventsByTime = (formData) => async (dispatch) => {
    try {
        const { data } = await api.getEventsByTime(formData);

        dispatch({ type: actionType.GET_EVENTS_TIME, payload: data });
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}

export const getEvent = (eventId) => async (dispatch) => {
    try {
        const { data } = await api.getEvent(eventId);

        dispatch({ type: actionType.GET_EVENT, payload: data });
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}

export const createEvent = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.createEvent(formData);

        dispatch({ type: actionType.CREATE_EVENT, payload: data });

        navigate('/');
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}

export const editEvent = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.editEvent(formData);

        dispatch({ type: actionType.EDIT_EVENT, payload: data });

        navigate('/');
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}

export const deleteEvent = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.deleteEvent({ eventId: formData.eventId });

        dispatch({ type: actionType.DELETE_EVENT, payload: data });

        navigate('/');
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}
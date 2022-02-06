import * as actionType from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getEventTypes = () => async (dispatch) => {
    try {
        const { data } = await api.getEventTypes();

        dispatch({ type: actionType.GET_EVENT_TYPES, payload: data });
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}
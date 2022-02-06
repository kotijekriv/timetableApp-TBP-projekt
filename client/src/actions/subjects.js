import * as actionType from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getSubjects = () => async (dispatch) => {
    try {
        const { data } = await api.getSubjects();

        dispatch({ type: actionType.GET_SUBJECTS, payload: data });
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}
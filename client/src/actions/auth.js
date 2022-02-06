import * as actionType from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);

        dispatch({ type: actionType.AUTH, data });

        navigate('/');
    } catch (error) {
        alert(error.response.data.message);
    }
};

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);

        dispatch({ type: actionType.AUTH, data });

        navigate('/');
    } catch (error) {
        alert(error.response.data.message);
    }
};
import * as actionType from '../constants/actionTypes';

export default (subjects = [], action) => {
    switch (action.type) {
        case actionType.GET_SUBJECTS:
            return action.payload;
        default:
            return subjects;
    }
};
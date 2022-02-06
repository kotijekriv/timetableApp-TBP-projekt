import * as actionType from '../constants/actionTypes';

export default (eventTypes = [], action) => {
    switch (action.type) {
        case actionType.GET_EVENT_TYPES:
            return action.payload;
        default:
            return eventTypes;
    }
};
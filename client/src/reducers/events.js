import * as actionType from '../constants/actionTypes';

export default (events = [], action) => {
    switch (action.type) {
        case actionType.GET_EVENTS:
        case actionType.GET_EVENT:
        case actionType.GET_EVENTS_TIME:
            return action.payload;
        case actionType.CREATE_EVENT:
            return [...events, action.payload];
        case actionType.EDIT_EVENT:
        case actionType.DELETE_EVENT:
        default:
            return events;
    }
};
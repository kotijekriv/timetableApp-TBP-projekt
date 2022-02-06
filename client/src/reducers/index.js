import { combineReducers } from 'redux';

import events from './events';
import auth from './auth';
import subjects from './subjects';
import eventTypes from './eventTypes';

export const reducers = combineReducers({ events, auth, subjects, eventTypes });
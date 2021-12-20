import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import vms from './vms';
import admin from './admin';
import application from './application';
import logs from './logs';

export default combineReducers({
	alert,
	auth,
	vms,
	admin,
	application,
	logs
})
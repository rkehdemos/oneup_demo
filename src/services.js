import wretch from 'wretch';
import config from './client-config.json';

const {patient_url} = config.urls;

const getAuthToken = expiration => wretch('http://localhost:3001/getAuthToken')
		.headers({Accept: 'application/json'})
		.post({expiration})
		.json();

const getPatientData = (id, token) => {
	return wretch(`${patient_url}/${id}/$everything`)
		.auth(`Bearer ${token}`)
		.get()
		.json();
	}

export {getAuthToken, getPatientData};
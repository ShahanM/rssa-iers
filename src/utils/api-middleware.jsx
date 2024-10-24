export const API = process.env.NODE_ENV === "production" ? "https://rssa.recsys.dev/newrs/api/v1/"
	: "http://localhost:8000/rssa/api/v1/";

export const CORSHeaders = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': '*',
	'Access-Control-Allow-Methods': 'OPTIONS,PUT,POST,GET',
};

function getHeaders(userdata) {
	let headers = CORSHeaders;
	if (userdata) {
		headers = {
			...CORSHeaders,
			'study-id': userdata.study_id
		}
	}
	return headers;
}

export function post(path: string, data: any, userdata) {
	return bodyRequest('POST', path, data, getHeaders(userdata));
}

export function put(path: string, data: any, userdata) {
	return bodyRequest('PUT', path, data, getHeaders(userdata));
}

function bodyRequest(method: string, path: string, data: any, headers) {
	return fetch(API + path, {
		method: method,
		headers: headers,
		body: JSON.stringify(data)
	});
}

export function get(path: string, userdata) {
	return fetch(API + path, {
		method: 'GET',
		headers: getHeaders(userdata)
	});
}

export function createUser(userType: string, studyId: int) {
	return post('user/consent/', {
		study_id: studyId,
		user_type: 'ersStudy'
	}, { study_id: studyId })
}

export function getStudy(studyid) {
	return get('study/' + studyid)
		.then((response): Promise<studyres> => response.json())
		.then((studyres: studyres) => {
			return studyres;
		});
}

export function getFirstStudyStep(studyid) {
	return get('study/' + studyid + '/step/first/')
		.then((response): Promise<StudyStepRes> => response.json())
		.then((studyStepRes: studyStepRes) => {
			return studyStepRes;
		})
}

export function getNextStudyStep(studyid, stepid) {
	return get('study/' + studyid + '/step/' + stepid + '/next')
		.then((response): Promise<step> => response.json())
		.then((step: step) => {
			return step;
		})
}

export function getNextStepPage(studyid, stepid, pageid) {
	return get('study/' + studyid + '/step/' + stepid + '/page/' + pageid + '/next')
		.then((response): Promise<page> => response.json())
		.then((page: page) => {
			return page;
		})
}

export function getPage(studyid, stepid, pageid) {
	return get('study/' + studyid + '/step/' + stepid + '/page/' + pageid)
		.then((response): Promise<page> => response.json())
		.then((page: page) => {
			return page;
		})
}

const requestBodyMeta = (userdata, pageid) => {
	return {
		user_id: userdata.id,
		study_id: userdata.study_id,
		page_id: pageid
	}
}

export function submitResponse(responseType: string, userdata, pageid,
	responses) {
	const data = {
		...requestBodyMeta(userdata, pageid),
		responses: responses
	}
	const url = 'user/' + userdata.id + '/response/' + responseType + '/';
	return put(url, data, userdata);
}

export function updateSeen(userdata, studyStep, pagelevel, items) {
	const data = {
		...requestBodyMeta(userdata, studyStep.id),
		page_level: pagelevel,
		items: items
	}
	const url = 'user/' + userdata.id + '/seenitems/';
	return put(url, data, userdata);
}

export function updateRating(userdata, studyStep, pagelevel, ratings) {
	const data = {
		...requestBodyMeta(userdata, studyStep.id),
		page_level: pagelevel,
		ratings: ratings
	}
	const url = 'user/' + userdata.id + '/itemrating/';
	return put(url, data, userdata);
}

export function updateEmotionPreference(userdata, payload) {
	const url = 'user/' + userdata.id + '/emotionprefs/';
	return put(url, payload, userdata);
}

export function submitSelection(userdata, pageData, selectedid) {
	const data = {
		...requestBodyMeta(userdata, pageData.id),
		selected_item: {
			item_id: selectedid,
			rating: 99
		}
	}
	const url = 'user/' + userdata.id + '/itemselect/';
	return put(url, data, userdata);
}

export function submitDemographicInfo(userdata, agestr, genderstr, educationstr) {
	const data = {
		user_id: userdata.id,
		study_id: userdata.study_id,
		age_group: agestr,
		gender: genderstr,
		education: educationstr
	}
	const url = 'user/' + userdata.id + '/demographicInfo/';
	return put(url, data, userdata);
}

export function sendLog(userdata, stepid, pageid: int, timespent: int,
	inttype: string, target: string, itemid: int, rating: int) {
	const data = {
		...requestBodyMeta(userdata, pageid),
		step_id: stepid,
		time_spent: timespent,
		interaction_type: inttype, interaction_target: target,
		item_id: itemid, rating: rating
	}
	return put('user/' + userdata.id + '/log/', data, userdata)
		.then((response): Promise<log> => response.json())
		.then((log: log) => {
			return log;
		})
}

export function getCompletionURL(userdata) {
	return get('user/' + userdata.id + '/completion', userdata)
		.then((response): Promise<completionObj> => response.json())
		.then((completionObj: completionObj) => {
			return completionObj;
		})
}

export const imgurl = (identifier) => {
	if (identifier === undefined || identifier === null) {
		return 'https://rssa.recsys.dev/movie/poster/default_movie_icon.svg';
	}
	return 'https://rssa.recsys.dev/movie/poster/' + identifier;
}
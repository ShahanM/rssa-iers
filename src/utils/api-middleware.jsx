export const API = process.env.NODE_ENV === "production" ? "https://rssa.recsys.dev/newrs/api/v1/"
	: "http://localhost:8000/";

export const CORSHeaders = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': '*',
	'Access-Control-Allow-Methods': 'OPTIONS,PUT,POST,GET',
};

export function post(path: string, data: any) {
	return bodyRequest('POST', path, data);
}

export function put(path: string, data: any) {
	return bodyRequest('PUT', path, data);
}

function bodyRequest(method: string, path: string, data: any) {
	return fetch(API + path, {
		method: method,
		headers: CORSHeaders,
		body: JSON.stringify(data)
	});
}

export function get(path: string) {
	return fetch(API + path, {
		method: 'GET',
		headers: CORSHeaders
	});
}
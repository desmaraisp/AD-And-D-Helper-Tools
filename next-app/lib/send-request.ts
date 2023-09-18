import { ApiErrorResponseModel, ApiErrorResponseSchema } from "@/lib/api-error-response";


export async function SendJsonRequest<T>(data: T, route: string, method: string): Promise<ApiErrorResponseModel | null> {
	try {
		var response = await fetch(route, {
			body: JSON.stringify(data),
			method: method,
			headers: {
				"Content-Type": "application/json",
			}
		});

		if (response.status == 200) return null;

		const result = await response.json();
		return ApiErrorResponseSchema.parseAsync(result);
	}
	catch (e) {
		if (e instanceof Error) {
			return {
				message: e.message
			};
		}
		console.log(e);
		throw e;
	}
}

export async function SendBodyLessRequest(route: string, method: string): Promise<ApiErrorResponseModel | null> {
	try {
		var response = await fetch(route, {
			method: method,
		});

		if (response.status == 200) return null;

		const result = await response.json();
		return ApiErrorResponseSchema.parseAsync(result);
	}
	catch (e) {
		if (e instanceof Error) {
			return {
				message: e.message
			};
		}
		console.log(e);
		throw e;
	}
}
import { ApiErrorResponseModel } from "@/lib/api-error-response";
import { ErrorWithHTTPCode } from "@/exceptions/error-with-http-code";
import { NextApiRequest, NextApiResponse } from "next";

export function onApiError(err: unknown, _req: NextApiRequest, res: NextApiResponse) {
	console.log(err)
	if (err instanceof ErrorWithHTTPCode) {
		res.status(err.code).json({ message: err.message } as ApiErrorResponseModel);
		return
	}
	else if (err instanceof Error){
		res.status(500).json({ message: err.message } as ApiErrorResponseModel);
		return
	}

	res.status(500).json({ message: "Unknown error" } as ApiErrorResponseModel);
}

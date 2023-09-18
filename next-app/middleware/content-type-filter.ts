import { ApiErrorResponseModel } from "@/lib/api-error-response";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";


export function contentTypeFilterMiddleware(allowedContentType: String) {
	return async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
		if(req.headers["content-type"] != allowedContentType) {
			res.status(415).json({ message: "Invalid content-type" } as ApiErrorResponseModel);
			return;
		}

		await next()
	}

}
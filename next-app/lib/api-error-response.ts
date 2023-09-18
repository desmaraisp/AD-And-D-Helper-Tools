import { z } from "zod";

export const ApiErrorResponseSchema = z.object({
	message: z.string()
});
export type ApiErrorResponseModel = z.infer<typeof ApiErrorResponseSchema>

export const isApiError = (obj: unknown): obj is ApiErrorResponseModel => {
	return (obj as ApiErrorResponseModel)?.message !== undefined;
};
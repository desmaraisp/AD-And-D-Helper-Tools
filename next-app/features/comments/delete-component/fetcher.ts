import { SendBodyLessRequest } from "@/lib/send-request";
import { ApiErrorResponseModel } from "@/lib/api-error-response"

export async function DeleteComment(commentId: string): Promise<ApiErrorResponseModel | null> {
	return SendBodyLessRequest(`/api/comment/${commentId}`, 'Delete');
}
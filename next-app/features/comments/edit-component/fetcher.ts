import { SendJsonRequest } from "@/lib/send-request";
import { ContentCommentModel } from "../comment-schema";

export async function PutComment(data: ContentCommentModel, commentId: string) {
	return await SendJsonRequest(
		data,
		`/api/comment/${commentId}`,
		"put"
	);
}
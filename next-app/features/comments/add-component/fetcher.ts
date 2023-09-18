import { SendJsonRequest } from "@/lib/send-request";
import { WithDateCommentModel } from "../comment-schema";

export async function PostNewComment(data: WithDateCommentModel) {
	return await SendJsonRequest(
		data,
		"/api/comment",
		"post"
	);
}
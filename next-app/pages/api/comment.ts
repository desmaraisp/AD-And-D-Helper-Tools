import { prismaClient } from "@/globals/prisma-client";
import { onApiError } from "@/middleware/api-error-handler";
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect";
import { contentTypeFilterMiddleware } from "@/middleware/content-type-filter";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ContentCommentModel, WithDateCommentSchema, WithIdCommentSchema } from "@/features/comments/comment-schema";

const router = createRouter<NextApiRequest, NextApiResponse>();
export const commentRouteConfig: RouteConfig = {
	method: 'post',
	path: '/api/comment',
	request: {
		body: {
			content: {
				'application/json': {
					schema: WithDateCommentSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Success.',
			content: {
				'application/json': {
					schema: WithIdCommentSchema
				}
			}
		}
	},
}

router
	.post(
		contentTypeFilterMiddleware('application/json'),
		async (req, res, _next) => {
			const commentRequest = await WithDateCommentSchema.parseAsync(req.body)
			const createdComment = await prismaClient.note.create({
				data: {
					content: commentRequest.content,
					dateCreated: commentRequest.dateCreated
				}
			});
			res.status(200).json({
				commentId: createdComment.id,
				content: createdComment.content,
				dateCreated: createdComment.dateCreated
			} as ContentCommentModel)
		},
	)

export default router.handler({
	onError: onApiError,
})
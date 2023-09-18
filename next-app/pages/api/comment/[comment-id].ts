import { onApiError } from "@/middleware/api-error-handler";
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect";
import { prismaClient } from "@/globals/prisma-client";
import { z } from "zod";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ContentCommentSchema, WithIdCommentModel, WithIdCommentSchema } from "@/features/comments/comment-schema";

const router = createRouter<NextApiRequest, NextApiResponse>();
export const commentDeleteRouteConfig: RouteConfig = {
	method: 'delete',
	path: '/api/comment/{comment-id}',
	request: {
		params: z.object({
			"comment-id": z.string().min(1),
		})
	},
	responses: {
		200: {
			description: 'Success.'
		}
	},
}
export const commentPutRouteConfig: RouteConfig = {
	method: 'put',
	path: '/api/comment/{comment-id}',
	request: {
		params: z.object({
			"comment-id": z.string().min(1),
		}),
		body: {
			content: {
				'application/json': {
					schema: ContentCommentSchema
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
	.delete(
		async (req, res, _next) => {
			const commentId = req.query["comment-id"]

			await prismaClient.note.delete({
				where: {
					id: Array.isArray(commentId) ? commentId[0] : commentId
				}
			});
			res.status(200).end()
		},
	)
	.put(
		async (req, res, _next) => {
			const commentId = req.query["comment-id"]
			const commentRequest = await ContentCommentSchema.parseAsync(req.body)

			const updatedComment = await prismaClient.note.update({
				where: {
					id: Array.isArray(commentId) ? commentId[0] : commentId
				},
				data: {
					content: commentRequest.content
				}
			});
			
			res.status(200).json({
				commentId: updatedComment.id,
				content: updatedComment.content,
				dateCreated: updatedComment.dateCreated
			} as WithIdCommentModel)
		},
	)

export default router.handler({
	onError: onApiError,
})
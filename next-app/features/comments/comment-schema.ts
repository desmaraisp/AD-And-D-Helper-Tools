import { z } from "zod";


export const ContentCommentSchema = z.object({
	content: z.string().min(1),
});
export interface ContentCommentModel extends z.infer<typeof ContentCommentSchema> { }

export const WithDateCommentSchema = z.object({
	dateCreated: z.coerce.date()
}).merge(ContentCommentSchema)
export interface WithDateCommentModel extends z.infer<typeof WithDateCommentSchema>{}

export const WithIdCommentSchema = z.object({
	commentId: z.string(),
}).merge(WithDateCommentSchema)
export interface WithIdCommentModel extends z.infer<typeof WithIdCommentSchema>{}


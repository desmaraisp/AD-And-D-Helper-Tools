import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next/types";
import { prismaClient } from "@/globals/prisma-client";
import { Stack, Title } from "@mantine/core";
import { CommentDisplay } from "@/features/comments/display-component/display";
import { CommentAdd } from "@/features/comments/add-component/form";

export const getServerSideProps = async (_context: GetServerSidePropsContext) => {
	const commentsList = await prismaClient.note.findMany({
		orderBy: [{
			dateCreated: 'asc'
		}]
	})
	return {
		props: {
			commentsList: commentsList.map(x => {
				return {
					content: x.content,
					dateCreated: x.dateCreated.toISOString().substring(0, 10),
					id: x.id
				}
			})
		}
	}
}


export default function Comments({
	commentsList
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<Title>Notes</Title>
			<Stack>
				{commentsList.map((x) => {
					return (
						<CommentDisplay
							commentID={x.id}
							content={x.content}
							key={x.id}
							dateCreated={x.dateCreated}
						/>
					);
				})}
			</Stack>

			<CommentAdd />
		</>
	)
}

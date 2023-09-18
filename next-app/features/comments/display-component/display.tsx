import React, { useState } from "react";
import { EditButton } from "@/components/edit-button";
import { DeleteButton } from "@/components/delete-button";
import { Card, Group, Text } from "@mantine/core";
import { DeleteComment } from "../delete-component/fetcher";
import { WrappedWithErrorHandler } from "@/components/errors";
import { CommentEdit } from "../edit-component/form";

export function CommentDisplay({ commentID, content, dateCreated }: {
	commentID: string;
	content: string;
	dateCreated: string;
}) {
	const [isFormEnabled, setIsFormEnabled] = useState(false);

	if (isFormEnabled) {
		return <Card m={"md"} withBorder>
			<CommentEdit
				exitFormCallback={() => setIsFormEnabled(false)}
				commentID={commentID}
				content={content}
				dateCreated={dateCreated}
			/>
		</Card>
	}




	return (
		<WrappedWithErrorHandler>
			<Card m={"md"} withBorder>
				<Group justify="space-between">
					<Text>{dateCreated}</Text>
					<Group>
						<EditButton onClick={() => setIsFormEnabled(true)} />
						<DeleteButton deleteCallback={async () => await DeleteComment(commentID)} />
					</Group>
				</Group>
				<Text  style={{whiteSpace: 'pre-line', wordBreak: 'break-word'}}>
					{content}
				</Text>
			</Card>
		</WrappedWithErrorHandler>
	)
}



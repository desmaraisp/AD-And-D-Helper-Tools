import React, { useState } from "react";
import { DeleteButton } from "@/components/delete-button";
import { Button, Card, Group, Text } from "@mantine/core";
import { DeleteComment } from "../delete-component/fetcher";
import { WrappedWithErrorHandler } from "@/components/errors";
import { CommentEdit } from "../edit-component/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

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
						<Button variant="subtle" onClick={() => setIsFormEnabled(true)}>
							<FontAwesomeIcon icon={faEdit} />
						</Button>
						<DeleteButton deleteCallback={async () => await DeleteComment(commentID)} />
					</Group>
				</Group>
				<Text style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
					{content}
				</Text>
			</Card>
		</WrappedWithErrorHandler>
	)
}



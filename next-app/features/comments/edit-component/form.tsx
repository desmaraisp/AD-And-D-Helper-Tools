import { PutComment } from "./fetcher";
import { isApiError } from "../../../lib/api-error-response";
import { useRouter } from "next/router";
import { ContentCommentModel, ContentCommentSchema } from "../comment-schema";
import { useForm, zodResolver } from "@mantine/form";
import { FormRootError, SetRootFormError } from "@/components/errors";
import { Button, Textarea, Text, Stack } from "@mantine/core";

export function CommentEdit({ commentID, content, dateCreated, exitFormCallback }: {
	commentID: string;
	content: string;
	dateCreated: string;
	exitFormCallback: () => void;
}) {
	const router = useRouter();
	const form = useForm<ContentCommentModel>({
		validate: zodResolver(ContentCommentSchema),
		initialValues: {
			content
		}
	})

	const onSubmit = async (data: ContentCommentModel) => {
		const result = await PutComment(data, commentID)

		if (isApiError(result)) {
			SetRootFormError(form, result.message)
			return
		}

		exitFormCallback();
		router.replace(router.asPath);
	}

	return (
		<form onSubmit={form.onSubmit(onSubmit)}>
			<Stack>
				<Text>{dateCreated}</Text>
				<Textarea autosize minRows={5} placeholder="Type your comment here" {...form.getInputProps('content')} />

				<FormRootError errors={form.errors} />
				<Button type='submit'>Submit</Button>
				<Button onClick={exitFormCallback} type='reset'>Cancel</Button>
			</Stack>
		</form>
	)
}

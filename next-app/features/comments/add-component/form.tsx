import { PostNewComment } from "./fetcher";
import { isApiError } from "../../../lib/api-error-response";
import { useRouter } from "next/router";
import { Button, Card, Stack, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { DateInput } from '@mantine/dates';
import { FormRootError, SetRootFormError } from "@/components/errors";
import { WithDateCommentModel, WithDateCommentSchema } from "../comment-schema";


export function CommentAdd() {
	const router = useRouter();

	const form = useForm<WithDateCommentModel>({
		initialValues: { content: '', dateCreated: new Date() },
		validate: zodResolver(WithDateCommentSchema)
	});

	const handler = async (data: WithDateCommentModel) => {
		const result = await PostNewComment(data)
		if (isApiError(result)) {
			SetRootFormError(form, result.message)
			return
		}

		form.reset()
		router.replace(router.asPath);
	}

	return (
		<Card withBorder m="md">
			<form onSubmit={form.onSubmit(handler)}>
				<Stack>
					<Textarea autosize minRows={5} placeholder="Type your comment here" {...form.getInputProps('content')} />
					<DateInput
						label="Date"
						{...form.getInputProps('dateCreated')}
					/>
					<FormRootError errors={form.errors} />
					<Button type='submit'>Submit</Button>
					<Button onClick={() => { form.reset() }} type='reset'>Cancel</Button>
				</Stack>
			</form>
		</Card >
	)
}

import { useRouter } from "next/router";
import { PostNewCurrency } from "./fetcher";
import { isApiError } from "@/lib/api-error-response";
import { useForm, zodResolver } from "@mantine/form";
import { CurrencyModel, CurrencySchema } from "../currency-schema";
import { FormRootError, SetRootFormError } from "@/components/errors";
import { Button, Card, NumberInput, Stack, TextInput } from "@mantine/core";

export function CurrencyAddForm() {
	const router = useRouter();
	const form = useForm<CurrencyModel>({
		initialValues: {
			currencyName: '',
			value: 0
		},
		validate: zodResolver(CurrencySchema),
	})

	const handler = async (data: CurrencyModel) => {
		const result = await PostNewCurrency(data)

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
					<TextInput label="Currency name" {...form.getInputProps("currencyName")} />
					<NumberInput label="Currency value" {...form.getInputProps("value")} />

					<FormRootError errors={form.errors} />
					<Button type='submit'>Submit</Button>
				</Stack>
			</form>
		</Card>
	)
}

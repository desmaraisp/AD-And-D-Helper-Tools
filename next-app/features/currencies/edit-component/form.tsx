import { useRouter } from "next/router";
import { isApiError } from "@/lib/api-error-response";
import { PutNewCurrency } from "./fetcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { CurrencyModel, CurrencyModelWithId, CurrencySchema } from "../currency-schema";
import { useForm, zodResolver } from "@mantine/form";
import { FormRootError, SetRootFormError } from "@/components/errors";
import { Button, Card, NumberInput, Stack, TextInput } from "@mantine/core";



interface Props {
	model: CurrencyModelWithId;
	exitFormCallback: () => void;
};

export function CurrencyEditForm({ model, exitFormCallback }: Props) {
	const router = useRouter();
	const form = useForm<CurrencyModel>({
		validate: zodResolver(CurrencySchema),
		initialValues: {
			currencyName: model.currencyName,
			value: model.value
		}
	})

	const handler = async (data: CurrencyModel) => {
		const result = await PutNewCurrency(data, model.currencyId)

		if (isApiError(result)) {
			SetRootFormError(form, result.message)
			return
		}

		exitFormCallback()
		router.replace(router.asPath);
	}

	return (
		<form onSubmit={form.onSubmit(handler)}>
			<Stack>
				<TextInput label="Currency name" {...form.getInputProps("currencyName")} />
				<NumberInput label="Currency value" {...form.getInputProps("value")} />

				<FormRootError errors={form.errors} />

				<Button type='submit'>
					<FontAwesomeIcon icon={faCheck} />
				</Button>
				<Button onClick={exitFormCallback} type='reset'>
					<FontAwesomeIcon icon={faX} />
				</Button>
			</Stack>
		</form>
	)
}

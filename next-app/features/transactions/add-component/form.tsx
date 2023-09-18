import { useContext } from "react";
import { TransactionModel, TransactionSchema } from "../transaction-schema";
import { FormRootError, SetRootFormError } from "@/components/errors";
import { CurrencyContext } from "@/features/currencies/context-component/currency-context";
import { isApiError } from "@/lib/api-error-response";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/router";
import { PostNewTransaction } from "./fetcher";
import { Button, Card, Group, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

export function UserFundsAddForm() {
	const { currencies } = useContext(CurrencyContext)
	const router = useRouter();
	const form = useForm<TransactionModel>({
		validate: zodResolver(TransactionSchema),
		initialValues: {
			transactionDate: new Date(),
			value: [{
				amount: 0,
				currencyId: currencies.find(x => x)?.currencyId ?? ''
			}],
			label: '',
			lootedBy: ''
		}
	})

	const handler = async (data: TransactionModel) => {
		const result = await PostNewTransaction(data)

		if (isApiError(result)) {
			SetRootFormError(form, result.message)
			return
		}

		form.reset()
		router.replace(router.asPath);
	}

	const fields = form.values.value.map((item, index) => (
		<Group key={index} mt="xs">
			<Select
				clearable
				{...form.getInputProps(`value.${index}.currencyId`)}
				data={currencies.map(x => ({
					value: x.currencyId,
					label: x.currencyName
				}))}
			/>

			<NumberInput
				placeholder="Amount"
				{...form.getInputProps(`value.${index}.amount`)}
			/>
			<Button type="button" onClick={() => form.removeListItem('value', index)}>Delete</Button>
		</Group>
	))


	return (
		<Card m={"md"} withBorder>
			<form onSubmit={form.onSubmit(handler)}>
				<Stack>
					<TextInput
						label="Transaction label"
						{...form.getInputProps("label")}
					/>

					<TextInput
						label="Looted by?"
						{...form.getInputProps("lootedBy")}
					/>

					<DateInput
						{...form.getInputProps("transactionDate")}
					/>
					{fields}
					<Button 
						onClick={() => form.insertListItem("value", { amount: 0, currencyId: currencies[0]?.currencyId ?? "" })}
					>Add a currency</Button>


					<FormRootError errors={form.errors} />
					<Button type='submit'>Submit</Button>
				</Stack>
			</form>
		</Card>
	)
}
import { useContext } from "react";
import { FormRootError, SetRootFormError } from "@/components/errors";
import { CurrencyContext } from "@/features/currencies/context-component/currency-context";
import { isApiError } from "@/lib/api-error-response";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/router";
import { Button, Card, NumberInput, Select, Stack, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { CurrencyConvertModel, CurrencyConvertSchema } from "./convert-schema";
import { PostNewTransaction } from "../add-component/fetcher";
import { isNumber } from "radash";

export function CurrencyConvertForm({ CurrencyToConvert, cancelFormCallback }: { CurrencyToConvert: string, cancelFormCallback: () => void }) {
	const { currencies, getCurrency } = useContext(CurrencyContext)
	const router = useRouter();
	const form = useForm<CurrencyConvertModel>({
		validate: zodResolver(CurrencyConvertSchema),
		initialValues: {
			transactionDate: new Date(),
			count: 1,
			currencyToConvertTo: {
				amount: 0,
				currencyId: currencies.find(x => x)?.currencyId ?? ''
			}
		}
	})

	const handler = async (data: CurrencyConvertModel) => {
		const result = await PostNewTransaction({
			label: `Convert ${getCurrency(CurrencyToConvert)?.currencyName} To ${getCurrency(data.currencyToConvertTo.currencyId)?.currencyName}`,
			transactionDate: data.transactionDate,
			value: [
				{
					currencyId: CurrencyToConvert,
					amount: -data.count
				},
				{
					currencyId: data.currencyToConvertTo.currencyId,
					amount: data.currencyToConvertTo.amount
				}
			]
		})

		if (isApiError(result)) {
			SetRootFormError(form, result.message)
			return
		}

		cancelFormCallback()
		router.replace(router.asPath);
	}

	const onSelectedCurrencyChange = (selectedCurrency: string | null) => {
		form.setFieldValue('currencyToConvertTo.currencyId', selectedCurrency);
		if (!selectedCurrency) return

		const initialCurrencyValue = getCurrency(CurrencyToConvert)?.value ?? 1
		const newCurrencyValue = getCurrency(selectedCurrency)?.value ?? 1
		const numberOfNewCurrenciesToObtain = form.values.count * newCurrencyValue / initialCurrencyValue

		form.setFieldValue('currencyToConvertTo.amount', numberOfNewCurrenciesToObtain);
	};
	const onAmountToConvertChange = (count: number | string) => {
		if (!isNumber(count)) {
			count = parseFloat(count)
		}
		form.setFieldValue('count', count);

		const initialCurrencyValue = getCurrency(CurrencyToConvert)?.value ?? 1
		const newCurrencyValue = getCurrency(form.values.currencyToConvertTo.currencyId)?.value ?? 1
		const numberOfNewCurrenciesToObtain = count * newCurrencyValue / initialCurrencyValue

		form.setFieldValue('currencyToConvertTo.amount', numberOfNewCurrenciesToObtain);
	};


	return (
		<form onSubmit={form.onSubmit(handler)}>
			<Stack>
				<Text>{`Convert ${getCurrency(CurrencyToConvert)?.currencyName}`}</Text>
				<NumberInput
					{...form.getInputProps('count')}
					onChange={onAmountToConvertChange}
					label="Number of currency to convert"
				/>

				<Text>{`To ${getCurrency(form.values.currencyToConvertTo.currencyId)?.currencyName}`}</Text>

				<Select
					clearable
					{...form.getInputProps('currencyToConvertTo.currencyId')}
					onChange={onSelectedCurrencyChange}
					data={currencies.map(x => ({
						value: x.currencyId,
						label: x.currencyName
					}))}
				/>
				<NumberInput
					placeholder="Amount"
					{...form.getInputProps(`currencyToConvertTo.amount`)}
				/>

				<DateInput
					{...form.getInputProps("transactionDate")}
				/>
				<FormRootError errors={form.errors} />
				<Button type='submit'>Submit</Button>
				<Button onClick={cancelFormCallback} type='reset'>Cancel</Button>
			</Stack>
		</form>
	)
}
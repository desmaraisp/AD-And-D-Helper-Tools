import { FormRootError, SetRootFormError } from "@/components/errors";
import { CurrencyContext } from "@/features/currencies/context-component/currency-context";
import { isApiError } from "@/lib/api-error-response";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/router";
import { useContext } from "react";
import { PostNewInventoryItem } from "./fetcher";
import { InventoryItemModel, InventoryItemSchema } from "../inventory-schema";
import { Button, Card, Group, NumberInput, Select, Stack, TextInput, Textarea } from "@mantine/core";

export function InventoryItemAdd() {
	const { currencies } = useContext(CurrencyContext)
	const router = useRouter();
	const form = useForm<InventoryItemModel>({
		validate: zodResolver(InventoryItemSchema),
		initialValues: {
			itemValue: [{
				amount: 0,
				currencyId: currencies.find(x => x)?.currencyId ?? ''
			}],
			description: '',
			itemName: ''
		}
	})

	const handler = async (data: InventoryItemModel) => {
		const result = await PostNewInventoryItem(data)

		if (isApiError(result)) {
			SetRootFormError(form, result.message)
			return
		}

		form.reset()
		router.replace(router.asPath);
	}

	const fields = form.values.itemValue.map((item, index) => (
		<Group key={index} mt="xs">
			<Select
				clearable
				{...form.getInputProps(`itemValue.${index}.currencyId`)}
				data={currencies.map(x => ({
					value: x.currencyId,
					label: x.currencyName
				}))}
			/>

			<NumberInput
				placeholder="Amount"
				{...form.getInputProps(`itemValue.${index}.amount`)}
			/>
			<Button type="button" onClick={() => form.removeListItem('itemValue', index)}>Delete</Button>
		</Group>
	))


	return (
		<Card withBorder>
			<form onSubmit={form.onSubmit(handler)}>
				<Stack>
					<TextInput label="Item name" {...form.getInputProps("itemName")} />

					<Textarea autosize minRows={5} label="Description" {...form.getInputProps("description")} />

					{fields}
					<Button
						onClick={() => form.insertListItem("itemValue", { amount: 0, currencyId: currencies[0]?.currencyId ?? "" })}
					>Add a currency</Button>


					<FormRootError errors={form.errors} />
					<Button type='submit'>Submit</Button>
				</Stack>
			</form>
		</Card>
	)
}
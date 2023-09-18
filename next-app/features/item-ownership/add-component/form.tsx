import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/router";
import { OwnershipModel, OwnershipSchema } from "../ownership-schema";
import { PostNewItemOwnership } from "./fetcher";
import { isApiError } from "@/lib/api-error-response";
import { FormRootError, SetRootFormError } from "@/components/errors";
import { Alert, Button, Card, Group, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useContext } from "react";
import { CurrencyContext } from "@/features/currencies/context-component/currency-context";
import { InventoryItemModelWithId } from "@/features/inventory/inventory-schema";
import { isNumber } from "radash";
import { TransactionValueModel } from "@/features/transaction-value/transaction-value-schema";

export function ItemOwnershipAddForm({ item }: { item: InventoryItemModelWithId }) {
	const router = useRouter();
	const { currencies } = useContext(CurrencyContext)

	const form = useForm<OwnershipModel>({
		validate: zodResolver(OwnershipSchema),
		initialValues: {
			itemId: item.itemId,
			lootedBy: '',
			ownedBy: '',
			attachedTransaction: item.itemValue.map(x => ({ amount: -x.amount, currencyId: x.currencyId })),
			count: 1,
			dateObtained: new Date()
		}
	})

	const handler = async (data: OwnershipModel) => {
		const result = await PostNewItemOwnership(data)

		if (isApiError(result)) {
			SetRootFormError(form, result.message)
			return
		}

		form.reset()
		router.replace(router.asPath);
	}

	const fields = form.values.attachedTransaction.map((item, index) => (
		<Group key={index} mt="xs">
			<Select
				clearable
				{...form.getInputProps(`attachedTransaction.${index}.currencyId`)}
				data={currencies.map(x => ({
					value: x.currencyId,
					label: x.currencyName
				}))}
			/>

			<NumberInput
				placeholder="Amount"
				{...form.getInputProps(`attachedTransaction.${index}.amount`)}
			/>
			<Button type="button" onClick={() => form.removeListItem('attachedTransaction', index)}>Delete</Button>
		</Group>
	))

	const onItemCountChange = (count: number | string) => {
		let numCount: number;
		if (!isNumber(count)) {
			numCount = parseFloat(count)
		}
		else numCount = count;
		form.setFieldValue('count', numCount);

		const attachedTransactionDefaultValue: TransactionValueModel[] = item.itemValue.map(x => ({
			amount: x.amount * numCount,
			currencyId: x.currencyId
		}))

		form.setFieldValue('attachedTransaction', attachedTransactionDefaultValue);
	};
	const buyingItemForPositiveMoneyWarning = form.values.count >= 0 && form.values.attachedTransaction.some(x => x.amount >= 0)

	return <form onSubmit={form.onSubmit(handler)}>
		<Stack>
			<NumberInput label='Count of item' {...form.getInputProps('count')} onChange={onItemCountChange} />
			<TextInput label='Looted by' {...form.getInputProps("lootedBy")} />
			<TextInput label='Owned by' {...form.getInputProps("ownedBy")} />
			<DateInput
				label="Acquisition date"
				placeholder="Date input"
				{...form.getInputProps('dateObtained')}
			/>
			{fields}
			{
				buyingItemForPositiveMoneyWarning && <Alert color="yellow">You&lsquo;re trying to get someone to give you money for buying something. Are you sure?</Alert>
			}
			<Button
				onClick={() => form.insertListItem("attachedTransaction", { amount: 0, currencyId: currencies[0]?.currencyId ?? "" })}
			>Add a currency</Button>

			<FormRootError errors={form.errors} />
			<Button type='submit'>Submit</Button>
		</Stack>
	</form>
}
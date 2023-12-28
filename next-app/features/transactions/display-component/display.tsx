import { group, sum, unique } from "radash";
import React, { useContext, useState } from "react";
import { TransactionModelWithId } from "../transaction-schema";
import { Button, Card, Popover, Select, Stack, Table, TableTd, TableTh, TableTr, Title } from "@mantine/core";
import { CurrencyContext } from "@/features/currencies/context-component/currency-context";
import { CurrencyModelWithId } from "@/features/currencies/currency-schema";
import { CurrencyEditForm } from "@/features/currencies/edit-component/form";
import { faCoins, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CurrencyConvertForm } from "../convert-component/form";

export function UserFundsDisplay({ data }: { data: TransactionModelWithId[] }) {
	const [selectedDate, setSelectedDate] = useState<string | null>(null)
	const [selectedLooter, setSelectedLooter] = useState<string | null>(null)

	const existingTransactionDates = unique(data.flatMap(({ transactionDate }) => transactionDate.toDateString()))
	const existingLooters = unique(data.flatMap(({ lootedBy }) => lootedBy)).filter(x => !!x)

	const selectedTransactionsDate = selectedDate == null ? data : data.filter(c => c.transactionDate.toDateString() == selectedDate);
	const selectedTransactions = selectedLooter == null ? selectedTransactionsDate : selectedTransactionsDate.filter(c => c.lootedBy == selectedLooter);

	return <Stack>
		<Title order={2}>Total currencies</Title>
		<Select label="date" clearable data={existingTransactionDates} value={selectedDate} onChange={setSelectedDate} />
		<Select label="looter" clearable data={existingLooters as string[]} value={selectedLooter} onChange={setSelectedLooter} />
		<FundsTotalsDisplay data={selectedTransactions} />
		<Title order={2}>Transactions list</Title>
		<TransactionsDisplay data={selectedTransactions} />
	</Stack>
}

function FundsTotalsDisplay({ data }: { data: TransactionModelWithId[] }) {
	const { getCurrency } = useContext(CurrencyContext)

	const flatTransactionValues = data.flatMap(({ value }) => value.map(o => ({
		currencyId: o.currencyId,
		currencyName: getCurrency(o.currencyId)?.currencyName,
		amount: o.amount
	})));

	var currencySums = Object.entries(group(flatTransactionValues, (x) => x.currencyId)).map(([key, value]) => {
		if (!value) throw new Error('Object entry value is null')

		return {
			amount: sum(value, (x) => x.amount),
			currencyId: value[0].currencyId,
			currencyName: value[0].currencyName
		}
	})
	if (currencySums.length === 0) {
		return <Card><div>No items to display</div></Card>
	}

	return <Card m={"md"} withBorder>
		<Table data={{
			head: ['Currency Name', 'Amount', ''],
			body: currencySums.map(c => {
				return [
					c.currencyName,
					c.amount,
					<TableRowControl key={c.currencyId} currencyId={c.currencyId} />
				]
			})
		}} />
	</Card>
}

function TransactionsDisplay({ data }: { data: TransactionModelWithId[] }) {
	const { getCurrency } = useContext(CurrencyContext)

	if (data.length === 0) {
		return <Card m={"md"} withBorder><div>No items to display</div></Card>
	}

	return <Card m={"md"} withBorder>
		<Table>
			<Table.Thead>
				<TableTr>
					<TableTh rowSpan={2}>Transaction Label</TableTh>
					<TableTh rowSpan={2}>Transaction Date</TableTh>
					<TableTh rowSpan={2}>Looted By</TableTh>
					<TableTh colSpan={2}>Transaction Value</TableTh>
				</TableTr>
				<TableTr>
					<TableTh>Currency</TableTh>
					<TableTh>Amount</TableTh>
				</TableTr>
			</Table.Thead>
			<Table.Tbody>
				{
					data.map((x) => {
						return <React.Fragment key={x.transactionId}>
							<TableTr>
								<TableTd rowSpan={x.value.length}>
									{x.label}
								</TableTd>
								<TableTd rowSpan={x.value.length}>
									{x.transactionDate.toISOString().substring(0, 10)}
								</TableTd>
								<TableTd rowSpan={x.value.length}>
									{x.lootedBy}
								</TableTd>
								<TableTd>
									{getCurrency(x.value[0]?.currencyId)?.currencyName}
								</TableTd>
								<TableTd>{x.value[0]?.amount}</TableTd>
							</TableTr>
							{x.value.slice(1).map(y => {
								return <TableTr key={y.transactionValueId}>
									<TableTd>
										{getCurrency(y.currencyId)?.currencyName}
									</TableTd>
									<TableTd>{y.amount}</TableTd>
								</TableTr>
							})}
						</React.Fragment>
					})
				}
			</Table.Tbody>
		</Table>
	</Card>
}

function TableRowControl({ currencyId }: { currencyId: string }) {
	const [opened, setOpened] = useState(false);

	return (
		<Popover opened={opened} width={600} trapFocus position="bottom" shadow="md">
			<Popover.Target>
				<Button onClick={() => setOpened(true)} variant="subtle">
					<FontAwesomeIcon icon={faCoins} />
				</Button>
			</Popover.Target>
			<Popover.Dropdown>
				<CurrencyConvertForm
					cancelFormCallback={() => setOpened(false)}
					CurrencyToConvert={currencyId} />
			</Popover.Dropdown>
		</Popover>
	)
}

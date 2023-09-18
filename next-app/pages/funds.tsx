import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next/types";
import { prismaClient } from "@/globals/prisma-client";
import { CurrencyContextProvider } from "@/features/currencies/context-component/currency-context";
import { UserFundsAddForm } from "@/features/transactions/add-component/form";
import { CurrencyModelWithId } from "@/features/currencies/currency-schema";
import { TransactionModelWithId, TransactionSchemaWithId } from "@/features/transactions/transaction-schema";
import { z } from "zod";
import { Stack, Title } from "@mantine/core";
import { UserFundsDisplay } from "@/features/transactions/display-component/display";

export const getServerSideProps = async (_context: GetServerSidePropsContext) => {
	const result = await prismaClient.transaction.findMany({
		include: {
			transactionValue: {
				include: {
					currency: true
				}
			}
		},
	});

	const currencies = await prismaClient.currency.findMany();
	return {
		props: {
			transactions: JSON.stringify(result.map(x => {
				return {
					transactionId: x.id,
					label: x.label,
					lootedBy: x.lootedBy,
					transactionDate: x.transactionDate,
					value: x.transactionValue.map(o => {
						return {
							amount: o.amount,
							currencyId: o.currencyId,
							transactionValueId: o.id
						}
					})
				} as TransactionModelWithId
			})),
			currencies: currencies.map(x => {
				return {
					currencyId: x.id,
					currencyName: x.currencyName,
					value: x.currencyValue
				} as CurrencyModelWithId
			}),
		}
	}
}


export default function Transactions({
	transactions, currencies
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const parsedTransactions = z.array(TransactionSchemaWithId).parse(JSON.parse(transactions))

	return (
		<CurrencyContextProvider initialState={currencies}>
			<Stack>
				<Title>Funds overview</Title>
				<UserFundsDisplay data={parsedTransactions} />
				<UserFundsAddForm />
			</Stack>
		</CurrencyContextProvider>
	)
}


import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next/types";
import { prismaClient } from "@/globals/prisma-client";
import { CurrencyContextProvider } from "@/features/currencies/context-component/currency-context";
import { UserFundsAddForm } from "@/features/transactions/add-component/form";
import { CurrencyModelWithId } from "@/features/currencies/currency-schema";
import { TransactionModelWithId, TransactionSchemaWithId } from "@/features/transactions/transaction-schema";
import { z } from "zod";
import { Stack, Title } from "@mantine/core";
import { UserFundsDisplay } from "@/features/transactions/display-component/display";
import { TransactionValueModelWithId } from "@/features/transaction-value/transaction-value-schema";

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
			transactions: JSON.stringify(result.map<TransactionModelWithId>(x => ({
					transactionId: x.id,
					label: x.label,
					transactionDate: x.transactionDate,
					value: x.transactionValue.map<TransactionValueModelWithId>(o => {
						return {
							amount: o.amount,
							currencyId: o.currencyId,
							transactionValueId: o.id
						}
					})
				}))),
			currencies: currencies.map<CurrencyModelWithId>(x => ({
				currencyId: x.id,
				currencyName: x.currencyName,
				value: x.currencyValue
			})),
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


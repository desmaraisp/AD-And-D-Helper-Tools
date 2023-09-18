import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next/types";
import { prismaClient } from "@/globals/prisma-client";
import { CurrencyContextProvider } from "@/features/currencies/context-component/currency-context";
import { CurrencyDisplayTable } from "@/features/currencies/display-component/display";
import { CurrencyAddForm } from "@/features/currencies/add-component/form";
import { CurrencyModelWithId } from "@/features/currencies/currency-schema";
import { Stack, Title } from "@mantine/core";

export const getServerSideProps = async (_context: GetServerSidePropsContext) => {
	const result = await prismaClient.currency.findMany()

	return {
		props: {
			currencies: result.map(x => {
				return {
					currencyId: x.id,
					currencyName: x.currencyName,
					value: x.currencyValue
				} as CurrencyModelWithId
			})
		}
	}
}


export default function Transactions({
	currencies
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<CurrencyContextProvider initialState={currencies}>
			<Title>Currencies</Title>
			<Stack>
				<CurrencyDisplayTable />
				<CurrencyAddForm />
			</Stack>
		</CurrencyContextProvider>
	)
}

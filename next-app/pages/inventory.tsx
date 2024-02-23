import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next/types";
import { prismaClient } from "@/globals/prisma-client";
import { Stack, Title } from "@mantine/core";
import { InventoryDisplay } from "@/features/inventory/display-component/main-display";
import { InventoryItemModelWithId } from "@/features/inventory/inventory-schema";
import { CurrencyModelWithId } from "@/features/currencies/currency-schema";
import { OwnershipModelWithId, OwnershipSchemaWithId } from "@/features/item-ownership/ownership-schema";
import { z } from "zod";
import { CurrencyContextProvider } from "@/features/currencies/context-component/currency-context";
import { InventoryItemAdd } from "@/features/inventory/add-component/form";
import { OwnershipsContextProvider } from "@/features/item-ownership/context-component/ownership-context";
import { InventoryContextProvider } from "@/features/inventory/context-component/inventory-context";

export const getServerSideProps = async (_context: GetServerSidePropsContext) => {
	const inventory = await prismaClient.inventoryItem.findMany({
		include: {
			itemValue: true
		},
	});
	const ownership = await prismaClient.inventoryItemOwnership.findMany();

	const currencies = await prismaClient.currency.findMany();
	return {
		props: {
			inventory: inventory.map(x => {
				return {
					description: x.description,
					itemId: x.id,
					itemName: x.name,
					itemValue: x.itemValue.map(o => ({
						amount: o.amount,
						currencyId: o.currencyId,
						itemValueId: o.id
					}))
				} as InventoryItemModelWithId
			}),
			ownership: JSON.stringify(ownership.map(x => ({
				attachedTransaction: [],
				itemId: x.itemId,
				count: x.count,
				dateObtained: x.dateObtained,
				ownershipId: x.id
			} as OwnershipModelWithId))),
			currencies: currencies.map(x => ({
				currencyId: x.id,
				currencyName: x.currencyName,
				value: x.currencyValue
			} as CurrencyModelWithId)),
		}
	}
}


export default function Inventory({
	inventory, currencies, ownership
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const parsedOwnerships = z.array(OwnershipSchemaWithId).parse(JSON.parse(ownership))

	return (
		<CurrencyContextProvider initialState={currencies}>
			<OwnershipsContextProvider initialState={parsedOwnerships}>
				<InventoryContextProvider initialState={inventory}>
					<Stack>
						<Title>Inventory</Title>
						<InventoryDisplay />
						<InventoryItemAdd />
					</Stack>
				</InventoryContextProvider>
			</OwnershipsContextProvider>
		</CurrencyContextProvider>
	)
}

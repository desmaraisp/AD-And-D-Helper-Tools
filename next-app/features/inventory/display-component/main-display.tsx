import { ReactNode, useContext, useState } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Popover, Select, Stack, Table, TableTd, TableTh, TableTr, TextInput, Text } from "@mantine/core";
import { ItemOwnershipAddForm } from "@/features/item-ownership/add-component/form";
import { InventoryItemModel, InventoryItemModelWithId } from "../inventory-schema";
import { list, range, sum, unique } from "radash";
import { EditButton } from "@/components/edit-button";
import { InventoryItemEditForm } from "../edit-component/form";
import { OwnershipContext } from "@/features/item-ownership/context-component/ownership-context";
import { InventoryContext } from "../context-component/inventory-context";
import { OwnershipModelWithId } from "@/features/item-ownership/ownership-schema";
import { CurrencyContext } from "@/features/currencies/context-component/currency-context";

export function InventoryDisplay() {
	const { ownerships } = useContext(OwnershipContext)
	const { getItem, inventory } = useContext(InventoryContext)

	const [selectedDate, setSelectedDate] = useState<string | null>(null)
	const [selectedLooter, setSelectedLooter] = useState<string | null>(null)

	const existingDateObtained = unique(ownerships.flatMap(({ dateObtained }) => dateObtained.toDateString()))
	const existingLooters = unique(ownerships.flatMap(({ lootedBy }) => lootedBy)).filter(x => !!x)

	const selectedOwnershipsByDate = selectedDate == null ? ownerships : ownerships.filter(c => c.dateObtained.toDateString() == selectedDate);
	const selectedOwnershipsByLooter = selectedLooter == null ? selectedOwnershipsByDate : selectedOwnershipsByDate.filter(c => c.lootedBy == selectedLooter);

	let selectedInventory: InventoryItemModelWithId[]
	if (!selectedDate && !selectedLooter) {
		selectedInventory = inventory
	}
	else {
		selectedInventory = unique(selectedOwnershipsByLooter, (x) => x.itemId).map(x => getItem(x.itemId))
	}

	return <Stack>
		<Select label="date" clearable data={existingDateObtained} value={selectedDate} onChange={setSelectedDate} />
		<Select label="looter" clearable data={existingLooters as string[]} value={selectedLooter} onChange={setSelectedLooter} />
		<InventoryItemMainDisplay inventory={selectedInventory} ownerships={selectedOwnershipsByLooter} />
	</Stack>
}

export function InventoryItemMainDisplay({ inventory, ownerships }: { inventory: InventoryItemModelWithId[], ownerships: OwnershipModelWithId[] }) {
	return (
		<Card withBorder m="md">
			<Table withColumnBorders>
				<Table.Thead>
					<TableTr>
						<TableTh rowSpan={2}>
							Item Name
						</TableTh>
						<TableTh rowSpan={2}>
							Description
						</TableTh>
						<TableTh rowSpan={2}>Total Owned</TableTh>
						<TableTh colSpan={2}>Item Value</TableTh>
						<TableTh colSpan={4}>Ownerships</TableTh>
						<TableTh rowSpan={2} />
					</TableTr>
					<TableTr>
						<TableTh>Currency</TableTh>
						<TableTh>Amount</TableTh>
						<TableTh>Count</TableTh>
						<TableTh>Date Obtained</TableTh>
						<TableTh>Owned by</TableTh>
						<TableTh>Looted by</TableTh>
					</TableTr>
				</Table.Thead>
				<Table.Tbody>
					{
						inventory.map((item) => <InventoryDisplayTableItem item={item} key={item.itemId} ownerships={ownerships.filter(x => x.itemId == item.itemId)} />)
					}
				</Table.Tbody>
			</Table>
		</Card>
	)
}

function InventoryDisplayTableItem({ item, ownerships }: { item: InventoryItemModelWithId, ownerships: OwnershipModelWithId[] }) {
	const { getCurrency } = useContext(CurrencyContext)
	const numberOfRows = Math.max(item.itemValue.length, ownerships.length, 1)

	let additionalRows: ReactNode[] = []
	if (numberOfRows > 1) {
		additionalRows = list(1, numberOfRows - 1).map((index) => <TableTr key={index}>
			<TableTd>
				{getCurrency(item.itemValue[index]?.currencyId)?.currencyName}
			</TableTd>
			<TableTd>
				{item.itemValue[index]?.amount}
			</TableTd>
			<TableTd>{ownerships[index]?.count}</TableTd>
			<TableTd>{ownerships[index]?.dateObtained?.toISOString()?.substring(0, 10)}</TableTd>
			<TableTd>{ownerships[index]?.ownedBy}</TableTd>
			<TableTd>{ownerships[index]?.lootedBy}</TableTd>
		</TableTr>)
	}

	return <>
		<TableTr style={{ borderTop: '2px solid' }}>
			<TableTd rowSpan={numberOfRows}>{item.itemName}</TableTd>
			<TableTd rowSpan={numberOfRows}>
				<Text style={{whiteSpace: "pre-line"}}>{item.description || "No description was provided"}</Text>
			</TableTd>
			<TableTd rowSpan={numberOfRows}>
				{sum(ownerships, (x) => x.count)}
			</TableTd>
			<TableTd>
				{getCurrency(item.itemValue[0]?.currencyId)?.currencyName}
			</TableTd>
			<TableTd>
				{item.itemValue[0]?.amount}
			</TableTd>
			<TableTd>{ownerships[0]?.count}</TableTd>
			<TableTd>{ownerships[0]?.dateObtained.toISOString().substring(0, 10)}</TableTd>
			<TableTd>{ownerships[0]?.ownedBy}</TableTd>
			<TableTd>{ownerships[0]?.lootedBy}</TableTd>
			<TableTd rowSpan={numberOfRows}>
				<EditPopover item={item} />
				<AddPopover item={item} />
			</TableTd>
		</TableTr>
		{additionalRows}
	</>
}

function AddPopover({ item }: { item: InventoryItemModelWithId }) {
	return <Popover width={600} trapFocus position="bottom" shadow="md">
		<Popover.Target>
			<Button variant="subtle">
				<FontAwesomeIcon icon={faCoins} />
			</Button>
		</Popover.Target>
		<Popover.Dropdown>
			<ItemOwnershipAddForm item={item} />
		</Popover.Dropdown>
	</Popover>;
}

function EditPopover({ item }: { item: InventoryItemModelWithId }) {
	const [opened, setOpened] = useState(false);

	return (
		<Popover opened={opened} width={600} trapFocus position="bottom" shadow="md">
			<Popover.Target>
				<Button onClick={() => setOpened(true)} variant="subtle">
					<FontAwesomeIcon icon={faEdit} />
				</Button>
			</Popover.Target>
			<Popover.Dropdown>
				<InventoryItemEditForm
					cancelFormCallback={() => setOpened(false)}
					defaultValue={item}
					itemId={item.itemId}
				/>
			</Popover.Dropdown>
		</Popover>
	)
}

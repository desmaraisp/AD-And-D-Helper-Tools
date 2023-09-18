import { useContext, useState } from "react";
import { CurrencyContext } from "../context-component/currency-context";
import { CurrencyEditForm } from "../edit-component/form";
import React from "react";
import { Alert, Button, Card, Popover, Table, TableData } from "@mantine/core";
import { CurrencyModelWithId } from "../currency-schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export function CurrencyDisplayTable() {
	const { currencies } = useContext(CurrencyContext)

	if (currencies.length === 0) {
		return <Alert>No items to display</Alert>
	}

	const tableData: TableData = {
		head: ['Currency Name', 'Value', ''],
		body: currencies.map(c => {
			return [
				c.currencyName,
				c.value,
				<TableRowControl key={c.currencyId} currency={c} />
			]
		})
	};

	return <Card withBorder m="md">
		<Table data={tableData} />
	</Card>
}

function TableRowControl({ currency }: { currency: CurrencyModelWithId }) {
	const [opened, setOpened] = useState(false);

	return (
		<Popover opened={opened} onChange={setOpened} width={600} trapFocus position="bottom" shadow="md">
			<Popover.Target>
				<Button onClick={() => setOpened(true)} variant="subtle">
					<FontAwesomeIcon icon={faEdit} />
				</Button>
			</Popover.Target>
			<Popover.Dropdown>
				<CurrencyEditForm
					exitFormCallback={() => setOpened(false)}
					model={currency}
				/>
			</Popover.Dropdown>
		</Popover>
	)
}

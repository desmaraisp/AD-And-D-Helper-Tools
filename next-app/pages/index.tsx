import { Anchor, Stack, Title } from "@mantine/core";
import Link from "next/link";

export default function Home() {
	return <>
		<Title>Links</Title>
		<Stack>
			<Anchor component={Link} href={"/comments"}>Comments</Anchor>
			<Anchor component={Link} href={"/funds"}>Funds</Anchor>
			<Anchor component={Link} href={"/currencies"}>Currencies</Anchor>
			<Anchor component={Link} href={"/inventory"}>Inventory</Anchor>
		</Stack>
	</>
}
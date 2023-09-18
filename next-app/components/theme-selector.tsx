import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { ActionIcon, useMantineColorScheme } from "@mantine/core";

export function ThemeSelector() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

	const isDarkTheme = colorScheme === 'dark'
	const label = isDarkTheme ? "Switch to light mode" : "Switch to dark mode"

	return (
		<ActionIcon
			variant="transparent"
			style={{ display: 'flex', justifyContent: 'center' }}
			size={"sm"}
			m={4}
			aria-label={label}
			title={label}
			onClick={() => toggleColorScheme()}
		>
			<FontAwesomeIcon style={{
				height: '100%', width: '100%'
			}} icon={isDarkTheme ? faMoon : faSun} />
		</ActionIcon>
	)
}
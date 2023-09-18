import { ThemeSelector } from '@/components/theme-selector'
import { Anchor, AppShell, Flex, MantineProvider } from '@mantine/core'
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { NoSsr } from '@/components/no-ssr';
import Link from 'next/link';

export default function App({ Component, pageProps, router }: AppProps) {
	if (router.pathname === '/swagger-ui') {
		return <Component {...pageProps} />
	}

	return <MantineProvider>
		<AppShell padding="xl">
			<AppShell.Header>
				<Flex justify={'space-between'}>
					<Anchor mx='sm' underline='never' component={Link} href={"/"}>Home</Anchor>
					<NoSsr>
						<ThemeSelector />
					</NoSsr>
				</Flex>
			</AppShell.Header>

			<AppShell.Main>
				<Component {...pageProps} />
			</AppShell.Main>
		</AppShell>
	</MantineProvider>
}

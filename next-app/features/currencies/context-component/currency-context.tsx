import { ReactNode, createContext } from "react";
import { CurrencyModelWithId } from "../currency-schema";

type ContextReturnType = {
	currencies: CurrencyModelWithId[];
	getCurrency: (id: string) => CurrencyModelWithId | undefined
};

export const CurrencyContext = createContext<ContextReturnType>({
	currencies: [],
	getCurrency: (id) => {return undefined}
});

type ContextProviderProps = {
	children: ReactNode;
	initialState: CurrencyModelWithId[];
};

export function CurrencyContextProvider({ children, initialState }: ContextProviderProps) {
	const getCurrency = (id: string) => {
		return initialState.find(x => x.currencyId === id)
	}

	return (
		<CurrencyContext.Provider value={{
			currencies: initialState,
			getCurrency
		}}>
			{children}
		</CurrencyContext.Provider>
	);
}
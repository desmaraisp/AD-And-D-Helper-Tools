import { ReactNode, createContext } from "react";
import { InventoryItemModelWithId } from "../inventory-schema";

type ContextReturnType = {
	inventory: InventoryItemModelWithId[];
	getItem: (itemId: string) => InventoryItemModelWithId
};

export const InventoryContext = createContext<ContextReturnType>({
	inventory: [],
	getItem: (itemId) => {return {itemId: '', itemName: '', itemValue: [], description: ''} as InventoryItemModelWithId}
});

type ContextProviderProps = {
	children: ReactNode;
	initialState: InventoryItemModelWithId[];
};

export function InventoryContextProvider({ children, initialState }: ContextProviderProps) {
	const getItem = (itemId: string) => {
		const item = initialState.find(x => x.itemId === itemId)
		if(!item) throw new Error('No item found')
		
		return item;
	}

	return (
		<InventoryContext.Provider value={{
			inventory: initialState,
			getItem: getItem
		}}>
			{children}
		</InventoryContext.Provider>
	);
}
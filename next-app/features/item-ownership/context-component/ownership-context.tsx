import { ReactNode, createContext } from "react";
import { OwnershipModelWithId } from "../ownership-schema";

type ContextReturnType = {
	ownerships: OwnershipModelWithId[];
	getOwnerships: (itemId: string) => OwnershipModelWithId[]
};

export const OwnershipContext = createContext<ContextReturnType>({
	ownerships: [],
	getOwnerships: (itemId) => {return []}
});

type ContextProviderProps = {
	children: ReactNode;
	initialState: OwnershipModelWithId[];
};

export function OwnershipsContextProvider({ children, initialState }: ContextProviderProps) {
	const getOwnerships = (itemId: string) => {
		return initialState.filter(x => x.itemId === itemId)
	}

	return (
		<OwnershipContext.Provider value={{
			ownerships: initialState,
			getOwnerships
		}}>
			{children}
		</OwnershipContext.Provider>
	);
}
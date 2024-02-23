import { TransactionModel, TransactionModelWithId } from "@/features/transactions/transaction-schema";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { group, sum } from "radash";

type interactiveTransactionType = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export async function CreateTransactionInDB(transactionObject: TransactionModel, Prisma : interactiveTransactionType) {
	const transactionValues = transactionObject.value.map(x => {
		return {
			currencyId: x.currencyId,
			amount: x.amount
		};
	});

	const createdTransaction = await Prisma.transaction.create({
		data: {
			label: transactionObject.label,
			transactionDate: new Date(transactionObject.transactionDate),
			transactionValue: {
				create: transactionValues
			}
		},
		include: {
			transactionValue: {
				include: {
					currency: true,
					transaction: true
				}
			}
		}
	});

	const currentTransactions = await Prisma.transaction.findMany({
		include: {
			transactionValue: {
				include: {
					currency: true
				}
			}
		}
	});

	const flatTransactionValues = currentTransactions.flatMap(({ transactionValue }) => transactionValue.map(o => ({
		currencyId: o.currencyId,
		amount: o.amount
	})));

	Object.entries(group(flatTransactionValues, (x) => x.currencyId)).forEach(([key, value]) => {
		if (!value) throw new Error('Object entry value is null');

		if (sum(value, x => x.amount) < 0) {
			throw new Error(`You do not have enough of currency ${key}`);
		}
	});

	const response: TransactionModelWithId = {
		transactionId: createdTransaction.id,
		label: createdTransaction.label,
		transactionDate: createdTransaction.transactionDate,
		value: createdTransaction.transactionValue.map(x => {
			return {
				amount: x.amount,
				currencyId: x.currencyId,
				transactionValueId: x.id
			};
		})
	};
	return response;
}

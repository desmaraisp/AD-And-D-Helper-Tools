import { TransactionValueSchema } from "@/features/transaction-value/transaction-value-schema";
import { z } from "zod";

export const CurrencyConvertSchema = z.object({
	transactionDate: z.coerce.date(),
	count: z.number().nonnegative(),
	currencyToConvertTo: TransactionValueSchema.refine(x => x.amount > 0)
})
export interface CurrencyConvertModel extends z.infer<typeof CurrencyConvertSchema> { }

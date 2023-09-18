import { z } from "zod";

export const TransactionValueSchema = z.object({
	currencyId: z.string().min(1),
	amount: z.number(),
})
export interface TransactionValueModel extends z.infer<typeof TransactionValueSchema> { }

export const TransactionValueSchemaWithId = z.object({
	transactionValueId: z.string().min(1)
}).merge(TransactionValueSchema)

export interface TransactionValueModelWithId extends z.infer<typeof TransactionValueSchemaWithId> { }

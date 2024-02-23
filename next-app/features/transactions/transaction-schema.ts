import { z } from 'zod'
import { TransactionValueSchema, TransactionValueSchemaWithId } from '../transaction-value/transaction-value-schema'

export const TransactionSchema = z.object({
	transactionDate: z.coerce.date(),
	label: z.string().min(1),
	value: z.array(TransactionValueSchema)
})
export interface TransactionModel extends z.infer<typeof TransactionSchema> { }

export const TransactionSchemaWithId = TransactionSchema.extend({
	transactionId: z.string(),
	value: z.array(TransactionValueSchemaWithId)
})
export interface TransactionModelWithId extends z.infer<typeof TransactionSchemaWithId> { }
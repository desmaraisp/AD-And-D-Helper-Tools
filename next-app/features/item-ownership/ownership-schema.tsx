import { z } from "zod";
import { TransactionValueSchema, TransactionValueSchemaWithId } from "../transaction-value/transaction-value-schema";

export const OwnershipSchema = z.object({
	itemId: z.string().min(1),
	dateObtained: z.coerce.date(),
	count: z.number(),
	attachedTransaction: z.array(TransactionValueSchema)
});
export interface OwnershipModel extends z.infer<typeof OwnershipSchema> { }

export const OwnershipSchemaWithId = OwnershipSchema.extend({
	ownershipId: z.string().min(1),
	attachedTransaction: z.array(TransactionValueSchemaWithId)
});
export interface OwnershipModelWithId extends z.infer<typeof OwnershipSchemaWithId> { }
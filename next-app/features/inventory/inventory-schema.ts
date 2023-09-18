import { z } from "zod";

const itemValueSchema = z.object({
	currencyId: z.string().min(1),
	amount: z.number(),
});
const itemValueSchemaWithId = itemValueSchema.extend({
	itemValueId: z.string().min(1),
});


export const InventoryItemSchema = z.object({
	itemName: z.string().min(1),
	description: z.string().nullable(),
	itemValue: z.array(itemValueSchema)
});
export interface InventoryItemModel extends z.infer<typeof InventoryItemSchema> { }

export const InventoryItemSchemaWithId = InventoryItemSchema.extend({
	itemId: z.string().min(1),
	itemValue: z.array(itemValueSchemaWithId)
});
export interface InventoryItemModelWithId extends z.infer<typeof InventoryItemSchemaWithId> { }

import { z } from "zod";

export const CurrencySchema = z.object({
	currencyName: z.string().min(1),
	value: z.number().nonnegative(),
})

export interface CurrencyModel extends z.infer<typeof CurrencySchema> { }
export const CurrencySchemaWithId = CurrencySchema.extend({
	currencyId: z.string().min(1),
})
export interface CurrencyModelWithId extends z.infer<typeof CurrencySchemaWithId>{}
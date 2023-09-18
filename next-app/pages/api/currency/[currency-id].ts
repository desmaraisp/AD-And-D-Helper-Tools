import { onApiError } from "@/middleware/api-error-handler";
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect";
import { prismaClient } from "@/globals/prisma-client";
import { z } from "zod";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { CurrencyModelWithId, CurrencySchema, CurrencySchemaWithId } from "@/features/currencies/currency-schema";

const router = createRouter<NextApiRequest, NextApiResponse>();
export const currencyEditRouteConfig: RouteConfig = {
	method: 'put',
	path: '/api/currency/{currency-id}',
	request: {
		body: {
			content: {
				'application/json': {
					schema: CurrencySchema
				}
			}
		},
		params: z.object({
			"currency-id": z.string().min(1),
		})
	},
	responses: {
		200: {
			description: 'Success.',
			content: {
				'application/json': {
					schema: CurrencySchemaWithId
				}
			}
		}
	},
}

router
	.put(
		async (req, res, _next) => {
			const currencyId = req.query["currency-id"]
			const request = await CurrencySchema.parseAsync(req.body)

			const createdCurrency = await prismaClient.currency.update({
				data: {
					currencyName: request.currencyName,
					currencyValue: request.value
				},
				where: {
					id: Array.isArray(currencyId) ? currencyId[0] : currencyId
				}
			});
			const response: CurrencyModelWithId = {
				currencyId: createdCurrency.id,
				currencyName: createdCurrency.currencyName,
				value: createdCurrency.currencyValue
			};
			res.status(200).json(response)
		},
	)
export default router.handler({
	onError: onApiError,
})
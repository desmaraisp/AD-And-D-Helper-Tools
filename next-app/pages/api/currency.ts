import { onApiError } from "@/middleware/api-error-handler";
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect";
import { prismaClient } from "@/globals/prisma-client";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { CurrencyModelWithId, CurrencySchema, CurrencySchemaWithId } from "@/features/currencies/currency-schema";
import { contentTypeFilterMiddleware } from "@/middleware/content-type-filter";

const router = createRouter<NextApiRequest, NextApiResponse>();
export const currencyRouteConfig: RouteConfig = {
	method: 'post',
	path: '/api/currency',
	request: {
		body: {
			content: {
				'application/json': {
					schema: CurrencySchema
				}
			}
		}
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
	.post(
		contentTypeFilterMiddleware('application/json'),
		async (req, res, _next) => {
			const request = await CurrencySchema.parseAsync(req.body)
			const createdCurrency = await prismaClient.currency.create({
				data: {
					currencyName: request.currencyName,
					currencyValue: request.value,
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
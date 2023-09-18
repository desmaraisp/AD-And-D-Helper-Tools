import { onApiError } from "@/middleware/api-error-handler";
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect";
import { TransactionModelWithId, TransactionSchema, TransactionSchemaWithId } from "@/features/transactions/transaction-schema";
import { contentTypeFilterMiddleware } from "@/middleware/content-type-filter";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { CreateTransactionInDB } from "../../features/transactions/lib-api-dal/create-transaction-in-db";
import { prismaClient } from "@/globals/prisma-client";

const router = createRouter<NextApiRequest, NextApiResponse>();
export const transactionsRouteConfig: RouteConfig = {
	method: 'post',
	path: '/api/transaction',
	request: {
		body: {
			content: {
				'application/json': {
					schema: TransactionSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Success.',
			content: {
				'application/json': {
					schema: TransactionSchemaWithId
				}
			}
		}
	},
}

router
	.post(
		contentTypeFilterMiddleware('application/json'),
		async (req, res, _next) => {
			const transactionObject = await TransactionSchema.parseAsync(req.body)

			const response = await prismaClient.$transaction(async (tr) => {
				return await CreateTransactionInDB(transactionObject, tr);
			});
		
			res.status(200).json(response)
		},
	)

export default router.handler({
	onError: onApiError,
})

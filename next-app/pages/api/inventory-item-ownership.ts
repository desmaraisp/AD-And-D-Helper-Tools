import { onApiError } from "@/middleware/api-error-handler";
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect";
import { contentTypeFilterMiddleware } from "@/middleware/content-type-filter";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { OwnershipModelWithId, OwnershipSchema, OwnershipSchemaWithId } from "@/features/item-ownership/ownership-schema";
import { CreateTransactionInDB } from "@/features/transactions/lib-api-dal/create-transaction-in-db";
import { prismaClient } from "@/globals/prisma-client";

const router = createRouter<NextApiRequest, NextApiResponse>();
export const inventoryItemOwnershipRouteConfig: RouteConfig = {
	method: 'post',
	path: '/api/inventory-item-ownership',
	request: {
		body: {
			content: {
				'application/json': {
					schema: OwnershipSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Success.',
			content: {
				'application/json': {
					schema: OwnershipSchemaWithId
				}
			}
		}
	},
}

router
	.post(
		contentTypeFilterMiddleware('application/json'),
		async (req, res, _next) => {
			const payload = await OwnershipSchema.parseAsync(req.body)

			const response = await prismaClient.$transaction(async (tr) => {
				const createdItem = await tr.inventoryItemOwnership.create({
					data: {
						dateObtained: new Date(payload.dateObtained),
						count: payload.count,
						itemId: payload.itemId,
					},
					include: {
						inventoryItem: { select: { name: true } }
					}
				});
				const createdTransaction = await CreateTransactionInDB({
					label: `Exchanged ${payload.count} of item ${createdItem.inventoryItem.name}`,
					transactionDate: createdItem.dateObtained,
					value: payload.attachedTransaction
				}, tr);
				const response: OwnershipModelWithId = {
					itemId: createdItem.itemId,
					count: createdItem.count,
					dateObtained: createdItem.dateObtained,
					ownershipId: createdItem.id,
					attachedTransaction: createdTransaction.value
				};

				return response
			});

			res.status(200).json(response)
		},
	)

export default router.handler({
	onError: onApiError,
})
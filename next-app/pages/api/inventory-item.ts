import { InventoryItemModelWithId, InventoryItemSchema, InventoryItemSchemaWithId } from "@/features/inventory/inventory-schema";
import { prismaClient } from "@/globals/prisma-client";
import { onApiError } from "@/middleware/api-error-handler";
import { contentTypeFilterMiddleware } from "@/middleware/content-type-filter";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();
export const inventoryItemRouteConfig: RouteConfig = {
	method: 'post',
	path: '/api/inventory-item',
	request: {
		body: {
			content: {
				'application/json': {
					schema: InventoryItemSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Success.',
			content: {
				'application/json': {
					schema: InventoryItemSchemaWithId
				}
			}
		}
	},
}

router
	.post(
		contentTypeFilterMiddleware('application/json'),
		async (req, res, _next) => {
			const payload = await InventoryItemSchema.parseAsync(req.body)

			const itemValues = payload.itemValue.map(x => {
				return {
					currencyId: x.currencyId,
					amount: x.amount
				}
			})
			const createdItem = await prismaClient.inventoryItem.create({
				data: {
					name: payload.itemName,
					description: payload.description,
					itemValue: {
						create: itemValues
					}
				},
				include: {
					itemValue: true
				}
			});
			const response: InventoryItemModelWithId = {
				description: createdItem.description,
				itemId: createdItem.id,
				itemName: createdItem.name,
				itemValue: createdItem.itemValue.map(x => {
					return {
						itemValueId: x.id,
						amount: x.amount,
						currencyId: x.currencyId,
					};
				})
			};
			res.status(200).json(response)
		},
	)

export default router.handler({
	onError: onApiError,
})
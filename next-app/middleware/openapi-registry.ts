import { commentRouteConfig } from '@/pages/api/comment';
import { commentDeleteRouteConfig, commentPutRouteConfig } from '@/pages/api/comment/[comment-id]';
import { inventoryItemRouteConfig } from '@/pages/api/inventory-item';
import { inventoryItemDeleteRouteConfig, inventoryItemPutRouteConfig } from '@/pages/api/inventory-item/[item-id]';
import { transactionsRouteConfig } from '@/pages/api/transaction';
import { currencyRouteConfig } from '@/pages/api/currency';
import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { currencyEditRouteConfig } from '@/pages/api/currency/[currency-id]';
import { inventoryItemOwnershipRouteConfig } from '@/pages/api/inventory-item-ownership';

extendZodWithOpenApi(z);

export function createOpenApiRegistry() {
	const registry = new OpenAPIRegistry();
	registry.registerPath(currencyRouteConfig)
	registry.registerPath(transactionsRouteConfig)
	registry.registerPath(inventoryItemRouteConfig)
	registry.registerPath(commentRouteConfig)
	registry.registerPath(commentDeleteRouteConfig)
	registry.registerPath(commentPutRouteConfig)
	registry.registerPath(inventoryItemPutRouteConfig)
	registry.registerPath(currencyEditRouteConfig)
	registry.registerPath(inventoryItemOwnershipRouteConfig)
	registry.registerPath(inventoryItemDeleteRouteConfig)

	const generator = new OpenApiGeneratorV3(registry.definitions);
	return generator.generateDocument({
		openapi: '3.0.0',
		info: {
			version: '1.0.0',
			title: 'Ad&D Helper tools api',
		}
	});
}

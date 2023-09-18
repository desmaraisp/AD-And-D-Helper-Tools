import { SendJsonRequest } from "@/lib/send-request";
import { InventoryItemModel } from "../inventory-schema";

export async function PutInventoryItem(data: InventoryItemModel, itemId: String) {
	return await SendJsonRequest(
		data,
		`/api/inventory-item/${itemId}`,
		'put'
	)
}
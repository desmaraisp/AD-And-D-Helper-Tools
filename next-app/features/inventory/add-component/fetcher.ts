import { SendJsonRequest } from "@/lib/send-request";
import { InventoryItemModel } from "../inventory-schema";

export async function PostNewInventoryItem(data: InventoryItemModel) {
	return await SendJsonRequest(
		data,
		"/api/inventory-item",
		"post"
	);
}
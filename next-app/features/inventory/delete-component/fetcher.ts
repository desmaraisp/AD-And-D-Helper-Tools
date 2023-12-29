import { SendBodyLessRequest } from "@/lib/send-request";

export async function DeleteInventoryItem(itemId: String) {
	return await SendBodyLessRequest(
		`/api/inventory-item/${itemId}`,
		'delete'
	)
}
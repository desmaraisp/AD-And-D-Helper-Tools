import { SendJsonRequest } from "@/lib/send-request";
import { OwnershipModel } from "../ownership-schema";

export async function PostNewItemOwnership(data: OwnershipModel) {
	return await SendJsonRequest(
		data,
		"/api/inventory-item-ownership",
		"post"
	);
}
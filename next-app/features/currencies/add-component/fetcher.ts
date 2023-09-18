import { SendJsonRequest } from "@/lib/send-request";
import { CurrencyModel } from "../currency-schema";

export async function PostNewCurrency(data: CurrencyModel) {
	return await SendJsonRequest(
		data,
		"/api/currency",
		"post"
	);
}
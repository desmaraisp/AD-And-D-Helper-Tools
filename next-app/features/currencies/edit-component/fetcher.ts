import { SendJsonRequest } from "@/lib/send-request";
import { CurrencyModel } from "../currency-schema";

export async function PutNewCurrency(data: CurrencyModel, currencyId: string) {
	return await SendJsonRequest(
		data,
		`/api/currency/${currencyId}`,
		"put"
	);
}
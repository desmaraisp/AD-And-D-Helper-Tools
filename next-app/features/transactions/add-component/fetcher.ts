import { SendJsonRequest } from "@/lib/send-request";
import { TransactionModel } from "@/features/transactions/transaction-schema";

export async function PostNewTransaction(data: TransactionModel) {
	return await SendJsonRequest(
		data,
		"/api/transaction",
		'post'
	)
}
import { isApiError } from "@/lib/api-error-response";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mantine/core";
import { useRouter } from "next/router";
import { useErrorBoundary } from "react-error-boundary";

type Props = {
	deleteCallback: () => Promise<{
		message: string;
	} | null>
}

export function DeleteButton({deleteCallback}: Props) {
	const { showBoundary } = useErrorBoundary();
	const router = useRouter();

	return <Button variant="subtle" onClick={async () => {
		const result = await deleteCallback()
		if (isApiError(result)) {
			showBoundary(result);
			return;
		}
		router.replace(router.asPath);
	}}>
		<FontAwesomeIcon
			icon={faTrash} />
	</Button>;
}
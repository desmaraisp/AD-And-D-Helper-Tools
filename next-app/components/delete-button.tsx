import { isApiError } from "@/lib/api-error-response";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useErrorBoundary } from "react-error-boundary";

type Props = JSX.IntrinsicElements['button'] & {
	deleteCallback: () => Promise<{
		message: string;
	} | null>
}

export const DeleteButton: React.FC<Props> = props => {
	const { showBoundary } = useErrorBoundary();
	const router = useRouter();
	const { deleteCallback, ...buttonProps } = props;

	return <button {...buttonProps} onClick={async () => {
		const result = await deleteCallback()
		if (isApiError(result)) {
			showBoundary(result);
			return;
		}
		router.replace(router.asPath);
	}}>
		<FontAwesomeIcon
			icon={faTrash} />
	</button>;
}
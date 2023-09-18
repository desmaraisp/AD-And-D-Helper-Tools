import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const EditButton: React.FC<JSX.IntrinsicElements['button']> = props => (
	<button type="button" {...props}>
		<FontAwesomeIcon
			icon={faEdit} />
	</button>
)

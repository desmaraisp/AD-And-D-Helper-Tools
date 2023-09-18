import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert } from "@mantine/core";
import { FormErrors, UseFormReturnType } from "@mantine/form";
import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function FormRootError({ errors, className }: { errors: FormErrors, className?: string }) {
	if(errors['root']) return <Alert className={className} color="red">{errors['root']}</Alert>
}

export function SetRootFormError(form: UseFormReturnType<any>, error: string){
	form.setErrors({ 'root': error })
}

export function WrappedWithErrorHandler({ children }: { children: ReactNode }) {
	return <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
		<div>
			<button onClick={resetErrorBoundary}>
				<FontAwesomeIcon icon={faX} />
			</button>
			<span>{error.message}</span>
		</div>
	)}>
		{children}
	</ErrorBoundary>
}
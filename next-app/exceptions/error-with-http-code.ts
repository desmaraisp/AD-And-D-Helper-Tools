export class ErrorWithHTTPCode extends Error {
	code: number
	public constructor(message: string, code: number) {
		super(message)
		this.code = code
	}
}

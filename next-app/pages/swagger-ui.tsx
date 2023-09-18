import { createOpenApiRegistry } from '@/middleware/openapi-registry';
import { InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

export const getStaticProps = async () => {
	const spec = createOpenApiRegistry()

	return {
		props: {
			spec,
		},
	};
};

const SwaggerUI = dynamic<{
	spec: any;
}>(import('swagger-ui-react') as any, { ssr: false });

export default function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
	return <SwaggerUI spec={spec} />;
}
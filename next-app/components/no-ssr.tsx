import dynamic from 'next/dynamic'
import React from 'react'

function NoSsrComponent({children}: {children: React.ReactNode}) {
	return <>{children}</>
}

export const NoSsr = dynamic(() => Promise.resolve(NoSsrComponent), {
  ssr: false
})
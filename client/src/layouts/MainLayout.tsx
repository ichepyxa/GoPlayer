import { Navbar } from '@/components/Navbar'
import React, { FC, Fragment, ReactNode } from 'react'

type MainLayoutProps = {
	children: ReactNode
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
	return (
		<Fragment>
			<Navbar />
			{children}
		</Fragment>
	)
}

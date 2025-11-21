import React from 'react'
import Header from '@/components/header/header'
import Footer from '@/components/footer'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
        {children}
      <Footer />
    </div>
  )
}

export default layout
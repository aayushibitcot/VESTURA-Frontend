import React from 'react'
import Header from '@/components/header/header'
import Footer from '@/components/footer'
import { Category } from '@/types/categories'
import * as API from "@/store/serverApiAction/serverApis";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const response = await API.get<Category[]>('/api/categories');
  const categories = response.data || [];
  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />
      {children}
      <Footer categories={categories} />
    </div>
  )
};

export default layout;
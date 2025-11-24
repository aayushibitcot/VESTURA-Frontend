import React from 'react'
import Header from '@/components/header/header'
import Footer from '@/components/footer'
import { Category } from '@/types/categories'
import * as API from "@/store/serverApiAction/serverApis";
import { API_PATH } from '@/utils/constant';

const layout = async ({ children }: { children: React.ReactNode }) => {
  const response = await API.get<Category[]>(API_PATH.CATEGORIES);
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
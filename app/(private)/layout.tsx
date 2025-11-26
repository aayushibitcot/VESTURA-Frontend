import React from 'react'
import Header from '@/components/header/header'
import Footer from '@/components/footer'
import { Category } from '@/types/categories'
import * as API from "@/store/serverApiAction/serverApis";
import { API_PATH } from '@/utils/constant';
import { fetchCart } from '@/store/cart/action';

const layout = async ({ children }: { children: React.ReactNode }) => {
  const response = await API.get<Category[]>(API_PATH.CATEGORIES);
  const categories = response.data || [];
  const cartRes = await fetchCart()
  const cartItems = cartRes.data?.items || []
  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} cartItems={cartItems} />
      {children}
      <Footer categories={categories} />
    </div>
  )
};

export default layout;
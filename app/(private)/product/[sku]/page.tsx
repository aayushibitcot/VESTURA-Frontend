"use client";

import { use } from "react";
import ProductPageClient from "@/components/product/product-page-client"

interface ProductPageProps {
  params: Promise<{ sku: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { sku } = use(params);
  return <ProductPageClient sku={sku} />
}

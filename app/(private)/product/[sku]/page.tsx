import ProductComponent from "@/components/product";
import * as API from "@/store/serverApiAction/serverApis";
import { Product } from "@/types/products";
import { API_PATH } from "@/utils/constant";

interface ProductPageProps {
  params: Promise<{ sku: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { sku } = await params;
  
  const response = await API.get<Product>(`${API_PATH.PRODUCTS}/${sku}`);

  const product = response?.data as Product;
  const relatedProducts = product.relatedProducts || [];

  const normalizedProduct = {
    ...product,
    sizes: product.sizes || [],
    colors: product.colors || [],
  };

  // Fetch full product details for each related product to get colors and sizes
  const normalizedRelatedProducts = await Promise.all(
    relatedProducts.map(async (relatedProduct) => {
      try {
        const fullProductResponse = await API.get<Product>(`${API_PATH.PRODUCTS}/${relatedProduct.sku}`);
        if (fullProductResponse.success && fullProductResponse.data) {
          const fullProduct = fullProductResponse.data as Product;
          return {
            ...fullProduct,
            sizes: fullProduct.sizes || [],
            colors: fullProduct.colors || [],
          };
        }
        // Fallback to basic product data if fetch fails
        return {
          ...relatedProduct,
          sizes: relatedProduct.sizes || [],
          colors: relatedProduct.colors || [],
        };
      } catch (error) {
        // Fallback to basic product data if fetch fails
        return {
          ...relatedProduct,
          sizes: relatedProduct.sizes || [],
          colors: relatedProduct.colors || [],
        };
      }
    })
  );

  return <ProductComponent product={normalizedProduct as Product} relatedProducts={normalizedRelatedProducts} />
}

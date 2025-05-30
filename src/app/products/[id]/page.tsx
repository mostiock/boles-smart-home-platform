import { products } from "@/data/products";
import ProductPageClient from "./ProductPageClient";

// Generate static params for all products
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductPageClient productId={id} />;
}

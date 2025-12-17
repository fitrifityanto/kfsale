import React from "react";
import ProductCard from "./ProductCard";
import type { Product } from "../types";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 h-96 animate-pulse border border-gray-100"
          >
            <div className="w-full aspect-[4/5] bg-gray-200 mb-4"></div>
            <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 w-1/2 mb-6"></div>
            <div className="mt-auto h-10 bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-black/10">
        <p className="text-gray-900 font-bold uppercase tracking-widest text-lg">
          No Items Found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;

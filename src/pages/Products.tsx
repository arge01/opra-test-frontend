import { useApiQuery, useApiMutation } from '../hooks/useOpra';
import { ShoppingCart, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { ProductType } from '../api';

export function Products() {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const [productsState] = useApiQuery<ProductType[]>({
    queryKey: ['products'],
    run: (api) => api.$product.findMany({ limit: 50, projection: ["id", "name", "description", "image", "price", "stock", "isActive"] })
  });

  const [, executePurchase] = useApiMutation({
    run: (api, productId: string) => api.$purchase.create({ productId, quantity: 1 })
  });

  const handlePurchase = async (productId: string) => {
    setPurchasingId(productId);
    try {
      await executePurchase(productId);
      alert('Ürün başarıyla satın alındı!');
    } catch (err: any) {
      alert(err.message || 'Satın alma işlemi başarısız oldu.');
    } finally {
      setPurchasingId(null);
    }
  };

  if (productsState.isLoading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (productsState.error) return <div className="text-red-500 text-center">Hata: {(productsState.error as any).message}</div>;

  const products = productsState.result;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tüm Ürünler</h1>
        <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1.5 rounded-full">
          {products?.length || 0} Ürün
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products?.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group">
            <div className="aspect-w-16 aspect-h-10 w-full bg-slate-100 relative overflow-hidden h-48">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-12 h-12 opacity-50" />
                </div>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">{product.description}</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-extrabold text-indigo-600">${product.price}</span>
                <button
                  onClick={() => handlePurchase(product.id!)}
                  disabled={purchasingId === product.id}
                  className={clsx(
                    "inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all",
                    purchasingId === product.id
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  )}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{purchasingId === product.id ? 'Alınıyor...' : 'Satın Al'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

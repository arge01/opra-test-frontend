import { useProductMutation, useProductInfiniteQuery } from '../hooks/useProductService';
import { ShoppingCart, Image as ImageIcon, Package } from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { ProductType } from '../api/types';
import { CargoStatusModal } from '../components/CargoStatusModal';

export function Products() {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const { ref, inView } = useInView();

  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useProductInfiniteQuery<ProductType>({
    queryKey: ['products'],
    limit: 12,
    run: (api, params) => {
      const query: Parameters<typeof api.$product.findMany>[0] = {
        limit: params.limit,
        projection: ["id", "name", "description", "image", "price", "stock", "isActive"],
        count: true
      };
      if (params.skip && params.skip >= 1) {
        query.skip = params.skip;
      }
      return api.$product.findMany(query);
    }
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [, executePurchase] = useProductMutation({
    run: (api, productId: string) => api.$purchase.create({ productId, quantity: 1 })
  });

  const handlePurchase = async (productId: string) => {
    setPurchasingId(productId);
    try {
      await executePurchase(productId);
      toast.success('Ürün başarıyla satın alındı!');
    } catch (err: unknown) {
      toast.error((err instanceof Error) ? err.message : 'Satın alma işlemi başarısız oldu.');
    } finally {
      setPurchasingId(null);
    }
  };

  if (isLoading && !products?.length) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (isError && !products?.length) return <div className="text-red-500 text-center">Hata: Ürünler yüklenemedi.</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tüm Ürünler</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsCargoModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-indigo-200"
          >
            <Package className="w-4 h-4" />
            <span>Kargo Sorgula</span>
          </button>
          <span className="bg-slate-100 text-slate-800 text-sm font-semibold px-4 py-2 rounded-xl">
            {products?.length || 0} Ürün Listeleniyor
          </span>
        </div>
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

      {hasNextPage && (
        <div ref={ref} className="py-8 flex justify-center">
          {isFetchingNextPage ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          ) : (
            <span className="text-slate-400">Daha fazla ürün yükleniyor...</span>
          )}
        </div>
      )}

      {/* Cargo Status Modal */}
      <CargoStatusModal isOpen={isCargoModalOpen} onClose={() => setIsCargoModalOpen(false)} />
    </div>
  );
}

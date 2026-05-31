import { PurchaseType } from '../api/types';
import { useProductQuery } from '../hooks/useProductService';
import { Package, Calendar, Truck } from 'lucide-react';
import { useState } from 'react';
import { CargoStatusModal } from '../components/CargoStatusModal';

export function Dashboard() {
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id?: string; name?: string; image?: string } | undefined>();
  const [purchasesState] = useProductQuery<PurchaseType[]>({
    queryKey: ['purchases'],
    run: (api) => api.$purchase.findMany({ limit: 50, projection: ["+product.name", "+product.image", "id", "productId", "quantity", "purchasedAt"] }),
    staleTime: 0,
  });

  if (purchasesState.isLoading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (purchasesState.error) return <div className="text-red-500 text-center">Hata: {(purchasesState.error as Error).message}</div>;

  const purchases = purchasesState.result || [] as PurchaseType[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Satın Aldıklarım</h1>
        <p className="mt-2 text-slate-500">Geçmiş satın alımlarınızı buradan takip edebilirsiniz.</p>
      </div>

      {(!purchases || purchases.length === 0) ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Henüz ürün almadınız</h3>
          <p className="text-slate-500 mt-2">Mağazayı ziyaret edip harika ürünlerimizi inceleyebilirsiniz.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
                {purchase.product?.image ? (
                  <img className="w-full h-full object-cover" src={purchase.product.image} alt={purchase.product?.name} />
                ) : (
                  <Package className="w-12 h-12 text-slate-300" />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-slate-900 line-clamp-1">{purchase.product?.name || 'Bilinmeyen Ürün'}</h4>
                  {purchase.product?.price && (
                    <span className="font-semibold text-emerald-600 ml-2 whitespace-nowrap">{purchase.product.price} TL</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{purchase.product?.description || 'Açıklama yok'}</p>
                <div className="flex items-center text-xs text-slate-500 space-x-3 pt-3 border-t border-slate-100 mt-auto">
                  <span className="font-medium bg-slate-100 px-2 py-1 rounded text-slate-700">Adet: {purchase.quantity}</span>
                  <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {new Date(purchase.purchasedAt || "").toLocaleDateString('tr-TR')}</span>
                  <span className="text-slate-400 font-mono">ID: {purchase.productId}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedProduct({
                        id: purchase.productId,
                        name: purchase.product?.name,
                        image: purchase.product?.image
                      });
                      setIsCargoModalOpen(true);
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors"
                  >
                    <Truck className="w-4 h-4 mr-1.5" />
                    Kargo Durumu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Cargo Status Modal */}
      <CargoStatusModal 
        isOpen={isCargoModalOpen} 
        onClose={() => setIsCargoModalOpen(false)} 
        productId={selectedProduct?.id} 
        productName={selectedProduct?.name}
        productImage={selectedProduct?.image}
      />
    </div>
  );
}

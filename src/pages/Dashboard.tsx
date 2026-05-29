import { PurchaseType } from '../api';
import { useApiQuery } from '../hooks/useOpra';
import { Package, Calendar } from 'lucide-react';

export function Dashboard() {
  const [purchasesState] = useApiQuery<PurchaseType[]>({
    queryKey: ['purchases'],
    run: (api) => api.$purchase.findMany({ limit: 50, projection: ["id", "productId", "quantity", "purchasedAt"] }),
    staleTime: 0,
  });

  if (purchasesState.isLoading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (purchasesState.error) return <div className="text-red-500 text-center">Hata: {(purchasesState.error as any).message}</div>;

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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <ul className="divide-y divide-slate-200">
            {purchases.map((purchase) => (
              <li key={purchase.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Ürün ID: <span className="font-mono text-sm text-slate-500">{purchase.productId}</span>
                    </h4>
                    <div className="flex items-center text-sm text-slate-500 mt-1 space-x-4">
                      <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">Adet: {purchase.quantity}</span>
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(purchase.purchasedAt || "").toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

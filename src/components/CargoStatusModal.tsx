import { X, Package, Truck, CheckCircle2, AlertCircle, Clock, MapPin } from 'lucide-react';
import { useCargoQuery } from '../hooks/useCargoService';
import { ShipmentStatus, ShipmentType } from '../api/types';
import clsx from 'clsx';
import { OpraFilter } from '@opra/common';

interface CargoStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
  productImage?: string;
}

export function CargoStatusModal({ isOpen, onClose, productId, productName, productImage }: CargoStatusModalProps) {
  const [cargoState] = useCargoQuery<ShipmentType[]>({
    queryKey: ['cargo-status', productId],
    run: (api) => api.$shipment.findMany({
      projection: ["id", "status", "createdAt", "productId"],
      filter: OpraFilter.$eq(OpraFilter.$field("productId"), String(productId))
    }),
    enabled: isOpen,
  });

  const filteredShipments = cargoState.result;

  const getStatusDisplay = (status?: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.PENDING:
        return { label: 'Hazırlanıyor', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock };
      case ShipmentStatus.IN_TRANSIT:
        return { label: 'Yolda', color: 'text-blue-600', bg: 'bg-blue-100', icon: Truck };
      case ShipmentStatus.OUT_FOR_DELIVERY:
        return { label: 'Dağıtıma Çıktı', color: 'text-indigo-600', bg: 'bg-indigo-100', icon: MapPin };
      case ShipmentStatus.DELIVERED:
        return { label: 'Teslim Edildi', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle2 };
      case ShipmentStatus.FAILED_DELIVERY:
        return { label: 'Teslim Edilemedi', color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle };
      case ShipmentStatus.AT_FACILITY:
        return { label: 'Transfer Merkezinde', color: 'text-purple-600', bg: 'bg-purple-100', icon: Package };
      default:
        return { label: 'Bilinmiyor', color: 'text-slate-600', bg: 'bg-slate-100', icon: Package };
    }
  };

  const renderTimeline = (status?: ShipmentStatus) => {
    const nodes = [
      { label: 'Hazırlanıyor' },
      { label: 'Yolda' },
      { label: 'Dağıtıma Çıktı' },
      { label: 'Teslim Edildi' }
    ];

    let currentStepIndex = 0;
    let isError = false;
    switch (status) {
      case ShipmentStatus.PENDING: currentStepIndex = 0; break;
      case ShipmentStatus.AT_FACILITY:
      case ShipmentStatus.IN_TRANSIT: currentStepIndex = 1; break;
      case ShipmentStatus.OUT_FOR_DELIVERY: currentStepIndex = 2; break;
      case ShipmentStatus.DELIVERED: currentStepIndex = 3; break;
      case ShipmentStatus.FAILED_DELIVERY: currentStepIndex = 3; isError = true; break;
      default: currentStepIndex = -1; isError = true; break;
    }

    const percentage = currentStepIndex >= 0 ? (currentStepIndex / (nodes.length - 1)) * 100 : 0;

    return (
      <div className="relative mt-12 mb-14 mx-4 sm:mx-8">
        {/* Base line */}
        <div className="absolute top-2 left-0 right-0 h-1.5 bg-slate-100 rounded-full"></div>

        {/* Fill line */}
        <div
          className={clsx("absolute top-2 left-0 h-1.5 rounded-full transition-all duration-700", isError ? "bg-red-500" : "bg-indigo-500")}
          style={{ width: `${percentage}%` }}
        ></div>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isCompleted = i <= currentStepIndex;
          const isCurrent = i === currentStepIndex;
          const isFailedStep = isCurrent && isError;
          const pos = (i / (nodes.length - 1)) * 100;

          return (
            <div
              key={i}
              className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${pos}%` }}
            >
              <div className={clsx(
                "w-5 h-5 rounded-full border-4 z-10 transition-colors duration-500 bg-white",
                isFailedStep ? "border-red-500" :
                  isCompleted ? "border-indigo-500" : "border-slate-200"
              )}></div>
              <div className={clsx(
                "mt-3 text-[10px] sm:text-xs font-bold whitespace-nowrap text-center",
                isFailedStep ? "text-red-600" :
                  isCurrent ? "text-indigo-700" :
                    isCompleted ? "text-slate-700" : "text-slate-400"
              )}>
                {isFailedStep && i === nodes.length - 1 ? 'Teslim Edilemedi' : node.label}
              </div>
            </div>
          );
        })}

        {/* Truck Icon (renders on top of the active node) */}
        {currentStepIndex >= 0 && (
          <div
            className="absolute -top-8 transition-all duration-700 ease-in-out transform -translate-x-1/2 z-20"
            style={{ left: `${percentage}%` }}
          >
            <div className={clsx(
              "p-1.5 rounded-full shadow-md text-white flex items-center justify-center",
              currentStepIndex < 3 ? "animate-bounce" : "",
              isError ? "bg-red-500" : "bg-indigo-600"
            )}>
              {isError ? <AlertCircle className="w-4 h-4" /> : (currentStepIndex === 3 ? <CheckCircle2 className="w-4 h-4" /> : <Truck className="w-4 h-4" />)}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center !m-0 !p-0 justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Kargo Durumu Sorgulama</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {cargoState.isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <span className="text-slate-500 font-medium">Kargo verileri sorgulanıyor...</span>
            </div>
          ) : cargoState.error ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Sorgulama Başarısız</h3>
              <p className="text-slate-500 mt-2">{(cargoState.error instanceof Error) ? cargoState.error.message : String(cargoState.error)}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(!filteredShipments || filteredShipments.length === 0) ? (
                <div className="text-center py-12 text-slate-500">Aktif kargo kaydınız bulunmuyor.</div>
              ) : (
                filteredShipments.map((shipment) => {
                  const { label, color, bg, icon: StatusIcon } = getStatusDisplay(shipment.status);
                  return (
                    <div key={shipment.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          {productImage ? (
                            <img src={productImage} alt={productName || 'Ürün'} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                          ) : (
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{productName || 'Genel Kargo Kaydı'}</p>
                            <p className="text-xs font-medium text-slate-400 mt-0.5 tracking-wider font-mono">ID: {shipment.id?.split('-')[0] || 'Atanmadı'}</p>
                          </div>
                        </div>
                        <div className={clsx("px-3 py-1 rounded-full flex items-center space-x-1.5 text-sm font-semibold whitespace-nowrap", color, bg)}>
                          <StatusIcon className="w-4 h-4" />
                          <span>{label}</span>
                        </div>
                      </div>

                      {/* Cargo Timeline Component */}
                      {renderTimeline(shipment.status)}

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-[120px]">
                        <div>
                          <p className="text-xs text-slate-500 mb-1 flex items-center"><Clock className="w-3 h-3 mr-1" /> Oluşturulma Tarihi</p>
                          <p className="text-sm font-medium text-slate-800">
                            {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

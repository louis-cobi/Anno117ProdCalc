import { useProductionStore } from '../store/productionStore'

export function SavedChains() {
  const { chains, removeChain } = useProductionStore()

  if (chains.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-2xl mt-12">
      <h2 className="text-2xl font-semibold text-white mb-6">Chaînes de production sauvegardées</h2>
      <div className="space-y-4">
        {chains.map((chain) => (
          <div
            key={chain.id}
            className="bg-white border border-white rounded-lg p-6 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-[#1C1C1C]">{chain.name}</h3>
              <button
                onClick={() => removeChain(chain.id)}
                className="text-[#1C1C1C] hover:opacity-70 transition-opacity text-sm px-3 py-1 border border-[#1C1C1C] rounded"
                aria-label={`Supprimer ${chain.name}`}
              >
                Supprimer
              </button>
            </div>
            <div className="space-y-2">
              {chain.buildings.map((building, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                >
                  <span className="text-[#1C1C1C] font-medium">{building.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[#1C1C1C] text-sm">
                      Durée: {building.duration} min
                    </span>
                    <span className="text-[#1C1C1C] font-bold">
                      Ratio optimal: {building.ratio || chain.base / building.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                Base (LCM): {chain.base} minutes
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


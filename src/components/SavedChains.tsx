import { useState } from 'react'
import { useProductionStore } from '../store/productionStore'

export function SavedChains() {
  const { chains, removeChain } = useProductionStore()
  const [searchQuery, setSearchQuery] = useState('')

  if (chains.length === 0) {
    return null
  }

  // Trier par date décroissante (plus récentes en premier)
  const sortedChains = [...chains].sort((a, b) => b.createdAt - a.createdAt)

  // Filtrer les chaînes selon la recherche
  const filteredChains = sortedChains.filter((chain) => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    
    // Rechercher dans le nom de la chaîne
    if (chain.name.toLowerCase().includes(query)) return true
    
    // Rechercher dans les noms des bâtiments
    return chain.buildings.some((building) =>
      building.name.toLowerCase().includes(query)
    )
  })

  return (
    <div className="w-full max-w-2xl mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Chaînes de production sauvegardées
        </h2>
        {chains.length > 0 && (
          <span className="text-white text-sm">
            {filteredChains.length} / {chains.length}
          </span>
        )}
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom de chaîne ou bâtiment..."
          className="w-full px-4 py-2 border border-white rounded text-white bg-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1C1C1C] placeholder:text-gray-400"
        />
      </div>

      {filteredChains.length === 0 ? (
        <div className="text-white text-center py-8">
          Aucune chaîne ne correspond à votre recherche
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChains.map((chain) => (
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
      )}
    </div>
  )
}



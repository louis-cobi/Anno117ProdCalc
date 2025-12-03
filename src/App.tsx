import { useState } from 'react'
import { Trash, CircleX } from 'lucide-react'
import { calculateOptimalRatios } from './utils/calculations'
import { parseDuration } from './utils/durationParser'
import { useProductionStore } from './store/productionStore'
import { SavedChains } from './components/SavedChains'

interface BuildingInput {
  id: string
  name: string
  duration: string
}

function App() {
  const [chainName, setChainName] = useState('')
  const [buildings, setBuildings] = useState<BuildingInput[]>([
    { id: '1', name: '', duration: '' },
    { id: '2', name: '', duration: '' },
  ])
  const [calculatedRatios, setCalculatedRatios] = useState<number[]>([])
  const [base, setBase] = useState<number | null>(null)
  const [durationErrors, setDurationErrors] = useState<Record<string, string>>({})
  const { addChain } = useProductionStore()

  const addBuilding = () => {
    setBuildings([
      ...buildings,
      { id: Date.now().toString(), name: '', duration: '' },
    ])
  }

  const removeBuilding = (id: string) => {
    if (buildings.length > 2) {
      setBuildings(buildings.filter((b) => b.id !== id))
      // Réinitialiser les ratios si on supprime un bâtiment après calcul
      if (calculatedRatios.length > 0) {
        setCalculatedRatios([])
        setBase(null)
      }
    }
  }

  const updateBuilding = (id: string, field: 'name' | 'duration', value: string) => {
    setBuildings(
      buildings.map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      )
    )
    // Réinitialiser les ratios si on modifie après calcul
    if (calculatedRatios.length > 0) {
      setCalculatedRatios([])
      setBase(null)
    }
    // Réinitialiser l'erreur pour ce champ si on modifie la durée
    if (field === 'duration') {
      setDurationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!chainName.trim()) {
      alert('Veuillez entrer un nom pour la chaîne de production')
      return
    }

    if (buildings.some((b) => !b.name.trim())) {
      alert('Veuillez remplir le nom de tous les bâtiments')
      return
    }

    // Convertir toutes les durées en minutes décimales
    const durations: number[] = []
    const errors: Record<string, string> = {}

    for (const building of buildings) {
      const parsed = parseDuration(building.duration)
      
      if (!parsed.success) {
        errors[building.id] = parsed.error || 'Durée invalide'
      } else if (parsed.minutes !== undefined) {
        if (parsed.minutes <= 0) {
          errors[building.id] = 'La durée doit être supérieure à 0'
        } else {
          durations.push(parsed.minutes)
        }
      } else {
        errors[building.id] = 'Durée invalide'
      }
    }

    // Si des erreurs existent, les afficher et arrêter
    if (Object.keys(errors).length > 0) {
      setDurationErrors(errors)
      const firstError = Object.values(errors)[0]
      alert(`Erreur de validation : ${firstError}`)
      return
    }

    // Vérification de sécurité : toutes les durées doivent être valides
    if (durations.length !== buildings.length) {
      alert('Erreur : toutes les durées doivent être valides')
      return
    }

    try {
      const result = calculateOptimalRatios(durations)
      setCalculatedRatios(result.ratios)
      setBase(result.base)

      // Sauvegarder dans le store
      addChain({
        name: chainName.trim(),
        buildings: buildings.map((b, index) => ({
          name: b.name.trim(),
          duration: durations[index],
          ratio: result.ratios[index],
        })),
        base: result.base,
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors du calcul')
    }
  }

  const clearForm = () => {
    setChainName('')
    setBuildings([
      { id: '1', name: '', duration: '' },
      { id: '2', name: '', duration: '' },
    ])
    setCalculatedRatios([])
    setBase(null)
    setDurationErrors({})
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Calculateur de Production Anno 117
        </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="chain-name"
                className="block text-white font-semibold"
              >
                Nom de la chaîne de production
              </label>
              {(chainName || buildings.some(b => b.name || b.duration) || calculatedRatios.length > 0) && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="text-white hover:opacity-70 transition-opacity p-2"
                  aria-label="Vider le formulaire"
                  title="Vider le formulaire"
                >
                  <CircleX size={20} />
                </button>
              )}
            </div>
            <input
              id="chain-name"
              type="text"
              value={chainName}
              onChange={(e) => setChainName(e.target.value)}
              className="w-full px-4 py-2 border border-white rounded text-white bg-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1C1C1C] placeholder:text-gray-400"
              placeholder="Ex: Production de ..."
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-white font-semibold">
                Bâtiments de production
              </label>
              <button
                type="button"
                onClick={addBuilding}
                className="bg-white text-[#1C1C1C] px-4 py-2 rounded border border-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1C1C1C] font-semibold"
              >
                + Ajouter un bâtiment
              </button>
            </div>

            <div className="space-y-4">
              {buildings.map((building, index) => (
                <div key={building.id} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label
                      htmlFor={`building-name-${building.id}`}
                      className="block text-sm text-white mb-1"
                    >
                      Nom du bâtiment
                    </label>
                    <input
                      id={`building-name-${building.id}`}
                      type="text"
                      value={building.name}
                      onChange={(e) =>
                        updateBuilding(building.id, 'name', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-white rounded text-white bg-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1C1C1C] placeholder:text-gray-400"
                      placeholder="bâtiment de ..."
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor={`building-duration-${building.id}`}
                      className="block text-sm text-white mb-1"
                    >
                      Durée (minutes)
                    </label>
                    <input
                      id={`building-duration-${building.id}`}
                      type="text"
                      value={building.duration}
                      onChange={(e) =>
                        updateBuilding(building.id, 'duration', e.target.value)
                      }
                      className={`w-full px-4 py-2 border rounded text-white bg-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1C1C1C] placeholder:text-gray-400 ${
                        durationErrors[building.id] ? 'border-red-500' : 'border-white'
                      }`}
                      placeholder="Ex: 1.30 ou 0,5 ou 2:45"
                      required
                    />
                    {durationErrors[building.id] && (
                      <p className="text-red-400 text-xs mt-1">
                        {durationErrors[building.id]}
                      </p>
                    )}
                  </div>
                  {calculatedRatios.length > 0 && calculatedRatios[index] !== undefined && (
                    <div className="flex items-end">
                      <div className="bg-white text-[#1C1C1C] border border-white px-4 py-2 rounded font-bold min-w-[120px] text-center">
                        Ratio: {calculatedRatios[index]}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center pb-2">
                    <button
                      type="button"
                      onClick={() => removeBuilding(building.id)}
                      disabled={buildings.length <= 2}
                      className="p-2 text-white hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1C1C1C] rounded"
                      aria-label={`Supprimer le bâtiment ${index + 1}`}
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {base !== null && (
            <div className="mb-6 p-4 border border-white rounded">
              <p className="text-white font-semibold">
                Base (LCM): {base} minutes
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-[#1C1C1C] px-6 py-3 rounded font-semibold border border-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1C1C1C]"
          >
            Calculer les ratios optimaux
          </button>
        </form>

        <SavedChains />
      </div>
    </div>
  )
}

export default App

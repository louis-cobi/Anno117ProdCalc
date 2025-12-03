import { calculateOptimalRatios } from '../utils/calculations'

interface TestCase {
  name: string
  times: number[]
  expectedRatios: number[]
}

const testCases: TestCase[] = [
  {
    name: 'Mouton + Laine',
    times: [0.5, 1],
    expectedRatios: [1, 2],
  },
  {
    name: 'Cultivateur + Pressoir',
    times: [2, 1.5],
    expectedRatios: [4, 3],
  },
  {
    name: '3 bâtiments - 0.5, 1, 2',
    times: [0.5, 1, 2],
    expectedRatios: [1, 2, 4],
  },
  {
    name: '3 bâtiments - 1, 1.5, 3',
    times: [1, 1.5, 3],
    expectedRatios: [2, 3, 6],
  },
  {
    name: '4 bâtiments - 0.5, 1, 1.5, 2',
    times: [0.5, 1, 1.5, 2],
    expectedRatios: [1, 2, 3, 4],
  },
  {
    name: '4 bâtiments - 1.5, 2, 3, 4.5',
    times: [1.5, 2, 3, 4.5],
    expectedRatios: [1, 2, 3, 4],
  },
  {
    name: '5 bâtiments - 1, 2, 3, 4, 6',
    times: [1, 2, 3, 4, 6],
    expectedRatios: [1, 2, 3, 4, 6],
  },
  {
    name: '5 bâtiments - 0.5, 1, 1.5, 2, 2.5',
    times: [0.5, 1, 1.5, 2, 2.5],
    expectedRatios: [1, 2, 3, 4, 5],
  },
  {
    name: '6 bâtiments - 1, 1.5, 2, 2.5, 3, 4',
    times: [1, 1.5, 2, 2.5, 3, 4],
    expectedRatios: [2, 3, 4, 5, 6, 8],
  },
  {
    name: 'Format horloge - 0:30, 1:00, 2:15',
    times: [0.5, 1, 2.25],
    expectedRatios: [2, 4, 9],
  },
  {
    name: 'Durées variées - 0.25, 0.5, 1, 2',
    times: [0.25, 0.5, 1, 2],
    expectedRatios: [1, 2, 4, 8],
  },
  {
    name: 'Cas complexe - 0.5, 1.5, 2.5, 3.5',
    times: [0.5, 1.5, 2.5, 3.5],
    expectedRatios: [1, 3, 5, 7],
  },
]

export function TestCalculations() {
  const runTests = () => {
    console.log('🧪 Tests de calculateOptimalRatios\n')
    console.log('='.repeat(80))

    let passedCount = 0
    let totalCount = 0

    testCases.forEach((testCase) => {
      totalCount++
      const result = calculateOptimalRatios(testCase.times)
      const passed =
        JSON.stringify(result.ratios) === JSON.stringify(testCase.expectedRatios)

      console.log(`\n${passed ? '✅' : '❌'} Test: ${testCase.name}`)
      console.log(`   Temps: [${testCase.times.join(', ')}]`)
      console.log(`   Attendu: [${testCase.expectedRatios.join(', ')}]`)
      console.log(`   Obtenu:  [${result.ratios.join(', ')}]`)
      console.log(`   Base (LCM): ${result.base}`)

      if (!passed) {
        console.error(`   ⚠️ ÉCHEC: Les ratios ne correspondent pas!`)
      } else {
        passedCount++
      }
    })

    console.log('\n' + '='.repeat(80))
    console.log(`\n📊 Résultats: ${passedCount}/${totalCount} tests réussis`)

    if (passedCount === totalCount) {
      console.log('🎉 Tous les tests sont passés!')
      alert(`✅ Tous les tests sont passés! (${passedCount}/${totalCount})`)
    } else {
      console.log(`⚠️  ${totalCount - passedCount} test(s) ont échoué`)
      alert(
        `⚠️ ${totalCount - passedCount} test(s) ont échoué (${passedCount}/${totalCount} réussis)`
      )
    }
  }

  return (
    <div className="w-full max-w-2xl mt-8 mb-8 p-6 border border-white rounded">
      <h2 className="text-2xl font-bold text-white mb-4">
        Tests de l'algorithme
      </h2>
      <p className="text-white mb-4 text-sm">
        Cliquez sur le bouton pour exécuter une série de tests avec différentes
        chaînes de production (2 à 6 bâtiments) et vérifier que l'algorithme
        fonctionne correctement.
      </p>
      <button
        onClick={runTests}
        className="bg-white text-[#1C1C1C] px-6 py-3 rounded font-semibold border border-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1C1C1C]"
      >
        🧪 Exécuter les tests
      </button>
      <p className="text-gray-400 text-xs mt-4">
        Les résultats s'afficheront dans la console du navigateur (F12)
      </p>
    </div>
  )
}


/**
 * Test rapide pour vérifier que le parser prend en compte les 3 séparateurs
 */

import { parseDuration } from './durationParser'

// Tests pour les 3 séparateurs
const testCases = [
  { input: '1.30', expected: 1.5, description: 'Point (.)' },
  { input: '1,30', expected: 1.5, description: 'Virgule (,)' },
  { input: '1:30', expected: 1.5, description: 'Deux-points (:)' },
  { input: '2.45', expected: 2.75, description: 'Point - 2min 45sec' },
  { input: '2,45', expected: 2.75, description: 'Virgule - 2min 45sec' },
  { input: '2:45', expected: 2.75, description: 'Deux-points - 2min 45sec' },
  { input: '0.30', expected: 0.5, description: 'Point - 30sec' },
  { input: '0,30', expected: 0.5, description: 'Virgule - 30sec' },
  { input: '0:30', expected: 0.5, description: 'Deux-points - 30sec' },
]

export function testDurationParser() {
  console.log('🧪 Tests du parser de durée (3 séparateurs)\n')
  console.log('='.repeat(60))

  let passedCount = 0
  let totalCount = 0

  testCases.forEach((test) => {
    totalCount++
    const result = parseDuration(test.input)
    const passed = result.success && Math.abs((result.minutes || 0) - test.expected) < 0.001

    console.log(`\n${passed ? '✅' : '❌'} ${test.description}`)
    console.log(`   Input: "${test.input}"`)
    console.log(`   Attendu: ${test.expected} minutes`)
    console.log(`   Obtenu: ${result.success ? result.minutes : 'ERREUR'}`)
    if (!result.success) {
      console.log(`   Erreur: ${result.error}`)
    }

    if (passed) passedCount++
  })

  console.log('\n' + '='.repeat(60))
  console.log(`\n📊 Résultats: ${passedCount}/${totalCount} tests réussis`)

  if (passedCount === totalCount) {
    console.log('🎉 Tous les séparateurs fonctionnent correctement!')
  } else {
    console.log(`⚠️  ${totalCount - passedCount} test(s) ont échoué`)
  }
}

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).testDurationParser = testDurationParser
}


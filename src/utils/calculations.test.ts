/**
 * Tests pour la fonction calculateOptimalRatios
 * Ce fichier peut être exécuté dans la console du navigateur pour tester l'algorithme
 */

import { calculateOptimalRatios } from './calculations'

// Fonction de test
function testCase(name: string, times: number[], expectedRatios: number[]) {
  const result = calculateOptimalRatios(times)
  const passed = JSON.stringify(result.ratios) === JSON.stringify(expectedRatios)
  
  console.log(`\n${passed ? '✅' : '❌'} Test: ${name}`)
  console.log(`   Temps: [${times.join(', ')}]`)
  console.log(`   Attendu: [${expectedRatios.join(', ')}]`)
  console.log(`   Obtenu:  [${result.ratios.join(', ')}]`)
  console.log(`   Base (LCM): ${result.base}`)
  
  if (!passed) {
    console.error(`   ⚠️ ÉCHEC: Les ratios ne correspondent pas!`)
  }
  
  return passed
}

// Exécuter tous les tests
export function runTests() {
  console.log('🧪 Tests de calculateOptimalRatios\n')
  console.log('=' .repeat(60))
  
  let passedCount = 0
  let totalCount = 0

  // Test 1: Mouton (0.5) et Laine (1)
  totalCount++
  if (testCase('Mouton + Laine', [0.5, 1], [1, 2])) passedCount++

  // Test 2: Cultivateur (2) et Pressoir (1.5)
  totalCount++
  if (testCase('Cultivateur + Pressoir', [2, 1.5], [4, 3])) passedCount++

  // Test 3: Trois bâtiments - exemple simple
  totalCount++
  if (testCase('3 bâtiments - 0.5, 1, 2', [0.5, 1, 2], [1, 2, 4])) passedCount++

  // Test 4: Trois bâtiments avec durées différentes
  totalCount++
  if (testCase('3 bâtiments - 1, 1.5, 3', [1, 1.5, 3], [2, 3, 6])) passedCount++

  // Test 5: Quatre bâtiments
  totalCount++
  if (testCase('4 bâtiments - 0.5, 1, 1.5, 2', [0.5, 1, 1.5, 2], [1, 2, 3, 4])) passedCount++

  // Test 6: Cinq bâtiments avec durées variées
  totalCount++
  if (testCase('5 bâtiments - 1, 2, 3, 4, 6', [1, 2, 3, 4, 6], [1, 2, 3, 4, 6])) passedCount++

  // Test 7: Durées avec secondes (format horloge converti)
  totalCount++
  if (testCase('Format horloge - 0:30, 1:00, 2:15', [0.5, 1, 2.25], [2, 4, 9])) passedCount++

  // Test 8: Cas avec durées très différentes
  totalCount++
  if (testCase('Durées variées - 0.25, 0.5, 1, 2', [0.25, 0.5, 1, 2], [1, 2, 4, 8])) passedCount++

  // Test 9: Cas complexe avec 4 bâtiments
  totalCount++
  if (testCase('Complexe - 1.5, 2, 3, 4.5', [1.5, 2, 3, 4.5], [1, 2, 3, 4])) passedCount++

  // Test 10: Six bâtiments
  totalCount++
  if (testCase('6 bâtiments - 1, 1.5, 2, 2.5, 3, 4', [1, 1.5, 2, 2.5, 3, 4], [2, 3, 4, 5, 6, 8])) passedCount++

  console.log('\n' + '='.repeat(60))
  console.log(`\n📊 Résultats: ${passedCount}/${totalCount} tests réussis`)
  
  if (passedCount === totalCount) {
    console.log('🎉 Tous les tests sont passés!')
  } else {
    console.log(`⚠️  ${totalCount - passedCount} test(s) ont échoué`)
  }
}

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).testCalculations = runTests
}


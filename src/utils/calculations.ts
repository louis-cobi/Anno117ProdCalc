/**
 * Calcule le PGCD (Plus Grand Commun Diviseur) avec l'algorithme d'Euclide
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  
  return a
}

/**
 * Calcule le PGCD d'un tableau de nombres
 */
function gcdArray(numbers: number[]): number {
  return numbers.reduce((acc, num) => gcd(acc, num), numbers[0])
}

/**
 * Calcule le LCM (Plus Petit Multiple Commun) de deux nombres
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return Math.abs(Math.round(a * b)) / gcd(a, b)
}

/**
 * Trouve le facteur de multiplication nécessaire pour convertir tous les décimaux en entiers
 */
function getMultiplier(times: number[]): number {
  let maxDecimals = 0
  
  for (const time of times) {
    const decimalPart = time.toString().split('.')[1]
    if (decimalPart) {
      maxDecimals = Math.max(maxDecimals, decimalPart.length)
    }
  }
  
  return Math.pow(10, maxDecimals)
}

/**
 * Calcule les ratios optimaux pour une chaîne de production
 * 
 * Principe : Plus un bâtiment est lent (temps long), plus on a besoin de bâtiments
 * pour compenser et équilibrer avec les bâtiments rapides.
 * 
 * Exemple : Mouton (0.5 min) et Laine (1 min)
 * - Mouton produit 2 unités/min, Laine produit 1 unité/min
 * - Pour équilibrer : 1 mouton nécessite 2 laine
 * - Ratio : Mouton = 1, Laine = 2
 * 
 * @param times Liste des temps de production en minutes (peut contenir des décimaux)
 * @returns Objet avec base (LCM) et ratios (entiers simplifiés) pour chaque bâtiment
 */
export function calculateOptimalRatios(times: number[]): {
  base: number
  ratios: number[]
} {
  if (times.length === 0) {
    return { base: 1, ratios: [] }
  }

  // Filtrer les temps valides (> 0)
  const validTimes = times.filter((t) => t > 0)
  if (validTimes.length === 0) {
    return { base: 1, ratios: [] }
  }

  // Convertir tous les temps en entiers en multipliant par une puissance de 10
  // Cela permet de travailler avec des entiers pour éviter les erreurs de précision
  const multiplier = getMultiplier(validTimes)
  const integerTimes = validTimes.map((t) => Math.round(t * multiplier))

  // Trouver le temps minimum (en entiers)
  const minIntegerTime = Math.min(...integerTimes)

  // Calculer les ratios relatifs : time / minTime
  // Ces ratios sont des fractions qu'il faut convertir en entiers
  // Exemple : si times = [2, 1.5], alors integerTimes = [20, 15], minTime = 15
  // Ratios = [20/15, 15/15] = [4/3, 1]
  
  // Pour chaque temps, le ratio est integerTime / minIntegerTime
  // On simplifie chaque fraction en divisant par le PGCD
  const ratios: number[] = []
  for (const time of integerTimes) {
    const ratioGcd = gcd(time, minIntegerTime)
    const numerator = time / ratioGcd
    const denominator = minIntegerTime / ratioGcd
    // Le ratio est numerator/denominator, on le stocke comme fraction
    ratios.push(numerator / denominator)
  }

  // Trouver le LCM des dénominateurs pour convertir tous les ratios en entiers
  // Pour chaque ratio, on a besoin de trouver son dénominateur après simplification
  const denominators: number[] = []
  for (const time of integerTimes) {
    const ratioGcd = gcd(time, minIntegerTime)
    const denominator = minIntegerTime / ratioGcd
    denominators.push(denominator)
  }
  
  // Calculer le LCM de tous les dénominateurs
  const lcmOfDenominators = denominators.reduce((acc, den) => lcm(acc, den), denominators[0])

  // Multiplier chaque ratio par le LCM des dénominateurs pour obtenir des entiers
  const finalIntegerRatios = ratios.map(r => Math.round(r * lcmOfDenominators))

  // Simplifier en divisant par le PGCD des ratios finaux pour obtenir les plus petits entiers
  const gcdOfRatios = gcdArray(finalIntegerRatios)
  const simplifiedRatios = finalIntegerRatios.map((r) => Math.round(r / gcdOfRatios))

  // Calculer le LCM des temps originaux pour la base
  const lcmResult = integerTimes.reduce((acc, time) => lcm(acc, time), integerTimes[0])
  const base = lcmResult / multiplier

  return { 
    base: Math.round(base), 
    ratios: simplifiedRatios
  }
}

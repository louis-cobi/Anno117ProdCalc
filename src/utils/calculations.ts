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
 * L'objectif est de trouver le nombre minimal de bâtiments pour que tous fonctionnent en continu
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

  // Convertir les décimaux en entiers pour le calcul
  const multiplier = getMultiplier(validTimes)
  const integerTimes = validTimes.map((t) => Math.round(t * multiplier))

  // Calculer le LCM de tous les temps
  const lcmResult = integerTimes.reduce((acc, time) => lcm(acc, time), integerTimes[0])

  // Convertir le LCM en temps réel (diviser par le multiplicateur)
  const base = lcmResult / multiplier

  // Calculer les ratios bruts : combien de fois chaque bâtiment doit produire dans le cycle
  const rawRatios = validTimes.map((time) => {
    return base / time
  })

  // Convertir en entiers en multipliant par un facteur commun
  // On trouve le plus petit multiplicateur qui rend tous les ratios entiers
  // En fait, on peut utiliser le LCM des dénominateurs
  const ratioMultiplier = getMultiplier(rawRatios)
  const integerRatios = rawRatios.map((r) => Math.round(r * ratioMultiplier))

  // Simplifier les ratios en divisant par leur PGCD pour obtenir les plus petits entiers
  const gcdOfRatios = gcdArray(integerRatios)
  const simplifiedRatios = integerRatios.map((r) => r / gcdOfRatios)

  return { 
    base: Math.round(base), 
    ratios: simplifiedRatios.map(r => Math.round(r))
  }
}

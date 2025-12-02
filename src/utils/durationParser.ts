/**
 * Convertit une durée saisie par l'utilisateur en minutes décimales
 * Accepte les formats : M.SS, M,SS, M:SS ou simplement M (minutes)
 * 
 * @param input La valeur saisie par l'utilisateur
 * @returns Un objet avec la valeur en minutes décimales ou une erreur
 */
export function parseDuration(input: string): {
  success: boolean
  minutes?: number
  error?: string
} {
  const trimmed = input.trim()

  // Si vide
  if (!trimmed) {
    return { success: false, error: 'La durée ne peut pas être vide' }
  }

  // Vérifier si c'est un format horloge (contient . , ou :)
  const hasSeparator = /[.,:]/.test(trimmed)

  if (!hasSeparator) {
    // Format simple : juste des minutes
    const minutes = parseFloat(trimmed)
    if (isNaN(minutes) || minutes < 0) {
      return { success: false, error: 'Durée invalide' }
    }
    return { success: true, minutes }
  }

  // Format horloge : M.SS, M,SS ou M:SS
  // Séparer par point, virgule ou deux-points
  const parts = trimmed.split(/[.,:]/)

  if (parts.length !== 2) {
    return {
      success: false,
      error: 'Format invalide. Utilisez M.SS, M,SS ou M:SS (ex: 1.30 pour 1 min 30 sec)',
    }
  }

  const minutesPart = parts[0].trim()
  const secondsPart = parts[1].trim()

  // Vérifier que les parties sont des nombres
  const minutes = parseInt(minutesPart, 10)
  const seconds = parseInt(secondsPart, 10)

  if (isNaN(minutes) || isNaN(seconds)) {
    return {
      success: false,
      error: 'Les minutes et secondes doivent être des nombres',
    }
  }

  // Vérifier que les minutes sont positives
  if (minutes < 0) {
    return { success: false, error: 'Les minutes ne peuvent pas être négatives' }
  }

  // Vérifier que les secondes sont entre 0 et 59
  if (seconds < 0 || seconds > 59) {
    return {
      success: false,
      error: `Les secondes doivent être entre 0 et 59 (reçu: ${seconds})`,
    }
  }

  // Vérifier que la partie secondes a au maximum 2 chiffres
  if (secondsPart.length > 2) {
    return {
      success: false,
      error: 'Les secondes doivent avoir au maximum 2 chiffres (0-59)',
    }
  }

  // Convertir en minutes décimales
  const decimalMinutes = minutes + seconds / 60

  return { success: true, minutes: decimalMinutes }
}


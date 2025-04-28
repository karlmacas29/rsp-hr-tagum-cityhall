// src/utils/ratingCalculations.js

/**
 * Calculate weighted score for a category with validation
 * @param {number} score - Raw score (0-100)
 * @param {number} weight - Category weight (0-1)
 * @returns {number} Calculated points
 */
const calculateWeightedScore = (score, weight) => {
  const validScore = Math.max(0, Math.min(100, Number(score) || 0))
  const validWeight = Math.max(0, Math.min(1, Number(weight) || 0))
  return validScore * validWeight
}

/**
 * Calculate totals for an applicant
 * @param {object} applicant
 * @param {object} criteria
 * @returns {object} Calculated scores
 */
export const calculateApplicantScores = (applicant, criteria) => {
  const education = calculateWeightedScore(applicant.education, criteria.education.weight)
  const experience = calculateWeightedScore(applicant.experience, criteria.experience.weight)
  const training = calculateWeightedScore(applicant.training, criteria.training.weight)
  const performance = calculateWeightedScore(applicant.performance, criteria.performance.weight)
  const bei = calculateWeightedScore(applicant.bei, 0.3) // BEI is always 30%

  const qsTotal = education + experience + training + performance
  const grandTotal = qsTotal + bei

  return {
    ...applicant,
    education,
    experience,
    training,
    performance,
    bei,
    qsTotal,
    grandTotal,
  }
}

/**
 * Rank applicants by their scores
 * @param {array} applicants
 * @param {object} criteria
 * @returns {array} Ranked applicants
 */
export const rankApplicants = (applicants, criteria) => {
  return applicants
    .map((app) => calculateApplicantScores(app, criteria))
    .sort((a, b) => b.grandTotal - a.grandTotal)
    .map((app, index) => ({
      ...app,
      rank: index + 1,
    }))
}

/**
 * Format number to fixed decimal places
 * @param {number} value
 * @param {number} [decimals=1]
 * @returns {number}
 */
export const formatNumber = (value, decimals = 1) => {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

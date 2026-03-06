import { Router, Request, Response } from 'express'
import { prisma } from '../prisma'

const router = Router()

interface Job {
  id: number
  title: string
  description: string
  requirements: string[]
  salary?: number | null
  location?: string | null
  company?: string | null
  createdAt: Date
  score?: number
}

// Calculate recommendation score
function calculateScore(job: Job, userPreferences: any, userSkills: string[]): number {
  let score = 0

  if (!userPreferences) return 0

  // Must-have scoring (70%)
  const mustHaves = userPreferences.mustHave || []
  const mustHaveMatches = mustHaves.filter((item: string) =>
    job.requirements?.some((req: string) =>
      req.toLowerCase().includes(item.toLowerCase())
    )
  ).length

  if (mustHaves.length > 0) {
    score += (mustHaveMatches / mustHaves.length) * 70
  }

  // Nice-to-have scoring (20%)
  const niceToHave = userPreferences.niceToHave || []
  const niceToHaveMatches = niceToHave.filter((item: string) =>
    job.requirements?.some((req: string) =>
      req.toLowerCase().includes(item.toLowerCase())
    )
  ).length

  if (niceToHave.length > 0) {
    score += (niceToHaveMatches / niceToHave.length) * 20
  }

  // Location scoring (10%)
  if (userPreferences.location && job.location === userPreferences.location) {
    score += 10
  }

  return Math.round(score)
}

// Get recommendations
router.get('/recommend', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' })
    }

    const userPreferences = await prisma.preferences.findUnique({
      where: { userId: parseInt(userId) },
    })

    const profile = await prisma.profile.findUnique({
      where: { userId: parseInt(userId) },
    })

    const jobs = (await prisma.job.findMany()) as Job[]

    const recommendedJobs = jobs
      .map((job) => ({
        ...job,
        score: calculateScore(job, userPreferences, profile?.skills || []),
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .filter((job) => (job.score || 0) > 0)

    res.json({
      recommendations: recommendedJobs,
      total: recommendedJobs.length,
    })
  } catch (error) {
    console.error('Recommend error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get all jobs
router.get('/', async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany()
    res.json(jobs)
  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get job by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    })

    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    res.json(job)
  } catch (error) {
    console.error('Get job error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
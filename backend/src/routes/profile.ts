import { Router, Request, Response } from 'express'
import { prisma } from '../prisma'

const router = Router()

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => String(item || '').trim())
    .filter((item) => item.length > 0)
}

function calculateProfileCompletion(user: any, profile: any): number {
  const checks = [
    Boolean(user?.firstName),
    Boolean(user?.lastName),
    Boolean(user?.email),
    Boolean(profile?.bio),
    Boolean(profile?.education),
    Boolean(profile?.experience),
    Boolean(profile?.location),
    Array.isArray(profile?.skills) && profile.skills.length > 0,
    Array.isArray(profile?.interests) && profile.interests.length > 0,
    Boolean(profile?.cvUrl),
    Boolean(profile?.photoUrl),
  ]

  const completed = checks.filter(Boolean).length
  return Math.round((completed / checks.length) * 100)
}

// Get candidate profile
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId)

    if (!userId) {
      return res.status(400).json({ error: 'Invalid userId' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
    })

    const completionScore = calculateProfileCompletion(user, profile)

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: (user as any).userType === 'RECRUITER' ? 'recruiter' : 'candidate',
        onboardingCompleted: Boolean((user as any).onboardingCompleted),
      },
      profile,
      completionScore,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Upsert candidate profile
router.put('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId)

    if (!userId) {
      return res.status(400).json({ error: 'Invalid userId' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if ((user as any).userType === 'RECRUITER') {
      return res.status(403).json({ error: 'Only candidate profiles are supported here' })
    }

    const {
      bio,
      education,
      experience,
      location,
      skills,
      interests,
      cvUrl,
      photoUrl,
    } = req.body

    const profileData = {
      bio: String(bio || '').trim() || null,
      education: String(education || '').trim() || null,
      experience: String(experience || '').trim() || null,
      location: String(location || '').trim() || null,
      skills: toStringArray(skills),
      interests: toStringArray(interests),
      cvUrl: String(cvUrl || '').trim() || null,
      photoUrl: String(photoUrl || '').trim() || null,
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData,
      },
    })

    const completionScore = calculateProfileCompletion(user, profile)

    res.json({
      profile,
      completionScore,
      message: 'Profile saved successfully',
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

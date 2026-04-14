import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createHash, randomBytes } from 'crypto'
import { prisma } from '../prisma'

const router = Router()

const USER_TYPES = {
  candidate: 'CANDIDATE',
  recruiter: 'RECRUITER',
} as const

type UserTypeInput = keyof typeof USER_TYPES
const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeUserType(value: unknown): 'CANDIDATE' | 'RECRUITER' {
  if (typeof value !== 'string') return 'CANDIDATE'
  const normalized = value.toLowerCase() as UserTypeInput
  return USER_TYPES[normalized] || 'CANDIDATE'
}

function userTypeForClient(value: string): 'candidate' | 'recruiter' {
  return value === 'RECRUITER' ? 'recruiter' : 'candidate'
}

function createAccessToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' })
}

function hashResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => String(item || '').trim())
    .filter((item) => item.length > 0)
}

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!firstName || !lastName || !normalizedEmail || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const normalizedUserType = normalizeUserType(userType)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: normalizedEmail,
        password: hashedPassword,
        userType: normalizedUserType,
      },
    })

    const token = createAccessToken(user.id, user.email)

    res.status(201).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: userTypeForClient(user.userType),
        onboardingCompleted: user.onboardingCompleted,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = createAccessToken(user.id, user.email)

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: userTypeForClient(user.userType),
        onboardingCompleted: user.onboardingCompleted,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Forgot password
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Valid email is required' })
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      return res.json({
        message: 'If the email exists, reset instructions were generated',
      })
    }

    const resetToken = randomBytes(32).toString('hex')
    const resetTokenHash = hashResetToken(resetToken)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: resetTokenHash,
        passwordResetExpiresAt: expiresAt,
      },
    })

    res.json({
      message: 'If the email exists, reset instructions were generated',
      resetToken,
      expiresAt,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Reset password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password, confirmPassword } = req.body

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' })
    }

    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    const tokenHash = hashResetToken(String(token))
    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    const hashedPassword = await bcrypt.hash(String(password), 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    })

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Onboarding status
router.get('/onboarding-status', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId)

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { onboardingCompleted: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ onboardingCompleted: user.onboardingCompleted })
  } catch (error) {
    console.error('Onboarding status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Complete onboarding
router.post('/onboarding/complete', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      bio,
      experience,
      location,
      skills,
      mustHave,
      niceToHave,
    } = req.body

    const parsedUserId = Number(userId)
    if (!parsedUserId) {
      return res.status(400).json({ error: 'Missing required userId' })
    }

    const profileData = {
      bio: String(bio || '').trim() || null,
      experience: String(experience || '').trim() || null,
      location: String(location || '').trim() || null,
      skills: toStringArray(skills),
    }

    const preferencesData = {
      location: String(location || '').trim() || null,
      mustHave: toStringArray(mustHave),
      niceToHave: toStringArray(niceToHave),
    }

    await prisma.$transaction(async (tx) => {
      await tx.profile.upsert({
        where: { userId: parsedUserId },
        update: profileData,
        create: {
          userId: parsedUserId,
          ...profileData,
        },
      })

      await tx.preferences.upsert({
        where: { userId: parsedUserId },
        update: preferencesData,
        create: {
          userId: parsedUserId,
          ...preferencesData,
        },
      })

      await tx.user.update({
        where: { id: parsedUserId },
        data: { onboardingCompleted: true },
      })
    })

    res.json({ message: 'Onboarding completed successfully' })
  } catch (error) {
    console.error('Complete onboarding error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
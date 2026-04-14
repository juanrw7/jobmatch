import { Router } from 'express';
import { prisma } from '../prisma';
const router = Router();
function calculateRecruiterProfileCompletion(user, profile) {
    const checks = [
        Boolean(user?.firstName),
        Boolean(user?.lastName),
        Boolean(user?.email),
        Boolean(profile?.companyName),
        Boolean(profile?.description),
        Boolean(profile?.sector),
        Boolean(profile?.logoUrl),
        Boolean(profile?.website),
        Boolean(profile?.location),
    ];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
}
router.get('/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.userType !== 'RECRUITER') {
            return res.status(403).json({ error: 'Only recruiter profiles are supported here' });
        }
        const profile = await prisma.recruiterProfile.findUnique({
            where: { userId },
        });
        const completionScore = calculateRecruiterProfileCompletion(user, profile);
        res.json({
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: 'recruiter',
                onboardingCompleted: Boolean(user.onboardingCompleted),
            },
            profile,
            completionScore,
        });
    }
    catch (error) {
        console.error('Get recruiter profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put('/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.userType !== 'RECRUITER') {
            return res.status(403).json({ error: 'Only recruiter profiles are supported here' });
        }
        const { companyName, description, logoUrl, sector, website, location } = req.body;
        const profileData = {
            companyName: String(companyName || '').trim() || null,
            description: String(description || '').trim() || null,
            logoUrl: String(logoUrl || '').trim() || null,
            sector: String(sector || '').trim() || null,
            website: String(website || '').trim() || null,
            location: String(location || '').trim() || null,
        };
        const profile = await prisma.recruiterProfile.upsert({
            where: { userId },
            update: profileData,
            create: {
                userId,
                ...profileData,
            },
        });
        const completionScore = calculateRecruiterProfileCompletion(user, profile);
        res.json({
            profile,
            completionScore,
            message: 'Recruiter profile saved successfully',
        });
    }
    catch (error) {
        console.error('Update recruiter profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=recruiter-profile.js.map
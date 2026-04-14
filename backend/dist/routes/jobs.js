import { Router } from 'express';
import { prisma } from '../prisma';
const router = Router();
function parseRequirements(value) {
    if (Array.isArray(value)) {
        return value
            .map((item) => String(item || '').trim())
            .filter(Boolean);
    }
    if (typeof value === 'string') {
        return value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
}
function normalizeStringArray(value) {
    if (!Array.isArray(value))
        return [];
    return value
        .map((item) => String(item || '').trim())
        .filter(Boolean);
}
function requirementContains(requirement, keyword) {
    return requirement.toLowerCase().includes(keyword.toLowerCase());
}
function calculateCandidateScore(job, candidateProfile) {
    const requirements = normalizeStringArray(job.requirements);
    const candidateSkills = normalizeStringArray(candidateProfile?.skills);
    const candidateInterests = normalizeStringArray(candidateProfile?.interests);
    const matchedSkills = candidateSkills.filter((skill) => requirements.some((req) => requirementContains(req, skill)));
    const matchedInterests = candidateInterests.filter((interest) => requirements.some((req) => requirementContains(req, interest)));
    const skillsScore = requirements.length > 0
        ? Math.min(70, (matchedSkills.length / requirements.length) * 70)
        : 0;
    const interestsScore = requirements.length > 0
        ? Math.min(20, (matchedInterests.length / requirements.length) * 20)
        : 0;
    const locationScore = job.location &&
        candidateProfile?.location &&
        String(job.location).toLowerCase() === String(candidateProfile.location).toLowerCase()
        ? 10
        : 0;
    const score = Math.round(skillsScore + interestsScore + locationScore);
    const scoreBreakdown = {
        skillsScore: Math.round(skillsScore),
        interestsScore: Math.round(interestsScore),
        locationScore,
        matchedSkills,
        matchedInterests,
    };
    const explanation = [
        `Skills alineadas: ${matchedSkills.length} (+${scoreBreakdown.skillsScore})`,
        `Intereses alineados: ${matchedInterests.length} (+${scoreBreakdown.interestsScore})`,
        `Ubicación: ${locationScore > 0 ? 'coincide' : 'no coincide'} (+${scoreBreakdown.locationScore})`,
    ];
    return { score, scoreBreakdown, explanation };
}
// Calculate recommendation score
function calculateRecommendation(job, userPreferences, userSkills) {
    let score = 0;
    const requirements = normalizeStringArray(job.requirements);
    const normalizedSkills = normalizeStringArray(userSkills);
    const mustHaves = normalizeStringArray(userPreferences?.mustHave);
    const matchedMustHave = mustHaves.filter((item) => requirements.some((req) => requirementContains(req, item)));
    const niceToHave = normalizeStringArray(userPreferences?.niceToHave);
    const matchedNiceToHave = niceToHave.filter((item) => requirements.some((req) => requirementContains(req, item)));
    const matchedSkills = normalizedSkills.filter((skill) => requirements.some((req) => requirementContains(req, skill)));
    const mustHaveScore = mustHaves.length > 0 ? (matchedMustHave.length / mustHaves.length) * 70 : 0;
    const niceToHaveScore = niceToHave.length > 0 ? (matchedNiceToHave.length / niceToHave.length) * 20 : 0;
    const locationScore = userPreferences?.location &&
        job.location &&
        String(userPreferences.location).toLowerCase() === String(job.location).toLowerCase()
        ? 10
        : 0;
    score += mustHaveScore + niceToHaveScore + locationScore;
    const scoreBreakdown = {
        mustHaveScore: Math.round(mustHaveScore),
        niceToHaveScore: Math.round(niceToHaveScore),
        locationScore,
        matchedMustHave,
        matchedNiceToHave,
        matchedSkills,
        totalMatchedSkills: matchedSkills.length,
    };
    const explanation = [
        `Must-have: ${matchedMustHave.length}/${mustHaves.length} (+${scoreBreakdown.mustHaveScore})`,
        `Nice-to-have: ${matchedNiceToHave.length}/${niceToHave.length} (+${scoreBreakdown.niceToHaveScore})`,
        `Ubicación: ${locationScore > 0 ? 'coincide' : 'no coincide'} (+${scoreBreakdown.locationScore})`,
    ];
    if (matchedSkills.length > 0) {
        explanation.push(`Skills detectadas en requisitos: ${matchedSkills.slice(0, 5).join(', ')}`);
    }
    return {
        ...job,
        score: Math.round(score),
        scoreBreakdown,
        explanation,
    };
}
// Get recommendations
router.get('/recommend', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId parameter' });
        }
        const userPreferences = await prisma.preferences.findUnique({
            where: { userId: parseInt(userId) },
        });
        const profile = await prisma.profile.findUnique({
            where: { userId: parseInt(userId) },
        });
        const jobs = (await prisma.job.findMany({ where: { isActive: true } }));
        const recommendedJobs = jobs
            .map((job) => calculateRecommendation(job, userPreferences, profile?.skills || []))
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .filter((job) => (job.score || 0) > 0);
        res.json({
            recommendations: recommendedJobs,
            total: recommendedJobs.length,
        });
    }
    catch (error) {
        console.error('Recommend error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Create job (recruiter)
router.post('/', async (req, res) => {
    try {
        const { recruiterId, title, description, requirements, salary, location, company } = req.body;
        const parsedRecruiterId = Number(recruiterId);
        const parsedRequirements = parseRequirements(requirements);
        if (!parsedRecruiterId || !title || !description || parsedRequirements.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const recruiter = await prisma.user.findUnique({
            where: { id: parsedRecruiterId },
        });
        if (!recruiter || recruiter.userType !== 'RECRUITER') {
            return res.status(403).json({ error: 'Only recruiters can publish jobs' });
        }
        const job = await prisma.job.create({
            data: {
                recruiterId: parsedRecruiterId,
                title: String(title).trim(),
                description: String(description).trim(),
                requirements: parsedRequirements,
                salary: salary ? Number(salary) : null,
                location: String(location || '').trim() || null,
                company: String(company || '').trim() || null,
                isActive: true,
            },
        });
        res.status(201).json(job);
    }
    catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get jobs by recruiter
router.get('/recruiter/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId' });
        }
        const jobs = await prisma.job.findMany({
            where: { recruiterId: userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(jobs);
    }
    catch (error) {
        console.error('Get recruiter jobs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Update job status (active/inactive)
router.patch('/:id/status', async (req, res) => {
    try {
        const jobId = Number(req.params.id);
        const recruiterId = Number(req.body.recruiterId);
        const isActive = Boolean(req.body.isActive);
        if (!jobId || !recruiterId) {
            return res.status(400).json({ error: 'Invalid jobId or recruiterId' });
        }
        const existingJob = await prisma.job.findUnique({ where: { id: jobId } });
        if (!existingJob) {
            return res.status(404).json({ error: 'Job not found' });
        }
        if (existingJob.recruiterId !== recruiterId) {
            return res.status(403).json({ error: 'You can only update your own jobs' });
        }
        const updated = await prisma.job.update({
            where: { id: jobId },
            data: { isActive },
        });
        res.json(updated);
    }
    catch (error) {
        console.error('Update job status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Recommended candidates by job (recruiter)
router.get('/:id/recommended-candidates', async (req, res) => {
    try {
        const jobId = Number(req.params.id);
        const recruiterId = Number(req.query.recruiterId);
        if (!jobId || !recruiterId) {
            return res.status(400).json({ error: 'Invalid jobId or recruiterId' });
        }
        const job = (await prisma.job.findUnique({ where: { id: jobId } }));
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        if (job.recruiterId !== recruiterId) {
            return res.status(403).json({ error: 'You can only view recommendations for your own jobs' });
        }
        const [users, applications] = await Promise.all([
            prisma.user.findMany({
                include: {
                    profile: true,
                },
            }),
            prisma.application.findMany({
                where: { jobId },
            }),
        ]);
        const appliedUserIds = new Set(applications.map((app) => app.userId));
        const recommendedCandidates = users
            .filter((user) => user.userType === 'CANDIDATE')
            .map((user) => {
            const { score, scoreBreakdown, explanation } = calculateCandidateScore(job, user.profile);
            return {
                candidate: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profile: user.profile,
                },
                score,
                scoreBreakdown,
                explanation,
                hasApplied: appliedUserIds.has(user.id),
            };
        })
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score);
        res.json({
            job: {
                id: job.id,
                title: job.title,
                company: job.company,
                location: job.location,
            },
            recommendations: recommendedCandidates,
            total: recommendedCandidates.length,
        });
    }
    catch (error) {
        console.error('Get recommended candidates error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Apply to job (candidate)
router.post('/:id/apply', async (req, res) => {
    try {
        const jobId = Number(req.params.id);
        const userId = Number(req.body.userId);
        if (!jobId || !userId) {
            return res.status(400).json({ error: 'Invalid jobId or userId' });
        }
        const [job, user] = await Promise.all([
            prisma.job.findUnique({ where: { id: jobId } }),
            prisma.user.findUnique({ where: { id: userId } }),
        ]);
        if (!job || !job.isActive) {
            return res.status(404).json({ error: 'Job not found or inactive' });
        }
        if (!user || user.userType !== 'CANDIDATE') {
            return res.status(403).json({ error: 'Only candidates can apply to jobs' });
        }
        const existingApplication = await prisma.application.findFirst({
            where: { userId, jobId },
        });
        if (existingApplication) {
            return res.status(409).json({ error: 'You already applied to this job' });
        }
        const application = await prisma.application.create({
            data: {
                userId,
                jobId,
                status: 'applied',
            },
        });
        res.status(201).json({
            message: 'Application submitted successfully',
            application,
        });
    }
    catch (error) {
        console.error('Apply to job error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get candidate applications
router.get('/applications/user/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId' });
        }
        const applications = await prisma.application.findMany({
            where: { userId },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        company: true,
                        location: true,
                        isActive: true,
                    },
                },
            },
            orderBy: { appliedAt: 'desc' },
        });
        res.json(applications);
    }
    catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get applications received by recruiter
router.get('/applications/recruiter/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId' });
        }
        const applications = await prisma.application.findMany({
            where: {
                job: {
                    recruiterId: userId,
                },
            },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        company: true,
                        isActive: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: { appliedAt: 'desc' },
        });
        res.json(applications);
    }
    catch (error) {
        console.error('Get recruiter applications error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await prisma.job.findMany();
        res.json(jobs);
    }
    catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get job by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const job = await prisma.job.findUnique({
            where: { id: parseInt(id) },
        });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    }
    catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=jobs.js.map
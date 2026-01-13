import { PrismaClient, ContextType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data (order matters due to foreign keys)
    await prisma.source.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.questionContext.deleteMany();
    await prisma.question.deleteMany();
    await prisma.context.deleteMany();

    // Seed Stage contexts
    const stages = [
        { type: ContextType.STAGE, value: 'PRE_ARRIVAL', label: 'Pre-Arrival' },
        { type: ContextType.STAGE, value: 'STUDYING', label: 'Currently Studying' },
        { type: ContextType.STAGE, value: 'GRADUATING', label: 'Graduating' },
    ];

    // Seed Province contexts
    const provinces = [
        { type: ContextType.PROVINCE, value: 'ON', label: 'Ontario' },
        { type: ContextType.PROVINCE, value: 'BC', label: 'British Columbia' },
        { type: ContextType.PROVINCE, value: 'AB', label: 'Alberta' },
        { type: ContextType.PROVINCE, value: 'QC', label: 'Quebec' },
        { type: ContextType.PROVINCE, value: 'MB', label: 'Manitoba' },
        { type: ContextType.PROVINCE, value: 'SK', label: 'Saskatchewan' },
        { type: ContextType.PROVINCE, value: 'NS', label: 'Nova Scotia' },
        { type: ContextType.PROVINCE, value: 'NB', label: 'New Brunswick' },
        { type: ContextType.PROVINCE, value: 'NL', label: 'Newfoundland and Labrador' },
        { type: ContextType.PROVINCE, value: 'PE', label: 'Prince Edward Island' },
        { type: ContextType.PROVINCE, value: 'NT', label: 'Northwest Territories' },
        { type: ContextType.PROVINCE, value: 'YT', label: 'Yukon' },
        { type: ContextType.PROVINCE, value: 'NU', label: 'Nunavut' },
    ];

    // Seed Program contexts
    const programs = [
        { type: ContextType.PROGRAM, value: 'COLLEGE_DIPLOMA', label: 'College Diploma' },
        { type: ContextType.PROGRAM, value: 'UNDERGRADUATE', label: 'Undergraduate Degree' },
        { type: ContextType.PROGRAM, value: 'MASTERS', label: "Master's Degree" },
        { type: ContextType.PROGRAM, value: 'PHD', label: 'PhD / Doctorate' },
        { type: ContextType.PROGRAM, value: 'LANGUAGE_PROGRAM', label: 'Language Program' },
    ];

    const allContexts = [...stages, ...provinces, ...programs];

    for (const context of allContexts) {
        await prisma.context.create({
            data: context,
        });
    }

    console.log(`✅ Seeded ${allContexts.length} context records`);

    // ============================================
    // SAMPLE QUESTIONS
    // ============================================

    const questions = [
        {
            slug: 'can-i-work-off-campus',
            title: 'Can I work off-campus while studying?',
            category: 'Work Rules',
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'You can work off-campus up to 20 hours per week during regular academic sessions if you have a valid study permit that allows off-campus work, you are enrolled full-time at a designated learning institution (DLI), and you are studying in a program that is at least 6 months long and leads to a degree, diploma, or certificate.',
                consequences: 'Working more than 20 hours per week (except during scheduled breaks) or working without authorization can result in: loss of student status, denial of future study or work permits, removal order from Canada, and impact on future immigration applications.',
                verifiedAt: new Date('2026-01-12'),
                sources: [{
                    name: 'Work off campus as an international student',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-12'),
                }],
            },
        },
        {
            slug: 'can-i-travel-outside-canada',
            title: 'Can I travel outside Canada while studying?',
            category: 'Travel',
            answer: {
                allowed: 'YES' as const,
                conditions: 'You can travel outside Canada if your study permit is still valid, you have a valid travel document (passport), and you have a valid visa or eTA to re-enter Canada. Make sure your study permit will not expire while you are abroad.',
                consequences: 'If your study permit expires while outside Canada, you will need to apply for a new one before returning. If your visa expires, you may be denied boarding or denied entry at the border.',
                verifiedAt: new Date('2026-01-12'),
                sources: [{
                    name: 'Travel documents for students',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/travel.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-12'),
                }],
            },
        },
        {
            slug: 'can-i-change-schools',
            title: 'Can I change schools or programs?',
            category: 'Study Status',
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'You can change DLIs or programs if you remain enrolled at a Designated Learning Institution and update your information in the IRCC portal within 10 days of the change. If changing to a significantly different program type, you may need to apply for a new study permit.',
                consequences: 'Failing to report changes or studying at a non-DLI can result in loss of student status. You may be required to leave Canada and could face difficulties in future immigration applications.',
                verifiedAt: new Date('2026-01-12'),
                sources: [{
                    name: 'Change your school or program',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/change-schools.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-12'),
                }],
            },
        },
        {
            slug: 'do-i-need-sin-to-work',
            title: 'Do I need a SIN to work in Canada?',
            category: 'Work Rules',
            answer: {
                allowed: 'YES' as const,
                conditions: 'You must have a Social Insurance Number (SIN) before you can start working in Canada. You can apply for a SIN at a Service Canada office with your study permit that authorizes work.',
                consequences: 'Working without a valid SIN is illegal. Employers are required to verify your SIN before paying you. Working without a SIN can result in penalties and affect your immigration status.',
                verifiedAt: new Date('2026-01-12'),
                sources: [{
                    name: 'Social Insurance Number for International Students',
                    url: 'https://www.canada.ca/en/employment-social-development/services/sin/apply.html',
                    authority: 'Service Canada',
                    accessedAt: new Date('2026-01-12'),
                }],
            },
        },
        {
            slug: 'can-i-apply-for-pgwp',
            title: 'Can I apply for a Post-Graduation Work Permit (PGWP)?',
            category: 'Graduation',
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'You may be eligible for a PGWP if you graduated from an eligible DLI, completed a program of at least 8 months, maintained full-time status during your studies, and apply within 180 days of receiving written confirmation of completing your program.',
                consequences: 'If you do not meet the eligibility requirements or miss the 180-day deadline, you will not be able to obtain a PGWP. This could affect your ability to gain Canadian work experience needed for permanent residence applications.',
                verifiedAt: new Date('2026-01-12'),
                sources: [{
                    name: 'Post-Graduation Work Permit eligibility',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-12'),
                }],
            },
        },
    ];

    for (const q of questions) {
        await prisma.question.create({
            data: {
                slug: q.slug,
                title: q.title,
                category: q.category,
                answer: {
                    create: {
                        allowed: q.answer.allowed,
                        conditions: q.answer.conditions,
                        consequences: q.answer.consequences,
                        verifiedAt: q.answer.verifiedAt,
                        sources: {
                            create: q.answer.sources,
                        },
                    },
                },
            },
        });
    }

    console.log(`✅ Created ${questions.length} sample questions`);

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

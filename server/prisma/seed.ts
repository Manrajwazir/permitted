import { PrismaClient, ContextType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing context data
    await prisma.questionContext.deleteMany();
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

    // Seed a sample question for testing
    const sampleQuestion = await prisma.question.create({
        data: {
            slug: 'can-i-work-off-campus',
            title: 'Can I work off-campus while studying?',
            category: 'Work Rules',
            answer: {
                create: {
                    allowed: 'DEPENDS',
                    conditions: 'You can work off-campus up to 20 hours per week during regular academic sessions if you have a valid study permit that allows off-campus work, you are enrolled full-time at a designated learning institution (DLI), and you are studying in a program that is at least 6 months long and leads to a degree, diploma, or certificate.',
                    consequences: 'Working more than 20 hours per week (except during scheduled breaks) or working without authorization can result in: loss of student status, denial of future study or work permits, removal order from Canada, and impact on future immigration applications.',
                    verifiedAt: new Date('2026-01-07'),
                    sources: {
                        create: [
                            {
                                name: 'Work off campus as an international student',
                                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html',
                                authority: 'IRCC',
                                accessedAt: new Date('2026-01-07'),
                            },
                        ],
                    },
                },
            },
        },
    });

    console.log(`✅ Created sample question: ${sampleQuestion.title}`);

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

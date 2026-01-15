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
    // SAMPLE QUESTIONS WITH CONTEXT LINKS
    // ============================================

    // Get all context records to link to questions
    const contextRecords = await prisma.context.findMany();
    const getContextId = (value: string) =>
        contextRecords.find(c => c.value === value)?.id;

    // All provinces (federal rules apply everywhere)
    const ALL_PROVINCES = ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'NT', 'YT', 'NU'];
    // Standard programs (not language programs for work-related questions)
    const STANDARD_PROGRAMS = ['COLLEGE_DIPLOMA', 'UNDERGRADUATE', 'MASTERS', 'PHD'];
    const ALL_PROGRAMS = ['COLLEGE_DIPLOMA', 'UNDERGRADUATE', 'MASTERS', 'PHD', 'LANGUAGE_PROGRAM'];

    const questions = [
        {
            slug: 'can-i-work-off-campus',
            title: 'Can I work off-campus while studying?',
            category: 'Work Rules',
            // Applies to: All students currently studying, all provinces, standard programs
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
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
            // Applies to: All students, all provinces, all programs
            contextValues: ['STUDYING', 'GRADUATING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
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
            // Applies to: Students currently studying, all provinces, all programs
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
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
            // Applies to: All students who want to work, all provinces, standard programs
            contextValues: ['STUDYING', 'GRADUATING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
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
            // Applies to: Graduating students, all provinces, standard programs (not language programs)
            contextValues: ['GRADUATING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
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
        // ============================================
        // ADDITIONAL QUESTIONS (30 more)
        // ============================================
        {
            slug: 'can-i-work-on-campus',
            title: 'Can I work on campus without a work permit?',
            category: 'Work Rules',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'You can work on campus without a work permit if you have a valid study permit and are enrolled full-time at the institution where you work. On-campus work includes working for the institution itself, a faculty member, a student organization, or a private contractor providing services on campus.',
                consequences: 'If you work on campus while not maintaining full-time student status or after your study permit expires, you could lose your status and face removal from Canada.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Work on campus',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-on-campus.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-work-full-time-during-breaks',
            title: 'Can I work full-time during school breaks?',
            category: 'Work Rules',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'You can work full-time (more than 20 hours per week) during scheduled breaks such as winter and summer holidays, spring break, or any other scheduled break in the academic calendar, as long as you are a full-time student before and after the break.',
                consequences: 'Working full-time during regular academic sessions (not scheduled breaks) can result in loss of student status and future immigration complications.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Working during scheduled breaks',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-do-coop-internship',
            title: 'Can I do a co-op or internship?',
            category: 'Work Rules',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'You need a co-op or intern work permit if your program requires work experience to graduate. You must have a valid study permit, a letter from your school confirming the work is required, and the work term must be 50% or less of your total program.',
                consequences: 'Working in a co-op or internship without the proper work permit can jeopardize your immigration status and may result in denial of future permits.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Co-op and intern work permits',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/intern.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-spouse-work-in-canada',
            title: 'Can my spouse work in Canada?',
            category: 'Work Rules',
            contextValues: ['STUDYING', ...ALL_PROVINCES, 'MASTERS', 'PHD'],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'Your spouse or common-law partner may be eligible for an open work permit if you are studying full-time at a university or college in a program of 8 months or longer. This is available for spouses of students in degrees or professional programs at eligible institutions.',
                consequences: 'If your spouse works without authorization, they could be removed from Canada and barred from re-entry. Your own status could also be affected.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Work permits for spouses',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/help-your-spouse-common-law-partner-work-canada.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'do-i-need-to-file-taxes',
            title: 'Do I need to file income taxes in Canada?',
            category: 'Tax',
            contextValues: ['STUDYING', 'GRADUATING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'If you earned income in Canada (including scholarships, employment income, or TA/RA positions), you are required to file a tax return. Even if you did not earn income, filing can help you claim GST/HST credits and tuition credits.',
                consequences: 'Failure to file taxes can result in penalties and interest on any amount owed. It can also affect your eligibility for certain benefits and may complicate future immigration applications.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'International students and income tax',
                    url: 'https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/international-students-studying-canada.html',
                    authority: 'CRA',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-claim-tuition-tax-credits',
            title: 'Can I claim tuition tax credits?',
            category: 'Tax',
            contextValues: ['STUDYING', 'GRADUATING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'You can claim tuition paid to a qualifying educational institution in Canada. You must receive a T2202 form from your school. Unused credits can be carried forward to future years or transferred to a spouse, parent, or grandparent.',
                consequences: 'Not claiming tuition credits means losing out on potential tax savings. You cannot claim credits retroactively beyond certain limits.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Tuition tax credit',
                    url: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-32300-tuition-education-textbook-amounts.html',
                    authority: 'CRA',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-get-health-insurance',
            title: 'Am I eligible for provincial health insurance?',
            category: 'Healthcare',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'Eligibility varies by province. In some provinces (BC, Alberta, Saskatchewan, Manitoba), international students are eligible for provincial health coverage. In Ontario and Quebec, students must have private health insurance. Check your specific province.',
                consequences: 'Not having health insurance can result in significant out-of-pocket medical expenses. Some schools require proof of coverage for enrollment.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Health insurance for international students',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare-arrival.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-extend-study-permit',
            title: 'Can I extend my study permit?',
            category: 'Study Status',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'You can apply to extend your study permit if you need more time to complete your studies. Apply at least 30 days before your current permit expires. You must still be enrolled at a DLI and continue to meet all requirements.',
                consequences: 'If your permit expires before you apply for extension, you lose your status. You may need to apply for restoration of status, which has additional fees and requirements.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Extend your study permit',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/extend-study-permit.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-take-time-off-studies',
            title: 'Can I take a semester off from my studies?',
            category: 'Study Status',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'You can take an authorized leave from your program for up to 150 days without affecting your study permit. The leave must be authorized by your school. Medical or compassionate reasons may be accepted.',
                consequences: 'Unauthorized leaves or leaves longer than 150 days can result in your study permit becoming invalid. You may need to apply for a new study permit from outside Canada.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Taking time off studies',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/while-you-study/study-permit-conditions.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-study-part-time',
            title: 'Can I study part-time on a study permit?',
            category: 'Study Status',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'You can study part-time only in your final semester if you need fewer courses to complete your program. Otherwise, you must remain a full-time student as a condition of your study permit.',
                consequences: 'Studying part-time without authorization (except in final semester) violates your study permit conditions and can result in loss of status.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Study permit conditions',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/while-you-study/study-permit-conditions.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-bring-family-to-canada',
            title: 'Can I bring my family to Canada?',
            category: 'Travel',
            contextValues: ['PRE_ARRIVAL', 'STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'Your spouse and dependent children can apply to come to Canada with you. Your spouse may be eligible for an open work permit (if you are in certain programs), and children can attend school. They need their own visitor or study permits.',
                consequences: 'Family members who stay beyond their authorized period or work without authorization can face removal and future entry bans.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Bring your family to Canada',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/bring-family.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'do-i-need-visa-to-reenter',
            title: 'Do I need a visa or eTA to re-enter Canada?',
            category: 'Travel',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'Whether you need a visa or eTA depends on your country of citizenship. Visa-required nationals need a valid visitor visa to re-enter Canada. Visa-exempt nationals need an eTA when flying to Canada. Check the IRCC website for your specific country.',
                consequences: 'Attempting to return to Canada without the proper visa or eTA will result in denied boarding or denied entry at the border.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Find out if you need a visa or eTA',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/entry-requirements-country.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-visit-usa-with-study-permit',
            title: 'Can I visit the USA with my Canadian study permit?',
            category: 'Travel',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'Your Canadian study permit does not allow entry to the USA. You need a valid US visa (B1/B2) or may qualify for the Visa Waiver Program (ESTA) if you are from an eligible country. Check US visa requirements separately.',
                consequences: 'Attempting to enter the USA without proper authorization will result in denied entry and may affect your future visa applications to both the USA and Canada.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Travel to the United States',
                    url: 'https://travel.state.gov/content/travel/en/us-visas.html',
                    authority: 'US Department of State',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'what-is-biometrics',
            title: 'Do I need to give biometrics for my study permit?',
            category: 'Study Status',
            contextValues: ['PRE_ARRIVAL', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'Most study permit applicants must provide biometrics (fingerprints and photo) as part of their application. This is usually done at a Visa Application Centre. Biometrics are valid for 10 years.',
                consequences: 'Your application will not be processed until biometrics are provided. Failure to provide biometrics will result in your application being refused.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Biometrics for study permits',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/campaigns/biometrics/facts.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-open-bank-account',
            title: 'Can I open a bank account in Canada?',
            category: 'Financial',
            contextValues: ['PRE_ARRIVAL', 'STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'You can open a bank account with just your study permit and passport at most Canadian banks. Some banks allow you to start the process online before arriving in Canada.',
                consequences: 'No immigration consequences for banking. However, you must report foreign bank accounts to the CRA if they exceed certain thresholds.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Banking in Canada',
                    url: 'https://www.canada.ca/en/financial-consumer-agency/services/banking/opening-bank-account.html',
                    authority: 'Government of Canada',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-get-drivers-license',
            title: "Can I get a driver's license in Canada?",
            category: 'Provincial Services',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: "International students can get a driver's license in most provinces. Requirements vary by province. You typically need your study permit, passport, proof of address, and may need to pass written and road tests.",
                consequences: 'Driving without a valid license is illegal and can result in fines, vehicle impoundment, and potential immigration consequences if convicted of a crime.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Provincial driver licensing',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/new-life-canada/driving.html',
                    authority: 'Government of Canada',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-apply-for-pr',
            title: 'Can I apply for permanent residence while studying?',
            category: 'Immigration',
            contextValues: ['STUDYING', 'GRADUATING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'You can apply for permanent residence through various programs like Express Entry (if you have work experience), Provincial Nominee Programs, or the Canadian Experience Class (after obtaining Canadian work experience via PGWP).',
                consequences: 'Applying for PR does not affect your study permit status. However, you must maintain valid status while your PR application is being processed.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Pathways to permanent residence',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-start-business',
            title: 'Can I start a business in Canada as a student?',
            category: 'Work Rules',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'You can start a business, but you cannot work for your own business if it would violate your off-campus work restrictions. Self-employment counts toward your 20 hours per week limit during academic sessions.',
                consequences: 'Operating a business that requires more than 20 hours per week during studies, or working without authorization, can result in loss of student status.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Self-employment for students',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'what-if-study-permit-expires',
            title: 'What happens if my study permit expires?',
            category: 'Study Status',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'NO' as const,
                conditions: 'If your study permit expires, you must stop studying and stop working. You have 90 days to apply for restoration of status. After 90 days, you must leave Canada and apply from outside.',
                consequences: 'Remaining in Canada without valid status makes you inadmissible. You cannot study, work, or extend your stay. Future immigration applications may be affected.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Restore your status',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/extend-study-permit/restore-status.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-volunteer',
            title: 'Can I volunteer in Canada?',
            category: 'Work Rules',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'You can volunteer for charitable organizations without a work permit. The activity must be truly voluntary (unpaid), benefit a charitable/religious/community organization, and be something typically done by volunteers.',
                consequences: 'If your "volunteering" is actually unpaid work that would normally be paid employment, it could be considered unauthorized work.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Volunteering in Canada',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers/what-is-work.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-get-study-permit-inside-canada',
            title: 'Can I apply for a study permit from inside Canada?',
            category: 'Study Status',
            contextValues: ['PRE_ARRIVAL', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'You can apply from inside Canada if you currently hold a valid study permit, work permit, or temporary resident permit, or if you are a minor child in Canada, or if you are a refugee.',
                consequences: 'Applying from inside Canada when not eligible will result in refusal. Most first-time study permit applicants must apply from outside Canada.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Apply from inside Canada',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'what-is-dli',
            title: 'What is a Designated Learning Institution (DLI)?',
            category: 'Study Status',
            contextValues: ['PRE_ARRIVAL', 'STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'A DLI is a school approved by a provincial or territorial government to host international students. You can only study at a DLI with a study permit. Check the DLI list on the IRCC website before applying.',
                consequences: 'Studying at a non-DLI institution with a study permit is a violation of your permit conditions and can result in loss of status.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Designated learning institutions list',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-work-after-graduation',
            title: 'Can I work in Canada after graduation?',
            category: 'Graduation',
            contextValues: ['GRADUATING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'You can work after graduation if you obtain a Post-Graduation Work Permit (PGWP). You must apply within 180 days of completing your program. The PGWP length depends on your program length.',
                consequences: 'Working after graduation without a valid work permit is unauthorized work and can result in removal from Canada and bans on future entry.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Post-Graduation Work Permit',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'how-long-is-pgwp-valid',
            title: 'How long is a PGWP valid?',
            category: 'Graduation',
            contextValues: ['GRADUATING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'PGWP length depends on your program: Programs of 8 months to 2 years get a PGWP equal to program length. Programs of 2+ years get a 3-year PGWP. You can only get one PGWP in your lifetime.',
                consequences: 'Once your PGWP expires, you must have another valid status (PR, work permit, etc.) to remain in Canada. There is no extension of PGWP.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'PGWP validity',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-transfer-schools',
            title: 'Can I transfer to a different school?',
            category: 'Study Status',
            contextValues: ['STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'You can transfer between DLIs. Update your information in the IRCC portal within 10 days of changing schools. Your new school must also be a DLI.',
                consequences: 'Failure to report school changes can affect your status. Transferring to a non-DLI is not allowed and can result in loss of status.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Changing schools',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/change-schools.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-get-refund-if-study-permit-refused',
            title: 'Can I get a tuition refund if my study permit is refused?',
            category: 'Financial',
            contextValues: ['PRE_ARRIVAL', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: `Most Canadian schools have refund policies for students whose study permits are refused. Check your school's specific refund policy. You typically need to provide the refusal letter and request a refund within a specific timeframe.`,
                consequences: 'Not requesting a refund in time may result in losing your tuition deposit. Each school has different policies.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Check with your school',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'do-i-need-letter-of-acceptance',
            title: 'Do I need a Letter of Acceptance to get a study permit?',
            category: 'Study Status',
            contextValues: ['PRE_ARRIVAL', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'You must have a Letter of Acceptance (LOA) from a DLI before you can apply for a study permit. The LOA confirms your enrollment in a specific program and is required for your application.',
                consequences: 'Your study permit application will be refused without a valid LOA from a DLI.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Study permit requirements',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-work-while-waiting-for-pgwp',
            title: 'Can I work while waiting for my PGWP?',
            category: 'Graduation',
            contextValues: ['GRADUATING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'If you applied for a PGWP before your study permit expired and have a valid job offer, you can start working full-time while waiting for your PGWP decision. You need proof of your PGWP application.',
                consequences: 'If your PGWP is refused, you must stop working immediately. Working without eventually receiving authorization can complicate future applications.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Working while waiting for PGWP',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-rent-apartment',
            title: 'Can I rent an apartment as an international student?',
            category: 'Housing',
            contextValues: ['PRE_ARRIVAL', 'STUDYING', ...ALL_PROVINCES, ...ALL_PROGRAMS],
            answer: {
                allowed: 'YES' as const,
                conditions: 'You can rent an apartment with your study permit. Landlords may request proof of income, references, or a co-signer. You may need to provide first and last month\'s rent upfront.',
                consequences: 'No immigration consequences for renting. However, breaking a lease can affect your credit score and ability to rent in the future.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Renting in Canada',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/new-life-canada/housing/renting.html',
                    authority: 'Government of Canada',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
        {
            slug: 'can-i-apply-express-entry',
            title: 'Can I apply for Express Entry while on a study permit?',
            category: 'Immigration',
            contextValues: ['STUDYING', 'GRADUATING', ...ALL_PROVINCES, ...STANDARD_PROGRAMS],
            answer: {
                allowed: 'DEPENDS' as const,
                conditions: 'You can create an Express Entry profile while studying, but you need to meet minimum requirements (work experience, language scores, education). Canadian education gives you additional CRS points. Having a PGWP and work experience significantly improves your chances.',
                consequences: 'Creating a profile does not affect your student status. However, if invited but unable to provide required documents, your application could be refused.',
                verifiedAt: new Date('2026-01-15'),
                sources: [{
                    name: 'Express Entry',
                    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html',
                    authority: 'IRCC',
                    accessedAt: new Date('2026-01-15'),
                }],
            },
        },
    ];

    for (const q of questions) {
        // Create the question
        const createdQuestion = await prisma.question.create({
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

        // Link question to contexts
        for (const contextValue of q.contextValues) {
            const contextId = getContextId(contextValue);
            if (contextId) {
                await prisma.questionContext.create({
                    data: {
                        questionId: createdQuestion.id,
                        contextId: contextId,
                    },
                });
            }
        }
    }

    console.log(`✅ Created ${questions.length} sample questions with context links`);

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


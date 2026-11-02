# Course treatment manifest

Status of the course-treatment skill across courses. "Treated" means both motivator banners are present (the only automatically checkable marker); reading level, story, voice and action-form passes are not verified here.

Last audited: 2026-10-18 (money-budgeting v2 table added; v1 component lists last audited 2026-10-15). Re-audit: `for f in components/*Course*.jsx; do grep -q '<Motivator' "$f" || echo "$f"; done`

When a course is treated, move it from Untreated to Treated and add the before/after readability scores.

## Untreated — standalone components

- [ ] `components/ApplyWithoutScamsCourse.jsx`
- [ ] `components/ApprenticeshipFundingCourse.jsx`
- [ ] `components/BeginnerFitnessForMenCourse.jsx`
- [ ] `components/BeginnerFitnessForWomenCourse.jsx`
- [ ] `components/BodyweightTrainingCourse.jsx`
- [ ] `components/CanadaPensionPlanCourse.jsx`
- [ ] `components/CanadianPaychequeCourse.jsx`
- [ ] `components/CanadianRetirementPlanningCourse.jsx`
- [ ] `components/CompoundGrowthCourse.jsx`
- [ ] `components/CoreStrengthCourse.jsx`
- [ ] `components/CppDisabilityBenefitsCourse.jsx`
- [ ] `components/DentalCareBenefitsCourse.jsx`
- [ ] `components/EmploymentInsuranceCourse.jsx`
- [ ] `components/EnergyEfficiencyRebatesCourse.jsx`
- [ ] `components/EstateAndBeneficiaryBasicsCourse.jsx`
- [ ] `components/ETFsMutualFundsCourse.jsx`
- [ ] `components/FatLossFundamentalsCourse.jsx`
- [ ] `components/FHSABasicsCourse.jsx`
- [ ] `components/FilingIncomeTaxReturnCourse.jsx`
- [ ] `components/FirstTimeHomeBuyerCourse.jsx`
- [ ] `components/FitnessOver40Course.jsx`
- [ ] `components/FitnessOver50Course.jsx`
- [ ] `components/FlexibilityCourse.jsx`
- [ ] `components/GettingYourFirstCustomerCourse.jsx`
- [ ] `components/GstHstForSmallBusinessesCourse.jsx`
- [ ] `components/GuaranteedIncomeSupplementCourse.jsx`
- [ ] `components/GymFundamentalsCourse.jsx`
- [ ] `components/HomeWorkoutsCourse.jsx`
- [ ] `components/IndigenousBenefitsCourse.jsx`
- [ ] `components/InvestmentFeesCourse.jsx`
- [ ] `components/KeepingCraRecordsCourse.jsx`
- [ ] `components/LowImpactFitnessCourse.jsx`
- [ ] `components/MarginalTaxRatesCourse.jsx`
- [ ] `components/MarketplaceFlippingCourse.jsx`
- [ ] `components/MissedTaxCreditsCourse.jsx`
- [ ] `components/MobilityCourse.jsx`
- [ ] `components/MuscleBuildingCourse.jsx`
- [ ] `components/NewcomerSettlementCourse.jsx`
- [ ] `components/OnlineTutoringCourse.jsx`
- [ ] `components/PrescriptionAssistanceCourse.jsx`
- [ ] `components/ProvincialBenefitFindersCourse.jsx`
- [ ] `components/ProvincialDisabilityProgramsCourse.jsx`
- [ ] `components/ProvincialIncomeSupportCourse.jsx`
- [ ] `components/RDSPBasicsCourse.jsx`
- [ ] `components/RentAssistanceCourse.jsx`
- [ ] `components/ResellingProductsCourse.jsx`
- [ ] `components/ResistanceBandTrainingCourse.jsx`
- [ ] `components/RESPBasicsCourse.jsx`
- [ ] `components/RiskToleranceCourse.jsx`
- [ ] `components/RRIFBasicsCourse.jsx`
- [ ] `components/RRSPBasicsCourse.jsx`
- [ ] `components/SelfEmploymentTaxesCourse.jsx`
- [ ] `components/SeniorCompanionServicesCourse.jsx`
- [ ] `components/SeniorHomeRenoCourse.jsx`
- [ ] `components/SmallBusinessGrantsCourse.jsx`
- [ ] `components/StrengthTrainingCourse.jsx`
- [ ] `components/StudentGrantsCourse.jsx`
- [ ] `components/TaxDeductionsCreditsCourse.jsx`
- [ ] `components/TaxFreeVsTaxDeferredCourse.jsx`
- [ ] `components/TFSABasicsCourse.jsx`
- [ ] `components/TrainingGrantsCourse.jsx`
- [ ] `components/UtilityAssistanceCourse.jsx`
- [ ] `components/VeteranBenefitsCourse.jsx`
- [ ] `components/WageSubsidiesCourse.jsx`

## Untreated — Silver side-hustle kinds (shared `MajorMoneyDecisionCourse.jsx`, need `motivator1`/`motivator2` in data)

- [ ] `sideHustle` — `lib/silver-major-money-extra-data.js`
- [ ] `gigWork` — `lib/silver-side-hustle-extra-data.js`
- [ ] `freelancing` — `lib/silver-side-hustle-extra-data.js`
- [ ] `virtualAssistance` — `lib/silver-side-hustle-service-data.js`
- [ ] `cleaning` — `lib/silver-side-hustle-service-data.js`
- [ ] `propertyMaintenance` — `lib/silver-side-hustle-property-data.js`
- [ ] `snowRemoval` — `lib/silver-side-hustle-property-data.js`
- [ ] `lawnCare` — `lib/silver-side-hustle-outdoor-data.js`
- [ ] `mobileDetailing` — `lib/silver-side-hustle-outdoor-data.js`
- [ ] `petServices` — `lib/silver-side-hustle-care-data.js`

## Treated — standalone components

- [x] `components/AutoLoanPrepCourse.jsx`
- [x] `components/BankFeesCourse.jsx`
- [x] `components/BankruptcyReentryCourse.jsx`
- [x] `components/BuildCreditCourse.jsx`
- [x] `components/BureauComparisonCourse.jsx`
- [x] `components/CanadaChildBenefitCourse.jsx`
- [x] `components/CanadaWorkersBenefitCourse.jsx`
- [x] `components/CollectionCallCourse.jsx`
- [x] `components/CollectionsRecoveryCourse.jsx`
- [x] `components/CoupleFinancesCourse.jsx`
- [x] `components/CreditDisputeCourse.jsx`
- [x] `components/CreditInquiryCourse.jsx`
- [x] `components/CreditMissionCourse.jsx`
- [x] `components/CreditReportCourse.jsx`
- [x] `components/CreditUtilizationCourse.jsx`
- [x] `components/DisabilityTaxCreditCourse.jsx`
- [x] `components/DivorceCreditCourse.jsx`
- [x] `components/EmergencyFundCourse.jsx`
- [x] `components/FinancialResetCourse.jsx`
- [x] `components/FraudCommandCourse.jsx`
- [x] `components/GstHstCreditCourse.jsx`
- [x] `components/HighInterestDebtCourse.jsx`
- [x] `components/HouseholdBudgetCourse.jsx`
- [x] `components/InstitutionDebateCourse.jsx`
- [x] `components/InterestDecoderCourse.jsx`
- [x] `components/LimitationClockCourse.jsx`
- [x] `components/MajorPurchaseCourse.jsx`
- [x] `components/MortgagePrepCourse.jsx`
- [x] `components/NewcomerCreditCourse.jsx`
- [x] `components/OldAgeSecurityCourse.jsx`
- [x] `components/OverdraftCourse.jsx`
- [x] `components/PaydayBridgeCourse.jsx`
- [x] `components/PaymentHistoryCourse.jsx`
- [x] `components/PredatoryProductsCourse.jsx`
- [x] `components/ProposalExitCourse.jsx`
- [x] `components/RegisteredDisabilitySavingsPlanCourse.jsx`
- [x] `components/RepaymentTournamentCourse.jsx`
- [x] `components/SecuredCardCourse.jsx`
- [x] `components/SinglePageCourse.jsx`
- [x] `components/SingleParentCourse.jsx`
- [x] `components/VariableIncomeCourse.jsx`

## Treated — Silver Major Money Decision kinds

- [x] `vehicle`
- [x] `home`
- [x] `rental`
- [x] `insurance`
- [x] `fraud`

## v2 lesson-JSON rollout (`content/credit-NN-lesson.json`)

Banners (`transition` blocks) were already present on all 20 credit-mastery lessons. This table tracks the full five-part treatment. Measure with `node scripts/readability.js credit-NN --breakdown --tells`.

| Lesson | Course | Treatment | Teaching grade (before → after) | Story grade (before → after) |
|---|---|---|---|---|
| credit-11 | Rebuilding Credit After Collections | done 2026-10-15 | 9.92 → 6.52 | 10.09 → 3.88 |
| credit-12 | Rebuilding Credit After Bankruptcy | done 2026-10-15 | 9.28 → 6.83 | 8.67 → 3.69 |
| credit-13 | Rebuilding Credit After a Consumer Proposal | done 2026-10-15 | 9.62 → 7.49 | 11.09 → 5.25 |
| credit-14 | Dealing With Canadian Collection Agencies | done 2026-10-15 | 9.39 → 7.22 | 8.95 → 4.30 |
| credit-15 | Statutes of Limitation by Province | done 2026-10-15 | 9.56 → 7.39 | 11.51 → 6.00 |
| credit-16 | Identity Theft and Credit Fraud | done 2026-10-15 | 10.11 → 7.55 | 9.87 → 5.86 |
| credit-17 | Preparing for a Mortgage | done 2026-10-15 | 9.08 → 7.07 | 9.59 → 5.21 |
| credit-18 | Preparing for an Auto Loan | done 2026-10-15 | 8.88 → 6.48 | 10.05 → 5.95 |
| credit-19 | Credit Building for Newcomers | done 2026-10-15 | 10.59 → 8.25 | 11.58 → 6.68 |
| credit-20 | Credit Building After Divorce | done 2026-10-15 | 11.50 → 8.20 | 9.50 → 5.81 |

## v2 money-budgeting rollout (`content/money-NN-lesson.json`)

Audited 2026-10-18 with `node scripts/readability.js money-NN --tells`. All 20 lessons carry both banners. Treated means the five-part pass is done: teaching grade about 8.3 or lower, a story with a real decision beat, no outcomes list, voice tells cleared, and a 6-question fill-out form with samples. Em dashes in table rows are data, not prose.

| Lesson | Course | Treatment | Teaching grade | Story grade |
|---|---|---|---|---|
| money-01 | Building a Canadian Household Budget | done (uncommitted) | 7.52 | 6.64 |
| money-02 | Managing Money Between Paydays | done (uncommitted) | 7.74 | 6.03 |
| money-03 | Emergency Funds | done 2026-10-18 (uncommitted) | 9.26 → 7.93 | 7.01 → 5.64 |
| money-04 | Canadian Bank Accounts and Fees | done 2026-10-18 (uncommitted) | 9.53 → 7.99 | 6.18 → 5.48 |
| money-05 | Credit Unions Versus Banks | done 2026-10-18 (uncommitted) | 10.34 → 8.22 | 8.23 → 6.48 |
| money-06 | Managing Overdraft | done 2026-10-18 (uncommitted) | 9.46 → 7.69 | 9.11 → 6.42 |
| money-07 | Understanding Interest and APR | done 2026-10-18 (uncommitted) | 8.39 → 7.27 | 7.78 → 5.83 |
| money-08 | Paying Down High-Interest Debt | done (verified 2026-10-18) | 7.64 | 5.84 |
| money-09 | Snowball Versus Avalanche Debt Repayment | done (verified 2026-10-18; blocks and images applied 2026-10-19) | 7.36 | 6.58 |
| money-10 | Managing Variable Income | done (verified 2026-10-18) | 8.28 | 6.38 |
| money-11 | Managing Finances as a Couple | done 2026-10-18 (uncommitted) | 8.50 → 8.14 | 6.68 → 6.49 |
| money-12 | Financial Planning for Single Parents | done 2026-10-18 (uncommitted) | 8.65 → 8.31 | 7.25 → 6.60 |
| money-13 | Avoiding Predatory Financial Products | done 2026-10-18 (uncommitted) | 10.01 → 8.27 | 8.85 → 6.71 |
| money-14 | Financing Major Purchases | done 2026-10-18 (uncommitted) | 9.69 → 8.33 | 7.78 → 6.17 |
| money-15 | The 30-Day Financial Reset | done 2026-10-18 (uncommitted) | 8.71 → 8.04 | 8.39 → 6.21 |
| money-16 | Buying Versus Leasing | done 2026-10-18 (uncommitted) | 9.68 → 8.29 | 9.29 → 6.38 |
| money-17 | Saving for a Home | done 2026-10-18 (uncommitted) | 10.19 → 8.12 | 10.70 → 6.43 |
| money-18 | Managing Rental Costs | rebuilt 2026-11-02 (Elite: ledger, conversion and payday calculators, stress-test panel, province tiles; 2026 ON/BC rent caps, QC TAL) | 9.81 → 7.00 | 8.92 → 6.32 |
| money-19 | Insurance Basics | rebuilt 2026-11-02 (Elite: coverage-map tiles, deductible break-even panel, income-protection section with EI sickness, complaint routes GIO/OLHI, Assuris/PACICC) | 9.39 → 7.84 | 9.64 → 6.43 |
| money-20 | Financial Fraud and Scams | rebuilt 2026-11-02 (Elite: scam field-guide tiles, CAFC 2025 figures, first-hour file cards, recovery contacts, prevention setup) | 9.19 → 6.32 | 8.37 → 6.06 |

Tally: 20 done, 0 not treated. Grades for money-01, 02, 08, 09 and 10 are current values only; the rest show before → after. Fill-out forms for money-08, 09 and 10 were shortened to 6 questions with sample answers on 2026-10-18 (they had been missed in the first audit). Lessons 16 to 20 also had their outcomes-list (chips) block removed.

**v2 standard:** the "By the end, you will be able to" / "What you will leave with" outcomes list is removed from the start section of every credit lesson (decided 2026-10-15). Other `lists` blocks that carry teaching content stay.

## v2 benefits-support rollout (`content/benefits-NN-lesson.json`)

Completed 2026-10-30. All 30 lessons carry both banners (after section 01 and after the story section), no outcomes list, a six-question fill-out form with sample answers, teaching prose at or below grade 8.3 and stories at or below grade 6. Audit at start: average teaching grade 10.36, 24 of 30 over 8.3, 6 with both banners. Measure with `node scripts/readability.js benefits-NN --breakdown --tells`.

Lessons 21 to 30 use `chips` blocks as teaching checklists ("Your starter file", "Does this apply to me?"); those stay, since only the start-section outcomes list is removed. Em dashes in their two-column comparison cards are column separators, not prose. benefits-13 keeps one flagged filler ("waiting perfectly in the wrong place"), which is the original author's joke.

Six lessons had `ordered` lists corrupted at extraction (each item reduced to its first letter, also broken in `extracted/*.md`): benefits-11, 15, 16, 18, 19 and 20. Each list was rebuilt from its own lesson's content and should be checked by the course owner. The same corruption exists in income-01 to income-04.

| Lesson | Course | Treatment | Teaching grade | Story grade |
|---|---|---|---|---|
| benefits-01 | Canada Child Benefit | done 2026-10-30 (light pass; banners already present) | 7.57 → 7.25 | 7.45 → 4.65 |
| benefits-02 | GST/HST Credit | done 2026-10-30 (light pass) | 6.89 → 6.87 | 4.75 → 4.75 |
| benefits-03 | Canada Workers Benefit | done 2026-10-30 (light pass) | 7.99 → 7.99 | 4.11 → 4.11 |
| benefits-04 | Disability Tax Credit | done 2026-10-30 (light pass; authoring note removed) | 9.22 → 7.33 | 5.40 → 5.40 |
| benefits-05 | Registered Disability Savings Plan | done 2026-10-30 (light pass) | 9.32 → 7.25 | 4.84 → 4.84 |
| benefits-06 | Old Age Security | done 2026-10-30 (light pass) | 8.17 → 8.17 | 6.70 → 5.65 |
| benefits-07 | Guaranteed Income Supplement | done 2026-10-30 | 11.25 → 7.34 | 10.77 → 4.49 |
| benefits-08 | Canada Pension Plan | done 2026-10-30 | 10.97 → 6.07 | 9.86 → 4.69 |
| benefits-09 | CPP Disability Benefits | done 2026-10-30 | 12.62 → 7.51 | 13.43 → 5.54 |
| benefits-10 | Employment Insurance | done 2026-10-30 | 10.57 → 6.16 | 8.25 → 4.41 |
| benefits-11 | Provincial Income Support | done 2026-10-30 (corrupted list rebuilt) | 13.08 → 7.83 | 10.65 → 4.56 |
| benefits-12 | Provincial Disability Programs | done 2026-10-30 | 13.88 → 7.51 | 11.61 → 5.50 |
| benefits-13 | Rent Assistance | done 2026-10-30 | 11.62 → 7.14 | 11.84 → 4.96 |
| benefits-14 | Utility Assistance | done 2026-10-30 | 12.53 → 7.86 | 11.10 → 4.55 |
| benefits-15 | Dental-Care Benefits | done 2026-10-30 (corrupted list rebuilt) | 10.60 → 6.38 | 9.18 → 4.29 |
| benefits-16 | Prescription Assistance | done 2026-10-30 (corrupted list rebuilt) | 12.93 → 7.55 | 12.55 → 5.47 |
| benefits-17 | Student Grants | done 2026-10-30 | 11.12 → 6.94 | 8.74 → 5.06 |
| benefits-18 | Apprenticeship Funding | done 2026-10-30 (corrupted list rebuilt) | 11.54 → 7.46 | 9.09 → 4.40 |
| benefits-19 | Indigenous Benefits and Programs | done 2026-10-30 (corrupted list rebuilt) | 12.78 → 7.51 | 9.94 → 5.80 |
| benefits-20 | Newcomer Settlement Supports | done 2026-10-30 (corrupted list rebuilt) | 13.85 → 7.61 | 12.48 → 5.54 |
| benefits-21 | Veteran Benefits | done 2026-10-30 | 7.69 → 7.50 | 9.14 → 5.38 |
| benefits-22 | Senior Home-Renovation Programs | done 2026-10-30 | 8.14 → 7.70 | 6.89 → 5.64 |
| benefits-23 | Energy-Efficiency Rebates | done 2026-10-30 | 8.73 → 7.33 | 10.04 → 5.27 |
| benefits-24 | Training Grants | done 2026-10-30 | 9.26 → 8.29 | 9.02 → 5.62 |
| benefits-25 | Small-Business Grants | done 2026-10-30 | 9.12 → 7.35 | 11.60 → 5.63 |
| benefits-26 | Wage Subsidies | done 2026-10-30 | 9.09 → 7.88 | 8.52 → 5.16 |
| benefits-27 | First-Time Home Buyer Programs | done 2026-10-30 | 8.91 → 7.22 | 11.42 → 5.65 |
| benefits-28 | Tax Credits People Commonly Miss | done 2026-10-30 | 11.49 → 8.24 | 11.39 → 5.41 |
| benefits-29 | Provincial Benefit Finders | done 2026-10-30 | 10.15 → 7.45 | 11.33 → 5.24 |
| benefits-30 | How to Apply Without Getting Scammed | done 2026-10-30 | 9.75 → 7.49 | 10.93 → 5.44 |

Health was the last untreated course. Credit and money were treated earlier under older rules; see their sections for remaining gaps.

## v2 income-business rollout (`content/income-NN-lesson.json`)

Completed 2026-10-30. All 20 lessons carry both banners (after section 01 and after the story section), no outcomes list, a six-question fill-out form with sample answers, teaching prose at or below grade 8.3 and stories at or below grade 6.2. Lessons 06 to 20 used a newer layout: the first banner sat in section 02 and the glossary ended with a "Next up: Module x.y" label; the banner now closes section 01, the label names the next lesson, and every "Section NN" pointer was checked against the real section order.

Beyond the rewrite, each lesson was checked for accuracy and given added depth, most in the higher tiers. Figures were checked against official sources on 2026-10-30: Corporations Canada ($200 online incorporation, annual return within 60 days after the anniversary, $12 online), CRA (T2 due six months after year-end, balance due two months or three for qualifying CCPCs; 9% federal small business rate on the first $500,000; GST/HST small supplier $30,000 in a quarter or over four quarters, register within 29 days; instalments over $3,000, $1,800 in Quebec; ITC receipt tiers $100 and $500; records kept six years in Canada), Ontario ($60 business name registration, five years), Technical Safety BC (licence to be hired for electrical work, permit for EV chargers) and the Competition Bureau (drip pricing; Sirius XM $3.3 million settlement). Re-check these before each review.

The corrupted `ordered` lists in income-01 to 04 were rebuilt from each lesson's own content and should be checked by the course owner.

| Lesson | Course | Treatment | Teaching grade | Story grade |
|---|---|---|---|---|
| income-01 | Senior Companion Services | done 2026-10-30 (corrupted price list rebuilt; insurance and bonding; tax basics) | 12.03 → 8.00 | 9.41 → 5.65 |
| income-02 | Online Tutoring | done 2026-10-30 (corrupted list rebuilt; CASL consent; tax basics) | 10.81 → 7.92 | 9.54 → 5.16 |
| income-03 | Reselling Products | done 2026-10-30 (corrupted list rebuilt; personal vs business sales, platform reporting; tax basics) | 10.05 → 7.06 | 9.23 → 4.52 |
| income-04 | Marketplace Flipping | done 2026-10-30 (corrupted list rebuilt; personal vs business sales; tax basics) | 9.93 → 7.20 | 8.31 → 4.81 |
| income-05 | Getting Your First Customer | done 2026-10-30 (invoice and confirmation spotlight; tax basics) | 11.12 → 8.10 | 9.85 → 5.91 |
| income-06 | Digital Products | done 2026-10-30 (new-format cleanup) | 7.98 → 7.76 | 5.87 → 5.83 |
| income-07 | Affiliate Marketing | done 2026-10-30 (GST card corrected (single-quarter test, foreign commissions)) | 7.93 → 7.87 | 5.41 → 5.41 |
| income-08 | Print on Demand | done 2026-10-30 (platform reporting spotlight) | 6.69 → 6.71 | 4.73 → 4.71 |
| income-09 | Ecommerce | done 2026-10-30 (Quebec French-language and platform spotlights) | 7.13 → 7.14 | 4.68 → 4.68 |
| income-10 | AI-Assisted Businesses | done 2026-10-30 (tool terms (ownership, training); GST card corrected) | 8.33 → 6.96 | 4.06 → 4.06 |
| income-11 | Social-Media Management | done 2026-10-30 (pilot pricing and written-agreement cards) | 9.06 → 6.43 | 8.01 → 5.68 |
| income-12 | Local Lead Generation | done 2026-10-30 (pay models and tax cards; CASL published-address conditions) | 8.32 → 6.24 | 7.47 → 5.53 |
| income-13 | Starting a Small Corporation | done 2026-10-30 (federal fees and deadlines cards ($200 filing, annual return, T2 and balance-due dates)) | 10.24 → 7.89 | 8.37 → 6.17 |
| income-14 | Sole Proprietor Versus Corporation | done 2026-10-30 (side-by-side cards: tax on profit, CPP, early losses, upkeep) | 8.84 → 7.30 | 8.16 → 5.50 |
| income-15 | Canadian Business Registration | done 2026-10-30 (sales tax layer cards; Ontario $60 five-year name registration) | 9.94 → 7.50 | 8.44 → 5.95 |
| income-16 | Basic Bookkeeping | done 2026-10-30 (owner draws and home office cards; cloud backup note) | 7.85 → 6.12 | 4.64 → 4.64 |
| income-17 | GST/HST | done 2026-10-30 (HST rate card; story ITC timing corrected) | 6.62 → 5.73 | 5.27 → 4.40 |
| income-18 | Pricing Services | done 2026-10-30 (unpaid time off and CPP spotlight; deposits) | 6.50 → 5.44 | 5.35 → 4.60 |
| income-19 | Building Recurring Revenue | done 2026-10-30 (MRR and churn worked example; prepaid reserve) | 8.27 → 7.06 | 5.80 → 4.96 |
| income-20 | Moving From Side Hustle to Business | done 2026-10-30 (trade licence spotlight (Technical Safety BC); before-you-cut-hours cards) | 8.06 → 7.19 | 5.61 → 6.09 |

## v2 tax-wealth rollout (`content/tax-NN-lesson.json`)

Completed 2026-10-30. All 20 lessons carry both banners (after section 01 and after the story section), no outcomes list, a six-question fill-out form with sample answers, teaching prose at or below grade 8.3 and stories at or below grade 6.5, each rebuilt with a decision beat. Lessons 01 to 15 keep their story near the end, so the second banner points to Your Action; lessons 16 to 20 keep the story mid-lesson. tax-01 reads at grade 4.0, which is the original author's short, punchy voice, left as is.

Two-column tables from extraction were broken in lessons 01 to 15 (column labels swapped, values blank, such as "Income on this shelf: 14% — Rate on this shelf:"). They were rebuilt as `glasspanel` rate panels or plain comparison cards. Em dashes inside glasspanel items are the figure separator the renderer splits on.

Checklist `chips` and `ordered` items without detail render only their `title`; edits must go there. A save-time guard in the treatment helper now moves `text` into `title` for chips.

Figures checked against official sources on 2026-10-30: CRA 2026 payroll (CPP 5.95% to $74,600, CPP2 4% to $85,000, EI 1.63% to $68,900), federal brackets ($58,523 / $117,045 / $181,440 / $258,482) and BPA $16,452; TFSA $7,000 ($109,000 total); RRSP $33,810; CRA TFSA room updates once a year; OAS recovery threshold $95,323 for 2026; DTC $10,341 and Canada Disability Benefit $204.20/month (July 2026 to June 2027); RDSP qualifying family member rule ends December 31, 2026; Canada Learning Bond $500 + $100/year to $2,000, apply to age 20; SimpleFile; CSA total cost reporting from the 2026 year. Re-check these before each review.

| Lesson | Course | Treatment | Teaching grade | Story grade |
|---|---|---|---|---|
| tax-01 | Understanding a Canadian Paycheque | done 2026-10-30 (CPP described as a pension, not savings; EI employer share 1.4x; clawback note; deductions panel rebuilt) | 4.74 → 3.99 | 4.61 → 4.89 |
| tax-02 | Marginal Tax Rates | done 2026-10-30 (bracket panel rebuilt; taxable income vs salary; income-tested benefit clawbacks) | 5.46 → 4.98 | 5.51 → 5.17 |
| tax-03 | Filing an Income-Tax Return | done 2026-10-30 (SimpleFile; payment arrangements; ten-year change window) | 6.47 → 5.72 | 6.14 → 5.26 |
| tax-04 | Common Tax Deductions and Credits | done 2026-10-30 (credit math exact (14%); FHSA deduction and home buyers’ amount; RRSP carry-forward story) | 8.24 → 6.12 | 8.38 → 5.02 |
| tax-05 | TFSA Basics | done 2026-10-30 (CRA account TFSA room lags a year (corrected); U.S. dividends and trading; spousal beneficiary; Quebec) | 7.04 → 5.26 | 9.89 → 5.08 |
| tax-06 | RRSP Basics | done 2026-10-30 (early-withdrawal withholding and lost room; $2,000 buffer; age-71 end date; per-dollar saving no longer overstated) | 7.02 → 5.29 | 7.03 → 5.29 |
| tax-07 | FHSA Basics | done 2026-10-30 (qualifying-withdrawal conditions; calendar-year room; story carry-forward math) | 7.39 → 5.34 | 9.76 → 4.73 |
| tax-08 | RESP Basics | done 2026-10-30 (story arithmetic fixed; grant ends at 17 rule; exact Learning Bond; accumulated-income tax) | 8.29 → 6.21 | 8.73 → 5.73 |
| tax-09 | RDSP Basics | done 2026-10-30 (grant/bond rates and catch-up; DTC gateway (CDB $204.20/month); qualifying family member ends 2026; unverified stat removed) | 9.56 → 7.06 | 7.49 → 5.67 |
| tax-10 | RRIF Basics | done 2026-10-30 (OAS threshold corrected to $95,323; RRIF minimum panel; withholding only above minimum) | 7.99 → 6.16 | 9.15 → 5.24 |
| tax-11 | Tax-Free Versus Tax-Deferred Growth | done 2026-10-30 (garbled table rebuilt; emergency-fund step; benefit effects of RRSP/RRIF income) | 6.91 → 5.53 | 8.07 → 6.16 |
| tax-12 | Investment Fees | done 2026-10-30 (CRM2 claim corrected (total cost reporting from 2026, first reports 2027); gap math shown; 2022 trailer and DSC bans) | 7.42 → 5.11 | 8.42 → 4.68 |
| tax-13 | ETFs and Mutual Funds | done 2026-10-30 (comparison rebuilt; brokerage fees; story tax and sell-fee checks) | 8.24 → 5.23 | 10.64 → 4.84 |
| tax-14 | Risk Tolerance | done 2026-10-30 (drop ranges by mix incl. 2022 bonds; adviser KYC duty) | 10.20 → 6.93 | 9.22 → 5.46 |
| tax-15 | Compound Growth | done 2026-10-30 (twins story corrected (same-age comparison); tax as third lever; FCAC calculator) | 7.18 → 4.98 | 10.93 → 4.94 |
| tax-16 | Canadian Retirement Planning | done 2026-10-30 (stray mortgage paragraph removed; OAS residency; OAS +10% at 75; timing panel; dental plan) | 10.54 → 7.65 | 8.76 → 5.49 |
| tax-17 | Estate and Beneficiary Basics | done 2026-10-30 (final return dates; deemed disposition; Ontario estate administration tax; Quebec TFSA rule) | 10.93 → 8.02 | 8.36 → 6.46 |
| tax-18 | Self-Employment Taxes | done 2026-10-30 (self-employed CPP panel with worked example; instalment test, dates and reminder safe harbour) | 11.28 → 8.11 | 9.23 → 6.21 |
| tax-19 | GST/HST for Small Businesses | done 2026-10-30 (quarter arithmetic in story; ITC receipt tiers; Quick Method $400,000) | 11.77 → 8.03 | 11.41 → 5.57 |
| tax-20 | Keeping CRA Records | done 2026-10-30 (late-filing retention timing; Canadian copy of cloud records; seven-question form cut to six) | 12.57 → 7.85 | 10.15 → 6.06 |

## v2 health-fitness rollout (`content/health-NN-lesson.json`)

Completed 2026-10-31. All 30 lessons carry both banners (after section 01 and after the story section), no outcomes list, a six-question fill-out form with sample answers, teaching prose at or below grade 8.1 and stories at or below grade 6.7, each rebuilt around a decision the character makes. Lessons 01 to 15 (long format, 12 or 13 sections) had no banners and eight-question forms with no samples; lessons 16 to 30 (newer format) had their first banner in section 02, a "Module 1.x" next-up label and a numbered lead ("Advanced Fitness and Healthy Living · 1.x"), now replaced by a step flow. The same numbered lead was also fixed in income-11 to 15.

health-20 Kickboxing Fitness did not exist: the curriculum listed it and health-19 pointed to it, so learners saw a placeholder. It was written from scratch in the health-19 format (non-contact, kicks at hip height or lower with support, screening and stop rules) and registered in `lib/content.ts`. It has no hero image yet; `public/images/health-fitness/04-platinum/health-20/` is empty.

Three stories reused names from earlier lessons (Marcus three times, Elise twice) and were renamed. Every "Section NN" pointer was checked against the real section order.

Health figures checked: Canadian 24-Hour Movement Guidelines (150 minutes, strength twice weekly, 7 to 9 hours sleep, 7 to 8 for 65+, 8 hours or less sedentary), Health Canada leftovers guidance (2 hours, 2 to 3 days, 74°C), Health Canada caffeine (400 mg), front-of-package labelling, 9-8-8 Suicide Crisis Helpline. Training figures (sets, reps, protein, stretch dose, step counts, habit timing) follow mainstream research summaries and are framed as general ranges.

| Lesson | Course | Treatment | Teaching grade | Story grade |
|---|---|---|---|---|
| health-01 | Beginner Fitness for Men | done 2026-10-31 (sleep range added) | 7.17 → 7.00 | 6.42 → 5.26 |
| health-02 | Beginner Fitness for Women | done 2026-10-31 (pelvic-floor wording neutral) | 8.60 → 7.78 | 6.72 → 5.29 |
| health-03 | Home Workouts | done 2026-10-31 | 7.86 → 7.68 | 6.23 → 6.05 |
| health-04 | Gym Fundamentals | done 2026-10-31 (grade 9.3 to 7.8) | 9.34 → 7.82 | 7.12 → 5.23 |
| health-05 | Strength Training | done 2026-10-31 (8 to 15 rep starting range) | 8.69 → 8.05 | 7.37 → 5.17 |
| health-06 | Muscle Building | done 2026-10-31 (evidence panel: about 10 hard sets per muscle a week, 6 to 30 reps near failure, about 1.6 g/kg protein; broken spotlight fixed) | 10.27 → 7.16 | 8.62 → 4.73 |
| health-07 | Fat-Loss Fundamentals | done 2026-10-31 (safe pace about 0.5 to 1 kg a week; protein and strength to keep muscle) | 9.79 → 8.04 | 7.77 → 6.10 |
| health-08 | Low-Impact Fitness | done 2026-10-31 (two-hour joint-pain rule) | 9.51 → 7.78 | 7.59 → 5.39 |
| health-09 | Fitness Over 40 | done 2026-10-31 (midlife muscle and bone loss; Osteoporosis Canada advice) | 9.70 → 7.36 | 9.32 → 6.00 |
| health-10 | Fitness Over 50 | done 2026-10-31 (falls as leading cause of injury hospitalization for older Canadians; frequent balance practice) | 10.43 → 7.97 | 5.31 → 4.40 |
| health-11 | Mobility | done 2026-10-31 (starting dose 2 or 3 sets of 5 to 10 reps) | 9.11 → 7.29 | 6.70 → 5.42 |
| health-12 | Flexibility | done 2026-10-31 (stretch dose panel (10 to 30 s holds, about 60 s per stretch)) | 9.69 → 7.28 | 7.69 → 5.51 |
| health-13 | Core Strength | done 2026-10-31 (side planks and one-handed carries; short holds) | 8.91 → 7.17 | 5.43 → 4.79 |
| health-14 | Resistance-Band Training | done 2026-10-31 (bands and weights give similar strength gains) | 9.09 → 7.21 | 7.54 → 4.67 |
| health-15 | Bodyweight Training | done 2026-10-31 (stale end-of-series note replaced with next-up link) | 9.60 → 7.60 | 7.13 → 5.14 |
| health-16 | HIIT | done 2026-10-31 (McMaster HIIT evidence and 10 x 1-minute protocol; wrong Section 04 pointers) | 8.24 → 7.17 | 8.40 → 5.62 |
| health-17 | Walking Programs | done 2026-10-31 (step research (about 7,000 a day); 100 steps a minute) | 6.59 → 5.62 | 7.97 → 5.94 |
| health-18 | Running Programs | done 2026-10-31 (8 to 10 week run/walk build; overuse warning signs; third Marcus renamed) | 6.93 → 5.71 | 7.22 → 6.30 |
| health-19 | Boxing Fitness | done 2026-10-31 (hand wraps; quick heart-rate rise) | 7.64 → 6.19 | 7.79 → 5.71 |
| health-20 | Kickboxing Fitness | done 2026-10-31 (NEW lesson written from scratch (was missing; placeholder shown)) | new → 4.95 | new → 4.83 |
| health-21 | Yoga | done 2026-10-31 (teacher training; low back pain research) | 6.89 → 6.15 | 7.57 → 6.35 |
| health-22 | Pilates | done 2026-10-31 (wrong Section 02 pointer; low back pain research) | 7.16 → 5.99 | 7.92 → 6.68 |
| health-23 | Desk-Worker Mobility | done 2026-10-31 (8-hour sitting limit from the guidelines) | 7.17 → 6.22 | 7.35 → 6.70 |
| health-24 | Healthy Meal Planning | done 2026-10-31 (food safety checked against Health Canada; free food guide recipes) | 6.22 → 5.23 | 7.23 → 6.49 |
| health-25 | Protein and Nutrition Basics | done 2026-10-31 (protein panel (0.8 g/kg baseline, 1.0 to 1.6 g/kg active and older, food amounts); front-of-package symbol) | 7.05 → 5.79 | 8.11 → 5.97 |
| health-26 | Sleep and Recovery | done 2026-10-31 (400 mg caffeine limit; CBT-I for lasting insomnia) | 7.76 → 6.80 | 6.77 → 5.50 |
| health-27 | Habit Building | done 2026-10-31 (habit research (median 66 days, 18 to 254)) | 5.89 → 5.18 | 6.72 → 4.91 |
| health-28 | Stress Management | done 2026-10-31 (help lines 9-8-8, 2-1-1, Hope for Wellness, Kids Help Phone; EAPs) | 7.83 → 6.80 | 9.00 → 6.27 |
| health-29 | Thirty-Day Challenges | done 2026-10-31 (session math checked) | 7.64 → 6.37 | 7.06 → 6.05 |
| health-30 | Twelve-Week Transformations | done 2026-10-31 (end-of-fifteen-module note replaced with course-complete message; strength as next focus) | 7.18 → 6.35 | 7.06 → 6.16 |

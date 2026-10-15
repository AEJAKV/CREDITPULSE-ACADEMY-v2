# Course treatment manifest

Status of the course-treatment skill across courses. "Treated" means both motivator banners are present (the only automatically checkable marker); reading level, story, voice and action-form passes are not verified here.

Last audited: 2026-10-15. Re-audit: `for f in components/*Course*.jsx; do grep -q '<Motivator' "$f" || echo "$f"; done`

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

**v2 standard:** the "By the end, you will be able to" / "What you will leave with" outcomes list is removed from the start section of every credit lesson (decided 2026-10-15). Other `lists` blocks that carry teaching content stay.

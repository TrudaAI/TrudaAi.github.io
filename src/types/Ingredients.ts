// src/types/ingredients.ts

// --- 1. GLOBAL DROPDOWN UNION TYPES ---
export type ContainerCondition = 'Acceptable' | 'Damaged' | 'Rejected';
export type CoaStatus = 'Received' | 'Missing' | 'Pending';
export type ReleaseStatus = 'Released' | 'Quarantined' | 'Rejected';

// Maureen's core product list (You can append to this array configuration later via database dynamic entries)
export type FoodProductType = 'Yellow Maize Grit' | 'Whole Corn' | 'Palm Kernal Oil' | 'Flavour' | 'Glugose' | 'Caustic' | 'Lime' | 'Yeast' | 'Flour' | 'Salt';
export type BrandSegment = 'Softs' | 'Naks' | 'Corn' | 'Pretzels' | 'Popcorns';
export type FactoryLocation = 'Pietermaritzburg' | 'Pretoria' | 'Capetown' | 'Queenstown' | 'All Factories';

// Add this to src/types/ingredients.ts
export type UserRole = 'super-dev' | 'admin' | 'staff';

export type ComplianceReportStatus = 
  | 'Received - In Spec' 
  | 'Received - Not In Spec' 
  | 'Not Received' 
  | 'Not Received - Awaiting' 
  | 'Not Applicable'
  | 'Not Received - Awaiting tests'
  | 'Not Received - Not applicable';

export type DeclarationType = 'GMO' | 'Melamine' | 'Red Sudan';
export type ApprovalStatusType = 'Approved' | 'Not Approved' | 'On Hold';
export type ApproverRole = 'DC Stores Manager' | 'DC Manager' | 'COO/Director' | 'R&D Manager' | 'Buyer';
export type ApprovalReason = 'Cost' | 'Availability' | 'Quantity' | 'Compliance';

// --- 2. REUSABLE COMPLIANCE OBJECT PACKETS ---
export interface CertificationDetails {
  selectedCertificates: ('HACCP Certificate' | 'ISO Certificate' | 'FSSC Certificate' | 'GFSI Document' | 'HALAAL Certificate' | 'Kosher Certificate')[];
  expiryDate: string | null; // ISO Date string (YYYY-MM-DD)
  fileUrl?: string; // Will eventually hold the uploaded PDF link!
}

// --- 3. THE PRIMARY SYSTEM BLUEPRINT ---
export interface IngredientDeliveryRecord {
  id: string; // Internal unique database key
  
  // Phase 1: Delivery Details
  supplierName: string;
  manufacturerName: string;
  productName: FoodProductType; // Strict dropdown constraint
  isLocalSource: string; // true = local, false = import
  supplierBatchNumber: string;
  usedForSegment: BrandSegment; // Strict dropdown constraint
  deliveryDate: string; // YYYY-MM-DD
  factoryApplicable: FactoryLocation;

  // Questionnaires & Specifications
  hasSupplierQuestionnaire: boolean; // simplified dropdown "yes"/"no" to boolean flag
  supplierQuestionnaireExpDate: string | null;
  ingredientProductSpecificationRef: string; // e.g., "Ref: GM SPEC 001"
  ingredientProductSafetyDataSheetsRef: string; // e.g., "Ref: M SDS001"

  // Quality Systems & Dietary Frameworks (Nested objects grouping key-value pairings)
  foodSafetyCertifications: CertificationDetails;
  dietaryCertifications: CertificationDetails;

  // Laboratory Testing Guardrails
  microTestReports: ComplianceReportStatus;
  heavyMetalsTestReports: ComplianceReportStatus;
  chemicalsTestReports: ComplianceReportStatus;
  pesticideTestReports: ComplianceReportStatus;
  declarations: DeclarationType[]; // Array since multiple can be checked

  // Sign-off / Verification parameters
  approvalStatus: ApprovalStatusType;
  approvedBy: ApproverRole; // Handled dynamically via active logged-in session role
  reasonForApproval: ApprovalReason[]; // Array because it supports multiple selections
  additionalAvailabilityNotes?: string;
  dateOfApproval: string; // YYYY-MM-DD
  
  // Phase 2: Physical Intake Checks
  containerCondition: ContainerCondition;
  isInfestedOrContaminated: boolean;
  vehicleDeliveryTempCelsius: number;

  // Phase 3: Final Release
  coaStatus: CoaStatus;
  coaDate: string | null;
  releaseStatus: ReleaseStatus;
  comments?: string;
}
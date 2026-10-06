import React, { useState } from "react";
import type { 
    IngredientDeliveryRecord, 
    FoodProductType, 
    BrandSegment, 
    FactoryLocation, 
    ComplianceReportStatus, 
    ApprovalStatusType, 
    ApproverRole, 
    ApprovalReason, 
    DeclarationType,
    ContainerCondition,
    CoaStatus,
    ReleaseStatus
} from "../types/Ingredients";

export default function IMSApprovalForm() {
    const [formData, setFormData] = useState<Omit<IngredientDeliveryRecord, 'id'>>({
        supplierName: '',
        manufacturerName: '',
        productName: 'Yellow Maize Grit' as FoodProductType,
        isLocalSource: 'Local',
        supplierBatchNumber: '',
        usedForSegment: 'Softs' as BrandSegment,
        deliveryDate: new Date().toISOString().split('T')[0],
        factoryApplicable: 'All Factories' as FactoryLocation,

        hasSupplierQuestionnaire: true,
        supplierQuestionnaireExpDate: null,
        ingredientProductSpecificationRef: '',
        ingredientProductSafetyDataSheetsRef: '',

        foodSafetyCertifications: {
            selectedCertificates: [],
            expiryDate: null,
        },
        dietaryCertifications: {
            selectedCertificates: [],
            expiryDate: null,
        },

        microTestReports: 'Received - In Spec',
        heavyMetalsTestReports: 'Not Applicable',
        chemicalsTestReports: 'Received - In Spec',
        pesticideTestReports: 'Not Received - Awaiting tests',
        declarations: [],

        approvalStatus: 'Approved',
        approvedBy: 'DC Stores Manager',
        reasonForApproval: [],
        dateOfApproval: new Date().toISOString().split('T')[0],

        containerCondition: 'Acceptable',
        isInfestedOrContaminated: false,
        vehicleDeliveryTempCelsius: 20,

        coaStatus: 'Received',
        coaDate: null,
        releaseStatus: 'Quarantined',
        comments: ''
    });

    const [errors, setErrors] = useState({
        supplierName: '',
        supplierBatchNumber: '',
        manufacturerName: ''
    });

    const handleArrayToggle = (field: 'reasonForApproval' | 'declarations', value: any) => {
        const currentList = formData[field] as any[];
        if (currentList.includes(value)) {
            setFormData({ ...formData, [field]: currentList.filter(item => item !== value) });
        } else {
            setFormData({ ...formData, [field]: [...currentList, value] });
        }
    };

    const handleCertToggle = (certType: 'foodSafetyCertifications' | 'dietaryCertifications', certName: any) => {
        const currentSelected = formData[certType].selectedCertificates;
        const updated = currentSelected.includes(certName)
            ? currentSelected.filter(c => c !== certName)
            : [...currentSelected, certName];
        
        setFormData({
            ...formData,
            [certType]: { ...formData[certType], selectedCertificates: updated }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let currentErrors = { supplierName: '', supplierBatchNumber: '', manufacturerName: '' };
        let hasError = false;

        if (!formData.supplierName.trim()) {
            currentErrors.supplierName = "Supplier name is required.";
            hasError = true;
        }
        if (!formData.supplierBatchNumber.trim()) {
            currentErrors.supplierBatchNumber = "Batch number is required.";
            hasError = true;
        }
        if (!formData.manufacturerName.trim()) {
            currentErrors.manufacturerName = "Manufacturer name is required.";
            hasError = true;
        }

        if (hasError) {
            setErrors(currentErrors);
            return;
        }

        setErrors({ supplierName: '', supplierBatchNumber: '', manufacturerName: '' });
        
        const fullRecord: IngredientDeliveryRecord = {
            id: `IMS-${Date.now()}`,
            ...formData
        };

        console.log("SUCCESS! Validated Master Record:", fullRecord);
        alert("IMS Record successfully validated and compiled!");
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl border border-gray-200/80 shadow-sm max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="border-b border-gray-100 pb-5">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-600"></span>
                    <h2 className="text-lg font-semibold tracking-tight text-gray-900">IMS - Ingredient Approval & Intake Flow</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">Configure master data details, supplier certifications, compliance reports, and final sign-off.</p>
            </div>

            {/* SECTION 1: CORE DELIVERY DETAILS */}
            <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">1. Core Delivery Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Supplier Name *</label>
                        <input
                            type="text"
                            value={formData.supplierName}
                            onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                            className={`w-full text-sm bg-gray-50/50 border rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all ${errors.supplierName ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="e.g., Gritsup (Pty) Ltd"
                        />
                        {errors.supplierName && <p className="text-xs text-red-600">{errors.supplierName}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Manufacturer Name *</label>
                        <input
                            type="text"
                            value={formData.manufacturerName}
                            onChange={(e) => setFormData({ ...formData, manufacturerName: e.target.value })}
                            className={`w-full text-sm bg-gray-50/50 border rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all ${errors.manufacturerName ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="e.g., Farmers"
                        />
                        {errors.manufacturerName && <p className="text-xs text-red-600">{errors.manufacturerName}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Ingredient / Product Supplied</label>
                        <select
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value as FoodProductType })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['Yellow Maize Grit', 'Whole Corn', 'Palm Kernal Oil', 'Flavour', 'Glugose', 'Caustic', 'Lime', 'Yeast', 'Flour', 'Salt'] as FoodProductType[]).map((prod) => (
                                <option key={prod} value={prod}>{prod}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Source (Local / Import)</label>
                        <select
                            value={formData.isLocalSource}
                            onChange={(e) => setFormData({ ...formData, isLocalSource: e.target.value })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {['Local', 'Import'].map((source) => (
                                <option key={source} value={source}>{source}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Used for Segment</label>
                        <select
                            value={formData.usedForSegment}
                            onChange={(e) => setFormData({ ...formData, usedForSegment: e.target.value as BrandSegment })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['Softs', 'Naks', 'Corn', 'Pretzels', 'Popcorns'] as BrandSegment[]).map((seg) => (
                                <option key={seg} value={seg}>{seg}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Factory Applicable</label>
                        <select
                            value={formData.factoryApplicable}
                            onChange={(e) => setFormData({ ...formData, factoryApplicable: e.target.value as FactoryLocation })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['Pietermaritzburg', 'Pretoria', 'Capetown', 'Queenstown', 'All Factories'] as FactoryLocation[]).map((fac) => (
                                <option key={fac} value={fac}>{fac}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Supplier Batch Number *</label>
                        <input
                            type="text"
                            value={formData.supplierBatchNumber}
                            onChange={(e) => setFormData({ ...formData, supplierBatchNumber: e.target.value })}
                            className={`w-full text-sm bg-gray-50/50 border rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all ${errors.supplierBatchNumber ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="e.g., BATCH-2026-09"
                        />
                        {errors.supplierBatchNumber && <p className="text-xs text-red-600">{errors.supplierBatchNumber}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Delivery Date</label>
                        <input
                            type="date"
                            value={formData.deliveryDate}
                            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 2: DOCUMENTATION & SPECIFICATIONS */}
            <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">2. Documentation & Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Supplier Questionnaire (Yes / No)</label>
                        <select
                            value={formData.hasSupplierQuestionnaire ? 'Yes' : 'No'}
                            onChange={(e) => setFormData({ ...formData, hasSupplierQuestionnaire: e.target.value === 'Yes' })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Questionnaire Expiry Date</label>
                        <input
                            type="date"
                            value={formData.supplierQuestionnaireExpDate || ''}
                            onChange={(e) => setFormData({ ...formData, supplierQuestionnaireExpDate: e.target.value ? e.target.value : null })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Product Specification Reference</label>
                        <input
                            type="text"
                            value={formData.ingredientProductSpecificationRef}
                            onChange={(e) => setFormData({ ...formData, ingredientProductSpecificationRef: e.target.value })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                            placeholder="Ref: GM SPEC 001"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Safety Data Sheets (SDS) Reference</label>
                        <input
                            type="text"
                            value={formData.ingredientProductSafetyDataSheetsRef}
                            onChange={(e) => setFormData({ ...formData, ingredientProductSafetyDataSheetsRef: e.target.value })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                            placeholder="Ref: M SDS001"
                        />
                    </div>

                    {/* ISO / HACCP / FSSC Certificates */}
                    <div className="space-y-3 md:col-span-2 bg-gray-50/50 p-4 rounded-xl border border-gray-200/60">
                        <label className="text-xs font-semibold text-gray-800">ISO / HACCP / FSSC Certificates</label>
                        <div className="flex flex-wrap gap-6">
                            {(['HACCP Certificate', 'ISO Certificate', 'FSSC Certificate', 'GFSI Document'] as const).map((cert) => (
                                <label key={cert} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={formData.foodSafetyCertifications.selectedCertificates.includes(cert)}
                                        onChange={() => handleCertToggle('foodSafetyCertifications', cert)}
                                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500/20"
                                    />
                                    {cert}
                                </label>
                            ))}
                        </div>
                        <div className="pt-2 max-w-sm space-y-1">
                            <label className="text-xs font-medium text-gray-600">Food Safety Certs Expiry Date</label>
                            <input
                                type="date"
                                value={formData.foodSafetyCertifications.expiryDate || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    foodSafetyCertifications: { ...formData.foodSafetyCertifications, expiryDate: e.target.value || null }
                                })}
                                className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                            />
                        </div>
                    </div>

                    {/* HALAAL / KOSHER Certificates */}
                    <div className="space-y-3 md:col-span-2 bg-gray-50/50 p-4 rounded-xl border border-gray-200/60">
                        <label className="text-xs font-semibold text-gray-800">HALAAL / KOSHER Certificates</label>
                        <div className="flex flex-wrap gap-6">
                            {(['HALAAL Certificate', 'Kosher Certificate'] as const).map((cert) => (
                                <label key={cert} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={formData.dietaryCertifications.selectedCertificates.includes(cert)}
                                        onChange={() => handleCertToggle('dietaryCertifications', cert)}
                                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500/20"
                                    />
                                    {cert}
                                </label>
                            ))}
                        </div>
                        <div className="pt-2 max-w-sm space-y-1">
                            <label className="text-xs font-medium text-gray-600">Dietary Certs Expiry Date</label>
                            <input
                                type="date"
                                value={formData.dietaryCertifications.expiryDate || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    dietaryCertifications: { ...formData.dietaryCertifications, expiryDate: e.target.value || null }
                                })}
                                className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: TEST REPORTS & COMPLIANCE */}
            <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">3. Test Reports & Compliance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Micro Test Reports</label>
                        <select
                            value={formData.microTestReports}
                            onChange={(e) => setFormData({ ...formData, microTestReports: e.target.value as ComplianceReportStatus })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['Received - In Spec', 'Received - Not In Spec', 'Not Received', 'Not Received - Awaiting', 'Not Applicable', 'Not Received - Awaiting tests', 'Not Received - Not applicable'] as ComplianceReportStatus[]).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Heavy Metals Test Reports</label>
                        <select
                            value={formData.heavyMetalsTestReports}
                            onChange={(e) => setFormData({ ...formData, heavyMetalsTestReports: e.target.value as ComplianceReportStatus })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['Received - In Spec', 'Received - Not In Spec', 'Not Received', 'Not Received - Awaiting', 'Not Applicable', 'Not Received - Awaiting tests', 'Not Received - Not applicable'] as ComplianceReportStatus[]).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Chemicals Test Reports</label>
                        <select
                            value={formData.chemicalsTestReports}
                            onChange={(e) => setFormData({ ...formData, chemicalsTestReports: e.target.value as ComplianceReportStatus })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['Received - In Spec', 'Received - Not In Spec', 'Not Received', 'Not Received - Awaiting', 'Not Applicable', 'Not Received - Awaiting tests', 'Not Received - Not applicable'] as ComplianceReportStatus[]).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Pesticide Test Reports</label>
                        <select
                            value={formData.pesticideTestReports}
                            onChange={(e) => setFormData({ ...formData, pesticideTestReports: e.target.value as ComplianceReportStatus })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['Received - In Spec', 'Received - Not In Spec', 'Not Received', 'Not Received - Awaiting', 'Not Applicable', 'Not Received - Awaiting tests', 'Not Received - Not applicable'] as ComplianceReportStatus[]).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Declarations Checkboxes */}
                    <div className="space-y-2 md:col-span-2 pt-1">
                        <label className="text-xs font-medium text-gray-700">Declarations</label>
                        <div className="flex flex-wrap gap-6">
                            {(['GMO', 'Melamine', 'Red Sudan'] as DeclarationType[]).map((decl) => (
                                <label key={decl} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={formData.declarations.includes(decl)}
                                        onChange={() => handleArrayToggle('declarations', decl)}
                                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500/20"
                                    />
                                    {decl}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4: LOGISTICS & INSPECTION */}
            <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">4. Logistics & Inspection</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Container Condition</label>
                        <select
                            value={formData.containerCondition}
                            onChange={(e) => setFormData({ ...formData, containerCondition: e.target.value as ContainerCondition })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['Acceptable', 'Damaged', 'Rejected'] as ContainerCondition[]).map((cond) => (
                                <option key={cond} value={cond}>{cond}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Vehicle Delivery Temp (°C)</label>
                        <input
                            type="number"
                            value={formData.vehicleDeliveryTempCelsius}
                            onChange={(e) => setFormData({ ...formData, vehicleDeliveryTempCelsius: Number(e.target.value) })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Release Status</label>
                        <select
                            value={formData.releaseStatus}
                            onChange={(e) => setFormData({ ...formData, releaseStatus: e.target.value as ReleaseStatus })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['Released', 'Quarantined', 'Rejected'] as ReleaseStatus[]).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">COA Status</label>
                        <select
                            value={formData.coaStatus}
                            onChange={(e) => setFormData({ ...formData, coaStatus: e.target.value as CoaStatus })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['Received', 'Missing', 'Pending'] as CoaStatus[]).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">COA Date</label>
                        <input
                            type="date"
                            value={formData.coaDate || ''}
                            onChange={(e) => setFormData({ ...formData, coaDate: e.target.value ? e.target.value : null })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                        <input
                            type="checkbox"
                            checked={formData.isInfestedOrContaminated}
                            onChange={(e) => setFormData({ ...formData, isInfestedOrContaminated: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500/20"
                        />
                        <label className="text-xs font-medium text-gray-700 select-none">Infested or Contaminated</label>
                    </div>
                </div>
            </div>

            {/* SECTION 5: APPROVAL SIGN-OFF & COMMENTS */}
            <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">5. Approval Sign-Off & Comments</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Approval Status</label>
                        <select
                            value={formData.approvalStatus}
                            onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value as ApprovalStatusType })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['Approved', 'Not Approved', 'On Hold'] as ApprovalStatusType[]).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Approved By Role</label>
                        <select
                            value={formData.approvedBy}
                            onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value as ApproverRole })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        >
                            {(['DC Stores Manager', 'DC Manager', 'COO/Director', 'R&D Manager', 'Buyer'] as ApproverRole[]).map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Date of Approval</label>
                        <input
                            type="date"
                            value={formData.dateOfApproval}
                            onChange={(e) => setFormData({ ...formData, dateOfApproval: e.target.value })}
                            className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        />
                    </div>
                </div>

                {/* Reason for Approval checkboxes */}
                <div className="space-y-2 pt-1">
                    <label className="text-xs font-medium text-gray-700">Reason For Approval</label>
                    <div className="flex flex-wrap gap-6">
                        {(['Cost', 'Availability', 'Quantity', 'Compliance'] as ApprovalReason[]).map((reason) => (
                            <label key={reason} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={formData.reasonForApproval.includes(reason)}
                                    onChange={() => handleArrayToggle('reasonForApproval', reason)}
                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500/20"
                                />
                                {reason}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-medium text-gray-700">Comments</label>
                    <textarea
                        value={formData.comments}
                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                        className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                        rows={3}
                        placeholder="Add optional notes or comments regarding delivery..."
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-600/20"
                >
                    Validate & Submit Ingredient Record
                </button>
            </div>
        </form>
    );
}
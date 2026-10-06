import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import DeliveryDetailsSection from './ApprovalForm'; 
import IMSOverview from './IMSOverview';
import { ShieldCheck, LogOut, FileSpreadsheet, Users, Settings, FilePlus, ArrowLeft } from 'lucide-react';
import type { IngredientDeliveryRecord, UserRole } from '../types/Ingredients';

export default function Dashboard() {
  const { user, logout } = useAuth(); 
  
  const [activePage, setActivePage] = useState<string>('menu');
  
  // --- DUMMY RECORDS INITIALIZATION ---
  const [records] = useState<IngredientDeliveryRecord[]>([
    {
      id: 'rec-001',
      supplierName: 'AgriCorp Milling (Pty) Ltd',
      manufacturerName: 'AgriCorp Mill 3',
      productName: 'Yellow Maize Grit',
      isLocalSource: 'true',
      supplierBatchNumber: 'YM-2026-1004A',
      usedForSegment: 'Naks',
      deliveryDate: '2026-10-05',
      factoryApplicable: 'Pietermaritzburg',
      hasSupplierQuestionnaire: true,
      supplierQuestionnaireExpDate: '2027-01-15',
      ingredientProductSpecificationRef: 'SPEC-YM-01',
      ingredientProductSafetyDataSheetsRef: 'SDS-YM-01',
      foodSafetyCertifications: {
        selectedCertificates: ['HACCP Certificate', 'FSSC Certificate'],
        expiryDate: '2027-05-20'
      },
      dietaryCertifications: {
        selectedCertificates: ['HALAAL Certificate'],
        expiryDate: '2027-05-20'
      },
      microTestReports: 'Received - In Spec',
      heavyMetalsTestReports: 'Received - In Spec',
      chemicalsTestReports: 'Not Applicable',
      pesticideTestReports: 'Received - In Spec',
      declarations: ['GMO', 'Red Sudan'],
      approvalStatus: 'Approved',
      approvedBy: 'DC Stores Manager',
      reasonForApproval: ['Compliance', 'Availability'],
      dateOfApproval: '2026-10-05',
      containerCondition: 'Acceptable',
      isInfestedOrContaminated: false,
      vehicleDeliveryTempCelsius: 22.5,
      coaStatus: 'Received',
      coaDate: '2026-10-05',
      releaseStatus: 'Released',
      comments: 'Passed initial dock inspection and moisture check.'
    },
    {
      id: 'rec-002',
      supplierName: 'PalmPro Industrial Oils',
      manufacturerName: 'Global Lipids Ltd',
      productName: 'Palm Kernal Oil',
      isLocalSource: 'false',
      supplierBatchNumber: 'PKO-8829-B',
      usedForSegment: 'Softs',
      deliveryDate: '2026-10-06',
      factoryApplicable: 'Pietermaritzburg',
      hasSupplierQuestionnaire: true,
      supplierQuestionnaireExpDate: '2026-11-30',
      ingredientProductSpecificationRef: 'SPEC-PKO-04',
      ingredientProductSafetyDataSheetsRef: 'SDS-PKO-04',
      foodSafetyCertifications: {
        selectedCertificates: ['ISO Certificate'],
        expiryDate: '2026-12-01'
      },
      dietaryCertifications: {
        selectedCertificates: ['Kosher Certificate'],
        expiryDate: '2026-12-01'
      },
      microTestReports: 'Received - In Spec',
      heavyMetalsTestReports: 'Not Received - Awaiting tests',
      chemicalsTestReports: 'Not Received - Awaiting tests',
      pesticideTestReports: 'Not Applicable',
      declarations: ['Melamine'],
      approvalStatus: 'On Hold',
      approvedBy: 'R&D Manager',
      reasonForApproval: ['Compliance'],
      dateOfApproval: '2026-10-06',
      containerCondition: 'Acceptable',
      isInfestedOrContaminated: false,
      vehicleDeliveryTempCelsius: 25.0,
      coaStatus: 'Pending',
      coaDate: null,
      releaseStatus: 'Quarantined',
      comments: 'Awaiting heavy metal lab certificates before release.'
    }
  ]);

  if (!user) return null; 

  const canAccessDelivery = user.role === 'super-dev' || user.role === 'admin' || user.role === 'staff';

  const allCards = [
    {
      id: 'delivery_intake',
      title: 'Logistics Intake Overview',
      description: 'Open the ingredient delivery overview table.',
      icon: <FilePlus className="h-5 w-5 text-rose-400" />,
      allowedRoles: ['super-dev', 'admin', 'staff'] as UserRole[],
    },
    {
      id: 'approval_form',
      title: 'Logistics Intake Form',
      description: 'Open the approval form page to process raw material manifests.',
      icon: <FilePlus className="h-5 w-5 text-indigo-400" />,
      allowedRoles: ['super-dev', 'admin', 'staff'] as UserRole[],
    },
    {
      id: 'excel-form',
      title: 'Data Capture Form',
      description: 'Input production data and generate structured data sheets.',
      icon: <FileSpreadsheet className="h-5 w-5 text-rose-400" />,
      allowedRoles: ['super-dev', 'admin', 'staff'] as UserRole[],
    },
    {
      id: 'reports',
      title: 'Analytics & Reports',
      description: 'View historical exports, logs, and department metrics.',
      icon: <FileSpreadsheet className="h-5 w-5 text-indigo-400" />,
      allowedRoles: ['super-dev', 'admin'] as UserRole[],
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage internal network accounts and role clearances.',
      icon: <Users className="h-5 w-5 text-purple-400" />,
      allowedRoles: ['super-dev'] as UserRole[],
    },
    {
      id: 'system',
      title: 'System Settings',
      description: 'Local network configurations, camera bindings, and backups.',
      icon: <Settings className="h-5 w-5 text-amber-400" />,
      allowedRoles: ['super-dev'] as UserRole[],
    }
  ];

  const visibleCards = allCards.filter(card => card.allowedRoles.includes(user.role));

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      
      {/* --- COMMAND BAR --- */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">TrudaIMS</span>
            <h1 className="text-sm font-bold text-white tracking-tight">Control Portal</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-slate-300">{user.username}</span>
            <span className="text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">
              {user.role}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <button 
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* --- MAIN CONTAINER --- */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        
        {/* --- VIEW 1: DASHBOARD CARDS MENU --- */}
        {activePage === 'menu' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">System Modules</h2>
              <p className="text-xs text-slate-400 mt-0.5">Select a module card to open its respective component page.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleCards.map(card => (
                <div 
                  key={card.id}
                  onClick={() => setActivePage(card.id)}
                  className="group bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg hover:border-rose-500/50 hover:bg-slate-900/80 transition-all cursor-pointer flex gap-4 items-start relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-rose-500 transition-all" />
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 shrink-0 group-hover:border-rose-500/30 transition-colors">
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white text-sm tracking-tight">{card.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW 2: IMS OVERVIEW PAGE --- */}
        {activePage === 'delivery_intake' && canAccessDelivery && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <button
                onClick={() => setActivePage('menu')}
                className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg transition cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-rose-400" />
                <span>Back to Modules</span>
              </button>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Logistics Intake Overview</span>
            </div>

            <IMSOverview 
              records={records}
              onAddNew={() => setActivePage('approval_form')}
              onSelectRecord={(record) => {
                console.log("Selected record for inspection:", record);
              }}
            />
          </div>
        )}

        {/* --- VIEW 3: APPROVAL FORM PAGE --- */}
        {activePage === 'approval_form' && canAccessDelivery && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <button
                onClick={() => setActivePage('menu')}
                className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg transition cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-rose-400" />
                <span>Back to Modules</span>
              </button>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Logistics Intake Form</span>
            </div>

            <DeliveryDetailsSection />
          </div>
        )}

        {/* --- VIEW 4: DATA CAPTURE FORM --- */}
        {activePage === 'excel-form' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <button
                onClick={() => setActivePage('menu')}
                className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg transition cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-rose-400" />
                <span>Back to Modules</span>
              </button>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Data Capture Form</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <p className="text-xs text-slate-400">Data Capture Form component container.</p>
            </div>
          </div>
        )}

        {/* --- VIEW 5: REPORTS --- */}
        {activePage === 'reports' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <button
                onClick={() => setActivePage('menu')}
                className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg transition cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-rose-400" />
                <span>Back to Modules</span>
              </button>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Analytics & Reports</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <p className="text-xs text-slate-400">Analytics & Reports component container.</p>
            </div>
          </div>
        )}

        {/* --- VIEW 6: USERS --- */}
        {activePage === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <button
                onClick={() => setActivePage('menu')}
                className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg transition cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-rose-400" />
                <span>Back to Modules</span>
              </button>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">User Management</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <p className="text-xs text-slate-400">User Management component container.</p>
            </div>
          </div>
        )}

        {/* --- VIEW 7: SYSTEM SETTINGS --- */}
        {activePage === 'system' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <button
                onClick={() => setActivePage('menu')}
                className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg transition cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-rose-400" />
                <span>Back to Modules</span>
              </button>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">System Settings</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <p className="text-xs text-slate-400">System Settings component container.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
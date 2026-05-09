import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  LayoutDashboard, Briefcase, Users, UserRound, FileText, Lock, 
  Search, Bell, Settings, TrendingUp, AlertTriangle, ArrowUpRight, 
  DollarSign, FileCode, CheckCircle2, ChevronRight, Download, Plus, X, Building2, ShieldCheck, ArrowRight, UserCheck, Clock,
  TrendingDown, ArrowDownRight, MoreVertical, Calendar, BadgeCheck, PieChart as PieChartIcon
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { formatCurrency, cn } from './lib/utils';
import { translations, Language } from './lib/translations';

// --- LANGUAGE CONTEXT ---
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>('vi');

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useTranslation() {
  const context = React.useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}

// --- EXECUTIVE ANIMATION SYSTEM ---
const motionSettings = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1], // Cubic-bezier for premium feel
};

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { ...motionSettings, duration: 0.4 } },
  exit: { opacity: 0, y: -8, transition: motionSettings }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.04
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: motionSettings }
};

const modalVariants = {
  backdrop: { 
    initial: { opacity: 0 }, 
    animate: { opacity: 1 }, 
    exit: { opacity: 0 } 
  },
  content: { 
    initial: { opacity: 0, scale: 0.96, y: 20 }, 
    animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.96, y: 20, transition: motionSettings }
  }
};

// --- Types ---
interface Asset {
  id: string;
  name: string;
  category: string;
  value: number;
  performance: number;
  manager: string;
  risk: string;
}

// --- Mock Data ---
const AUM_HISTORY = [
  { month: 'Tháng 1', value: 3800000 },
  { month: 'Tháng 2', value: 3950000 },
  { month: 'Tháng 3', value: 4100000 },
  { month: 'Tháng 4', value: 4050000 },
  { month: 'Tháng 5', value: 4200000 },
  { month: 'Tháng 6', value: 4280500 },
];

const ALLOCATION_DATA = [
  { name: 'Bất động sản', value: 55, color: '#000000' },
  { name: 'Cổ phần (Private Equity)', value: 30, color: '#6366f1' },
  { name: 'Tiền mặt & Tương đương', value: 15, color: '#94a3b8' },
];

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { language, setLanguage, t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="bg-white border-r border-[#E9ECEF] flex flex-col z-50 relative shadow-sm"
      >
        <div className="p-8 pb-12 flex justify-between items-center">
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed ? (
              <motion.div 
                key="logo-full"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <ShieldCheck className="text-white" size={18} />
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tighter uppercase italic leading-none">Elysium Ledger</h1>
                  <p className="text-[8px] text-gray-400 font-bold tracking-widest uppercase mt-1">Audit Protocol</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="logo-mini"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mx-auto"
              >
                <ShieldCheck className="text-white" size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <LayoutGroup>
            <NavItem active={activeTab === 'dashboard'} icon={<LayoutDashboard size={20} />} label={t('dashboard')} onClick={() => setActiveTab('dashboard')} collapsed={isSidebarCollapsed} />
            <NavItem active={activeTab === 'portfolio'} icon={<Briefcase size={20} />} label={t('portfolio')} onClick={() => setActiveTab('portfolio')} collapsed={isSidebarCollapsed} />
            <NavItem active={activeTab === 'finance'} icon={<DollarSign size={20} />} label={t('finance')} onClick={() => setActiveTab('finance')} collapsed={isSidebarCollapsed} />
            <NavItem active={activeTab === 'risk'} icon={<AlertTriangle size={20} />} label={t('risk')} onClick={() => setActiveTab('risk')} collapsed={isSidebarCollapsed} />
            <NavItem active={activeTab === 'governance'} icon={<Users size={20} />} label={t('governance')} onClick={() => setActiveTab('governance')} collapsed={isSidebarCollapsed} />
            <NavItem active={activeTab === 'team'} icon={<UserRound size={20} />} label={t('team')} onClick={() => setActiveTab('team')} collapsed={isSidebarCollapsed} />
            <NavItem active={activeTab === 'vault'} icon={<Lock size={20} />} label={t('vault')} onClick={() => setActiveTab('vault')} collapsed={isSidebarCollapsed} />
          </LayoutGroup>
        </nav>

        <div className="p-4 border-t border-[#E9ECEF] space-y-4">
           {!isSidebarCollapsed && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-4 bg-gray-50 rounded-2xl border border-gray-100"
             >
               <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=HuyNguyen" alt="User" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Huy Nguyễn</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('userProfile')}</p>
                  </div>
               </div>
               <button className="w-full flex items-center justify-between text-gray-400 hover:text-black transition-colors">
                 <span className="text-[10px] font-bold uppercase tracking-widest">{t('settings')}</span>
                 <Settings size={14} />
               </button>
             </motion.div>
           )}
           <button 
             onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
             className="w-full py-3 flex items-center justify-center text-gray-400 hover:text-black bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
           >
             <ArrowRight className={cn("transition-transform duration-500", !isSidebarCollapsed && "rotate-180")} size={18} />
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F8F9FA] relative scroll-smooth">
        <header className="sticky top-0 bg-white/60 backdrop-blur-xl border-b border-[#E9ECEF] z-40 px-10 py-6 flex justify-between items-center shadow-sm">
           <div className="flex items-center bg-gray-100 px-4 py-2.5 rounded-xl w-96 border border-transparent focus-within:border-black/5 focus-within:bg-white transition-all">
              <Search className="text-gray-400 mr-3" size={18} />
              <input type="text" placeholder={t('search')} className="bg-transparent border-none outline-none text-sm w-full font-medium" />
           </div>

           <div className="flex items-center space-x-6 relative">
              <div className="relative">
                 <button 
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500"
                 >
                    <span>{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                    <ChevronRight size={14} className={cn("transition-transform", showLanguageMenu && "rotate-90")} />
                 </button>
                 
                 <AnimatePresence>
                    {showLanguageMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full mt-2 right-0 w-44 bg-white border border-gray-100 rounded-2xl shadow-huge overflow-hidden z-[100]"
                      >
                         <button 
                          onClick={() => { setLanguage('en'); setShowLanguageMenu(false); }}
                          className={cn(
                            "w-full px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors flex justify-between items-center",
                            language === 'en' ? "text-black" : "text-gray-400"
                          )}
                         >
                            English
                            {language === 'en' && <CheckCircle2 size={12} className="text-emerald-500" />}
                         </button>
                         <button 
                          onClick={() => { setLanguage('vi'); setShowLanguageMenu(false); }}
                          className={cn(
                            "w-full px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors flex justify-between items-center",
                            language === 'vi' ? "text-black" : "text-gray-400"
                          )}
                         >
                            Tiếng Việt
                            {language === 'vi' && <CheckCircle2 size={12} className="text-emerald-500" />}
                         </button>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <button className="relative p-2.5 text-gray-400 hover:text-black transition-colors bg-gray-50 rounded-xl shadow-sm border border-gray-100">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center space-x-3 px-3 py-1.5 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                 <div className="text-right hidden md:block">
                    <p className="text-xs font-bold uppercase tracking-widest">Admin Control</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Root Access</p>
                 </div>
                 <div className="w-9 h-9 rounded-xl bg-slate-800 overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-105">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=HuyNguyen" alt="User" />
                 </div>
              </div>
           </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-full"
            >
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'portfolio' && <PortfolioView />}
              {activeTab === 'finance' && <PnLManagementView />}
              {activeTab === 'risk' && <RiskAnalyzerView />}
              {activeTab === 'governance' && <GovernanceView />}
              {activeTab === 'team' && <TeamView />}
              {activeTab === 'vault' && <VaultView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function DecisionMatrix({ governance }: { governance: any }) {
  if (!governance) return <div className="text-gray-400 italic text-xs">No governance matrix defined.</div>;

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <motion.div variants={cardVariants} className="text-center">
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-4">Sơ đồ ma trận quyền lực</p>
        <div className="inline-block relative">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-2xl bg-black border-4 border-gray-100 overflow-hidden mx-auto shadow-huge mb-3"
          >
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${governance.veto.name}`} alt="Veto" />
          </motion.div>
          <h4 className="font-bold text-sm bg-white px-3 py-1 rounded inline-block shadow-sm">{governance.veto.name}</h4>
          <p className="text-[9px] uppercase font-bold text-gray-500 mt-1">{governance.veto.role}</p>
          <div className="mt-2 inline-block bg-black text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">{governance.veto.title}</div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gray-200 -top-8"></div>
        {governance.executors.map((exec: any, idx: number) => (
          <motion.div 
            key={idx} 
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="text-center relative"
          >
            <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden mx-auto mb-2">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${exec.name}`} alt="Exec" />
            </div>
            <h5 className="font-bold text-xs">{exec.name}</h5>
            <p className="text-[8px] uppercase font-bold text-gray-400">{exec.role}</p>
            <div className="mt-1 inline-block bg-gray-100 text-gray-500 text-[7px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">{exec.title}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center space-x-6">
        {governance.reviewers.map((rev: any, idx: number) => (
          <motion.div 
            key={idx} 
            variants={cardVariants}
            whileHover={{ scale: 1.1 }}
            className="text-center"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white mb-2 mx-auto">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.name}`} alt="Reviewer" />
            </div>
            <p className="text-[8px] font-bold uppercase text-gray-500">{rev.role}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function AssetDetailModal({ assetId, onClose }: { assetId: string, onClose: () => void }) {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/assets/${assetId}/details`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [assetId]);

  if (loading) return null;

  const { asset, owner } = data;

  return (
    <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-8 backdrop-blur-xl">
      <div className="bg-white rounded-[40px] w-full max-w-6xl h-[90vh] flex overflow-hidden shadow-huge animate-in zoom-in-95 duration-300">
        {/* Left Side: Asset Info */}
        <div className="flex-[4] p-12 border-r overflow-y-auto space-y-10">
          <div className="flex justify-between items-start">
             <div>
               <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{asset.category} • {asset.id}</p>
               <h2 className="text-4xl font-bold tracking-tight">{asset.name}</h2>
             </div>
             <button onClick={onClose} className="p-2 text-gray-400 hover:text-black"><X size={24} /></button>
          </div>

          <div className="grid grid-cols-2 gap-8">
             <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Giá trị hiện tại (AUM)</p>
                <p className="text-3xl font-bold">${asset.value.toLocaleString()}</p>
                <p className="text-emerald-500 font-bold text-xs mt-1 flex items-center"><TrendingUp size={14} className="mr-1" /> +{asset.performance}% vs Quý trước</p>
             </div>
             <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Mức độ rủi ro</p>
                <div className="flex items-center space-x-2">
                   <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={cn(
                        "h-full rounded-full",
                        asset.risk === 'Low' ? "bg-emerald-500 w-1/3" : 
                        asset.risk === 'Medium' ? "bg-amber-500 w-2/3" : "bg-rose-500 w-full"
                      )}></div>
                   </div>
                   <span className="text-xs font-bold uppercase tracking-widest">{asset.risk}</span>
                </div>
             </div>
          </div>

          <div>
             <h4 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-6 flex justify-between items-center">
                <span>Danh mục tài sản sở hữu</span>
                <span className="text-[10px] font-normal italic text-gray-400">Dữ liệu hợp nhất</span>
             </h4>
             <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white border rounded-2xl hover:border-black transition-all cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mr-4"><Building2 size={18} className="text-gray-400" /></div>
                      <div>
                        <p className="text-sm font-bold">Thực thể Property {i}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">SPV • Vietnam</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold">$125,000,000</p>
                       <p className="text-emerald-500 font-bold text-[10px]">+8.2%</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Side: Governance */}
        <div className="flex-[3] bg-[#F8F9FA] p-12 overflow-y-auto">
           <div className="mb-10 text-center">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4">Chủ sở hữu Thực thể</p>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm inline-block min-w-full">
                 <h3 className="text-xl font-bold">{owner.name}</h3>
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">{owner.type} • {owner.jurisdiction}</p>
                 <div className="w-16 h-16 bg-gray-50 rounded-2xl mx-auto mt-4 mb-4 flex items-center justify-center text-gray-300 border border-gray-100 italic font-serif text-2xl">
                    {owner.name.charAt(0)}
                 </div>
                 <p className="text-[11px] text-gray-500 leading-relaxed italic">{owner.description}</p>
              </div>
           </div>

           <DecisionMatrix governance={owner.governance} />

           <div className="mt-12 bg-white p-6 rounded-3xl border border-gray-100 space-y-4">
              <button className="w-full bg-black text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800">Review Full Decision Matrix</button>
              <button className="w-full border-2 border-gray-100 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50">View Legal Credentials</button>
           </div>
        </div>
      </div>
    </div>
  );
}

function LegalProfileModal({ personId, onClose }: { personId: string, onClose: () => void }) {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/legal/person/${personId}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [personId]);

  if (loading) return null;

  const { person, docs, associatedEntities } = data;

  return (
    <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-8 backdrop-blur-xl">
      <div className="bg-white rounded-[40px] w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-huge animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-3xl font-bold">Hồ sơ Pháp lý</h3>
            <p className="text-gray-500 text-sm mt-1">Chi tiết thực thể và tuân thủ định danh.</p>
          </div>
          <div className="flex space-x-4 items-center">
             <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center space-x-4">
                <AlertTriangle className="text-amber-500" size={20} />
                <div className="text-left">
                   <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest italic">Cảnh báo quan trọng</p>
                   <p className="text-[11px] text-amber-600">02 tài liệu quan trọng (CCCD, Hợp đồng) sắp hết hạn.</p>
                </div>
             </div>
             <button onClick={onClose} className="p-4 bg-white border rounded-full text-gray-400 hover:text-black transition-all shadow-sm"><X size={24} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex">
          <div className="flex-[1] p-10 bg-gray-50/30 border-r space-y-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-3xl bg-white border border-gray-200 overflow-hidden mx-auto shadow-sm mb-6">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} alt={person.name} />
              </div>
              <h4 className="text-2xl font-bold">{person.name}</h4>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Mã khách hàng: {person.cid}</p>
            </div>

            <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Ngày sinh</p>
                  <p className="text-sm font-bold">{person.dob}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Trạng thái định danh</p>
                  <p className="text-sm font-bold text-emerald-500 flex items-center"><UserCheck size={16} className="mr-2" /> Đã xác minh (KYC Lvl {person.kycLevel})</p>
                </div>
            </div>

            <div className="pt-8 border-t">
               <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-4">Thực thể liên quan</p>
               <div className="space-y-3">
                  {associatedEntities.map((ent: any) => (
                    <div key={ent.id} className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-black transition-all cursor-pointer">
                       <p className="text-sm font-bold truncate">{ent.name}</p>
                       <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">UBO / Owner</p>
                    </div>
                  ))}
                  <button className="w-full border-2 border-dashed border-gray-200 py-3 rounded-2xl text-[10px] font-bold uppercase text-gray-400 transition-all hover:bg-gray-100 cursor-copy">+ Thêm thực thể</button>
               </div>
            </div>
          </div>

          <div className="flex-[2] p-10 space-y-10">
             <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold">Danh mục tài liệu</h4>
                <div className="flex space-x-2">
                   <button className="px-4 py-2 bg-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest">Lọc theo loại</button>
                   <button className="px-4 py-2 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">Tải lên tài liệu mới</button>
                </div>
             </div>

             <section className="border border-gray-100 rounded-[32px] overflow-hidden">
                <table className="w-full text-left text-sm">
                   <thead className="bg-[#F8F9FA] text-[10px] uppercase font-bold text-gray-400">
                      <tr>
                         <th className="px-8 py-4">Tên tài liệu</th>
                         <th className="px-8 py-4">Loại</th>
                         <th className="px-8 py-4">Hết hạn</th>
                         <th className="px-8 py-4">Trạng thái</th>
                         <th className="px-8 py-4">Hành động</th>
                      </tr>
                   </thead>
                   <tbody>
                      {docs.map((doc: any) => (
                        <tr key={doc.id} className="border-t hover:bg-gray-50 transition-colors">
                           <td className="px-8 py-5">
                              <div className="flex items-center space-x-3">
                                 <FileText size={18} className="text-gray-400" />
                                 <p className="font-bold">{doc.name}</p>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-gray-500 font-medium">{doc.category}</td>
                           <td className="px-8 py-5">
                              <span className={cn(
                                "font-mono font-bold",
                                doc.status === 'Sắp hết hạn' ? "text-rose-500" : "text-gray-400"
                              )}>{doc.expiry || "—"}</span>
                           </td>
                           <td className="px-8 py-5">
                              <span className={cn(
                                "px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest",
                                doc.status === 'Đã xác minh' ? "bg-emerald-100 text-emerald-600" :
                                doc.status === 'Sắp hết hạn' ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-gray-400"
                              )}>{doc.status}</span>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex items-center space-x-4 text-gray-400">
                                 <button className="hover:text-black"><ChevronRight size={20} /></button>
                                 <button className="hover:text-black"><Download size={20} /></button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </section>

             <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                <h4 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-6">Phân tích tính tuân thủ</h4>
                <div className="flex justify-between items-end mb-4">
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Độ hoàn thiện hồ sơ</p>
                   <p className="text-xl font-bold">85%</p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                   <div className="h-full bg-black" style={{ width: '85%' }}></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 italic leading-relaxed">"Tất cả thông tin tài chính và pháp lý tại Elysium Ledger được bảo vệ bởi các tiêu chuẩn mã hóa quân sự và quy trình bảo mật đa lớp nghiêm ngặt nhất."</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewEntityForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'Holding Company',
    jurisdiction: 'Singapore',
    description: '',
    vetoName: '',
    executorNames: '',
    reviewerNames: '',
    cid: '',
    avatarSeed: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified handle
    alert("New Entity Registered into the AuditVault. Verification triggered.");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-8 backdrop-blur-md">
      <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 overflow-y-auto max-h-[90vh] shadow-huge animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-3xl font-bold">Thêm Pháp nhân mới</h3>
           <button onClick={onClose} className="p-2 text-gray-400 hover:text-black"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Tên Pháp nhân</label>
                 <input 
                   required
                   className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/5"
                   placeholder="VD: Tập đoàn Vĩnh Thịnh"
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                 />
              </div>
              <div>
                 <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">CID / UEN</label>
                 <input 
                   required
                   className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/5"
                   placeholder="VD: PB-992-X10"
                   value={formData.cid}
                   onChange={e => setFormData({...formData, cid: e.target.value})}
                 />
              </div>
           </div>

           <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Mô tả mục tiêu chiến lược</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm h-32 focus:outline-none focus:bg-white"
                placeholder="Nhập mục tiêu dài hạn..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
           </div>

           <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-6">
              <h4 className="text-xs uppercase font-bold tracking-widest text-gray-500 italic">Thiết lập Ma trận Quyết định</h4>
              
              <div>
                 <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Người phủ quyết (Veto Power)</label>
                 <input 
                   required
                   className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm"
                   placeholder="Tên đầy đủ"
                   value={formData.vetoName}
                   onChange={e => setFormData({...formData, vetoName: e.target.value})}
                 />
              </div>

              <div>
                 <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Người điều hành (Executors - Phẩy để ngăn cách)</label>
                 <input 
                   className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm"
                   placeholder="Tên 1, Tên 2..."
                   value={formData.executorNames}
                   onChange={e => setFormData({...formData, executorNames: e.target.value})}
                 />
              </div>

              <div>
                 <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Đội ngũ rà soát (Reviewers - Phẩy để ngăn cách)</label>
                 <input 
                   className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm"
                   placeholder="Tên đội ngũ..."
                   value={formData.reviewerNames}
                   onChange={e => setFormData({...formData, reviewerNames: e.target.value})}
                 />
              </div>
           </div>

           <div className="flex justify-between items-center space-x-6">
              <div className="flex items-center space-x-4 bg-gray-50 px-6 py-4 rounded-2xl flex-1 border border-gray-100">
                 <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-gray-300 italic"><Plus size={20} /></div>
                 <p className="text-[10px] font-bold uppercase tracking-widest">Tải lên hồ sơ pháp lý (PDF/Scan)</p>
              </div>
              <button 
                type="submit"
                className="px-8 py-5 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl"
              >
                Hoàn tất & Lưu trữ AuditVault
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}

function ReportCard({ title, type, status, date, warning }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border text-left hover:border-black transition-all cursor-pointer">
       <div className="flex justify-between items-start mb-6">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
             <FileCode size={20} className="text-gray-400" />
          </div>
          <span className={cn("text-[10px] font-bold uppercase px-2 py-1 rounded", warning ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600")}>{status}</span>
       </div>
       <h4 className="font-bold text-sm mb-1">{title}</h4>
       <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{type} • {date}</p>
    </div>
  );
}

function GovernanceView() {
  const { t, language } = useTranslation();
  const [showEntityModal, setShowEntityModal] = React.useState(false);
  const [selectedPersonId, setSelectedPersonId] = React.useState<string | null>(null);
  
  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <motion.div variants={cardVariants}>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Entity Manager / Governance</p>
          <h2 className="text-3xl font-bold tracking-tight">{language === 'vi' ? 'Tập đoàn Vĩnh Thịnh' : 'Vinh Thinh Group'}</h2>
          <p className="text-gray-500 text-sm mt-1">{language === 'vi' ? 'Quản lý cấu trúc pháp lý, sở hữu tầng và quyền biểu quyết (Decision Matrix).' : 'Manage legal structure, hierarchical ownership, and voting rights (Decision Matrix).'}</p>
        </motion.div>
        <motion.div variants={cardVariants} className="flex space-x-3">
          <button 
             onClick={() => setSelectedPersonId('per-001')}
             className="px-4 py-2 bg-white border border-gray-200 text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm"
          >
             {language === 'vi' ? 'Xem Hồ sơ Pháp lý' : 'View Legal Profile'}
          </button>
          <button 
             onClick={() => setShowEntityModal(true)}
             className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-sm"
          >
             {language === 'vi' ? 'Thêm Pháp nhân' : 'Add Entity'}
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showEntityModal && <NewEntityForm onClose={() => setShowEntityModal(false)} />}
        {selectedPersonId && <LegalProfileModal personId={selectedPersonId} onClose={() => setSelectedPersonId(null)} />}
      </AnimatePresence>

      <div className="grid grid-cols-12 gap-8">
        {/* Ownership Structure */}
        <motion.div variants={cardVariants} className="col-span-8 bg-white border border-[#E9ECEF] rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500">{language === 'vi' ? 'Cơ cấu thực thể sở hữu' : 'Ownership Entity Structure'}</h3>
            <span className="text-emerald-500 font-bold text-xs">{language === 'vi' ? 'Pháp lý: Đang hoạt động' : 'Status: Active'}</span>
          </div>
          
          <div className="relative border-l-2 border-black/5 ml-4 pl-12 space-y-12">
            <EntityNode name="Sterling Family Trust" role="UBO / Ultimate Parent" percent={70} type="Trust" jurisdiction="Singapore" />
            <EntityNode name="Lumina Global Ventures" role="Strategic Investor" percent={20} type="LP" jurisdiction="Cayman" />
            <EntityNode name="Management Pool" role="ESOP / Executives" percent={10} type="Pool" jurisdiction="Hong Kong" />
            
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-black rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]"></div>
          </div>
        </motion.div>

        {/* Legal Info */}
        <div className="col-span-4 space-y-8">
          <motion.section variants={cardVariants} className="bg-white border border-[#E9ECEF] rounded-2xl p-8 shadow-sm">
            <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-6">{language === 'vi' ? 'Thông tin pháp lý' : 'Legal Information'}</h3>
            <div className="space-y-6">
               <InfoItem label={language === 'vi' ? 'Ngày thành lập' : 'Founding Date'} val={language === 'vi' ? '12 Tháng 08, 2014' : 'August 12, 2014'} />
               <InfoItem label="Trụ sở đăng ký" val="Level 42, International Finance Centre, HK" />
               <InfoItem label="Mã số thuế" val="HK-992834-Z" />
               <InfoItem label="Tình trạng" val="KYC Level 3 - Đã xác minh" success />
            </div>
          </motion.section>

          <motion.section variants={cardVariants} className="bg-white border border-[#E9ECEF] rounded-2xl p-8 shadow-sm">
            <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-6">Trận ma rủi ro Hệ thống</h3>
            <div className="grid grid-cols-5 gap-1 mb-2">
               {[...Array(25)].map((_, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.02 }}
                   className={cn(
                    "aspect-square rounded-sm border border-white",
                    i === 9 ? "bg-rose-500" : i === 14 ? "bg-amber-500" : "bg-[#F1F3F5]"
                   )}
                 ></motion.div>
               ))}
            </div>
            <p className="text-[10px] text-gray-400 font-medium text-center uppercase tracking-widest mt-4">Xác suất vs Tác động</p>
          </motion.section>
        </div>
      </div>

      {/* Subsidiaries List */}
      <motion.section variants={cardVariants} className="bg-white border border-[#E9ECEF] rounded-2xl p-8 shadow-sm">
         <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-8">Danh sách tài sản trực thuộc / Công ty con</h3>
         <div className="grid grid-cols-3 gap-8">
            <SubAccount name="Horizon Tower Singapore" percent={65} aum="$420.0M" type="Real Estate" />
            <SubAccount name="Nova Fintech Solutions" percent={12.5} aum="$85.2M" type="Venture Capital" />
            <SubAccount name="Oceanic Logistics Corp" percent={100} aum="$312.8M" type="Core Ops" />
         </div>
      </motion.section>
    </motion.div>
  );
}

function EntityNode({ name, role, percent, type, jurisdiction }: { name: string, role: string, percent: number, type: string, jurisdiction: string }) {
  return (
    <div className="relative group">
      <div className="absolute -left-[54px] top-1/2 -translate-y-1/2 w-10 h-[2px] bg-black/5"></div>
      <div className="flex items-center justify-between p-6 bg-[#F8F9FA] rounded-2xl border border-transparent group-hover:border-black group-hover:bg-white transition-all">
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{role}</p>
          <h4 className="font-bold text-lg">{name}</h4>
          <div className="flex space-x-4 mt-2">
             <span className="text-[10px] bg-white px-2 py-1 rounded-md border text-gray-500 font-bold uppercase">{type}</span>
             <span className="text-[10px] bg-white px-2 py-1 rounded-md border text-gray-500 font-bold uppercase">{jurisdiction}</span>
          </div>
        </div>
        <div className="text-right">
           <p className="text-3xl font-bold tracking-tighter">{percent}%</p>
           <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Ownership</p>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, val, success }: { label: string, val: string, success?: boolean }) {
  return (
    <div>
       <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{label}</p>
       <p className={cn("text-xs font-bold leading-relaxed", success ? "text-emerald-500" : "text-black")}>{val}</p>
    </div>
  );
}

function SubAccount({ name, percent, aum, type }: { name: string, percent: number, aum: string, type: string }) {
  return (
    <div className="p-6 bg-[#F8F9FA] rounded-2xl border border-transparent hover:border-[#E9ECEF] hover:bg-white transition-all">
       <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{type}</p>
          <span className="text-xs font-bold">{percent}%</span>
       </div>
       <h4 className="font-bold text-gray-900 mb-2 truncate">{name}</h4>
       <div className="flex justify-between items-end">
          <div>
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">AUM Value</p>
             <p className="text-lg font-bold">{aum}</p>
          </div>
          <div className="flex items-end space-x-1 h-8">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="w-1.5 bg-emerald-500 rounded-full" style={{ height: `${20 + Math.random() * 80}%` }}></div>
             ))}
          </div>
       </div>
    </div>
  );
}

function VaultView() {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/admin/audit')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 animate-in">
       <div>
          <h2 className="text-3xl font-bold tracking-tight">Compliance Vault</h2>
          <p className="text-gray-500 text-sm mt-1">Lưu trữ bằng chứng pháp lý và nhật ký truy vết bất biến (Audit Trail).</p>
       </div>

       <div className="grid grid-cols-4 gap-6">
          <StatCard label="Tổng tài liệu" val="1,248" sub="+12 tháng này" />
          <StatCard label="Hợp đồng hiệu lực" val="84" sub="Verified by Legal" verified />
          <StatCard label="Dung lượng" val="14.2 GB" sub="NIST encrypted" />
          <StatCard label="Trạng thái" val="Mã hóa AES-256" sub="Active Protection" verified />
       </div>

       <section className="bg-white border border-[#E9ECEF] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
             <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500">Nhật ký thay đổi (Immutable Audit Log)</h3>
             <button className="text-[10px] bg-white border px-3 py-1.5 rounded font-bold uppercase">Export CSV/PDF</button>
          </div>
          {loading ? (
             <div className="p-12 text-center text-gray-400 text-sm">Đang tải nhật ký truy vết...</div>
          ) : (
            <table className="w-full text-left">
               <thead className="bg-[#F8F9FA] text-[10px] uppercase font-bold text-gray-400">
                  <tr>
                     <th className="px-8 py-4">Thời gian</th>
                     <th className="px-8 py-4">Tác nhân User</th>
                     <th className="px-8 py-4">Hành động</th>
                     <th className="px-8 py-4">Thực thể</th>
                     <th className="px-8 py-4">Chi tiết</th>
                  </tr>
               </thead>
               <tbody className="text-xs">
                  {logs.length === 0 ? (
                    <AuditRow time="Just now" user="System" action="GENESIS" entity="System" detail="Hệ thống khởi tạo thành công" />
                  ) : (
                    logs.map((log: any) => (
                      <AuditRow 
                        key={log.id}
                        time={new Date(log.timestamp).toLocaleTimeString()}
                        user={log.userId === 'user-001' ? 'Lê Minh Anh (Admin)' : log.userId}
                        action={log.action}
                        entity={log.entity}
                        detail={log.details}
                        critical={log.critical}
                      />
                    ))
                  )}
               </tbody>
            </table>
          )}
       </section>
    </div>
  );
}

function AuditRow({ time, user, action, entity, detail, critical }: any) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
       <td className="px-8 py-4 text-gray-500">{time}</td>
       <td className="px-8 py-4 font-bold">{user}</td>
       <td className="px-8 py-4">
          <span className={cn(
            "px-2 py-1 rounded text-[10px] font-bold",
            critical ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
          )}>{action}</span>
       </td>
       <td className="px-8 py-4 font-medium">{entity}</td>
       <td className="px-8 py-4 text-gray-600">{detail}</td>
    </tr>
  );
}

function NavItem({ active, icon, label, onClick, collapsed }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void, collapsed: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-4 py-3 rounded-xl transition-all relative group",
        active ? "bg-black text-white shadow-lg shadow-black/10" : "text-gray-500 hover:bg-gray-100/80"
      )}
    >
      <div className={cn("min-w-[20px] flex justify-center z-10", active ? "text-white" : "text-gray-400 group-hover:text-black transition-colors")}>
        {icon}
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="ml-4 text-xs font-bold uppercase tracking-widest z-10 whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {active && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-black rounded-xl"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
    </button>
  );
}

function DashboardView() {
  const { t, language } = useTranslation();
  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-12 gap-8"
    >
      {/* Left Column */}
      <div className="col-span-8 space-y-8">
        <motion.section 
          variants={cardVariants}
          className="bg-white rounded-2xl p-8 border border-[#E9ECEF] shadow-sm relative overflow-hidden"
        >
          <div className="relative z-10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">{t('totalAssets')}</p>
            <div className="flex items-baseline space-x-4">
              <h2 className="text-5xl font-bold tracking-tight">
                <Counter value={4280500.00} prefix="$" decimals={2} />
              </h2>
              <span className="flex items-center text-emerald-500 font-bold text-sm">
                <TrendingUp size={16} className="mr-1" /> +12.4%
              </span>
            </div>
          </div>
          
          <div className="h-48 mt-8 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AUM_HISTORY}>
                <XAxis dataKey="month" hide />
                <Tooltip cursor={{ fill: 'transparent' }} content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-black text-white text-[10px] p-2 rounded shadow-xl uppercase font-bold">
                        {payload[0].value.toLocaleString()}
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 4, 4]} 
                  fill="#F1F3F5"
                >
                  {AUM_HISTORY.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === AUM_HISTORY.length - 1 ? '#000000' : '#F1F3F5'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section 
          variants={cardVariants}
          className="bg-white rounded-2xl pb-8 border border-[#E9ECEF] shadow-sm"
        >
          <div className="p-8 pb-4 flex justify-between items-center text-sm font-bold">
            <h3 className="uppercase tracking-widest text-[11px] text-gray-400">{t('topPerformers')}</h3>
            <button className="flex items-center text-black hover:underline">{t('viewAll')} <ChevronRight size={14} className="ml-1" /></button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-[#F8F9FA]">
                <th className="px-8 py-4 font-bold">{t('asset')}</th>
                <th className="px-8 py-4 font-bold">{t('value')}</th>
                <th className="px-8 py-4 font-bold">{t('performanceYtd')}</th>
                <th className="px-8 py-4 font-bold">{t('managedBy')}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <AssetRow name="Villa Vinhome Riverside" desc={t('realEstate')} val="$1,250,000" perf="+18.5%" manager="Minh Hoàng" />
              <AssetRow name="Cổ phần Tech Start-up A" desc={t('privateEquity')} val="$840,000" perf="+24.2%" manager="Anh Nguyễn" />
              <AssetRow name="Bộ sưu tập đồng hồ Patek" desc="Tài sản xa xỉ" val="$420,000" perf="+8.1%" manager="Lê Tú" />
              <AssetRow name="Đất nền Long Thành" desc="Đầu tư dài hạn" val="$710,000" perf="+5.4%" manager="Minh Hoàng" />
            </tbody>
          </table>
        </motion.section>

        <div className="grid grid-cols-3 gap-6">
          <StatCard label={t('nextMeeting')} val={language === 'vi' ? "14:30 - Ngày mai" : "14:30 - Tomorrow"} sub={t('meetingRoom') + " Lotus"} />
          <StatCard label={language === 'vi' ? "Tình trạng tài sản" : "Asset Status"} val={language === 'vi' ? "98.2% Đã xác thực" : "98.2% Verified"} sub="Asset Traceability Score" verified />
          <motion.div 
            variants={cardVariants}
            className="bg-white p-6 rounded-2xl border border-[#E9ECEF] shadow-sm flex flex-col justify-center group hover:border-black transition-all"
          >
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2 italic">{t('messageFromPartner')}</p>
             <p className="text-[11px] font-medium leading-relaxed italic">"{t('partnerNote')}"</p>
          </motion.div>
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-4 space-y-8">
        <motion.section 
          variants={cardVariants}
          className="bg-white rounded-2xl p-8 border border-[#E9ECEF] shadow-sm"
        >
          <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-6">{t('riskIndexTitle')}</h3>
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-[#F1F3F5] rounded-full flex overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '33%' }}
                transition={{ ...motionSettings, delay: 0.2 }}
                className="h-full bg-emerald-500"
              ></motion.div>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '33%' }}
                transition={{ ...motionSettings, delay: 0.3 }}
                className="h-full bg-amber-500"
              ></motion.div>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '34%' }}
                transition={{ ...motionSettings, delay: 0.4 }}
                className="h-full bg-rose-500"
              ></motion.div>
            </div>
            <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span>{t('safe')}</span>
              <span className="text-amber-500">{t('moderate')}</span>
              <span>{t('risky')}</span>
            </div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 flex items-center bg-amber-50 px-4 py-2 rounded-lg border border-amber-100"
            >
               <AlertTriangle className="text-amber-500 mr-2" size={16} />
               <span className="text-amber-700 text-xs font-bold uppercase font-sans">Neutral Exposure</span>
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          variants={cardVariants}
          className="bg-white rounded-2xl p-8 border border-[#E9ECEF] shadow-sm"
        >
          <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-6">{t('allocationTitle')}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ALLOCATION_DATA}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ALLOCATION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-6">
            {ALLOCATION_DATA.map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-medium text-gray-600">
                    {item.name === 'Bất động sản' ? t('realEstate') : 
                     item.name === 'Cổ phần (Private Equity)' ? t('privateEquity') : 
                     t('cashEquivalent')}
                  </span>
                </div>
                <span className="text-xs font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          variants={cardVariants}
          className="bg-black text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-6 text-xs uppercase font-bold tracking-widest text-gray-500">
            <h3>Dòng tiền 6 tháng (Cashflow)</h3>
            <span className="text-emerald-400 flex items-center"><TrendingUp size={14} className="mr-1" /> +5.2%</span>
          </div>
          <div className="mb-8">
            <h4 className="text-3xl font-bold tracking-tight mb-4">$145,200</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-500 uppercase font-bold">Tổng thu (Inflow)</span>
                <span className="text-emerald-400 font-bold">$320K</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '70%' }}
                   transition={{ duration: 0.8, ease: "easeOut" }}
                   className="h-full bg-emerald-400"
                 ></motion.div>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-500 uppercase font-bold">Tổng chi (Outflow)</span>
                <span className="text-rose-400 font-bold">$175K</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '45%' }}
                   transition={{ duration: 0.8, ease: "easeOut" }}
                   className="h-full bg-rose-400"
                 ></motion.div>
              </div>
            </div>
          </div>
          <button className="w-full bg-white text-black py-4 rounded-xl text-xs uppercase font-bold tracking-widest hover:bg-gray-100 transition-colors">Báo cáo chi tiết</button>
        </motion.section>
      </div>
    </motion.div>
  );
}

function AssetRow({ name, desc, val, perf, manager }: { name: string, desc: string, val: string, perf: string, manager: string }) {
  return (
    <motion.tr 
      variants={cardVariants}
      className="border-b border-[#F8F9FA] hover:bg-[#F8F9FA] transition-colors group cursor-pointer"
    >
      <td className="px-8 py-5">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-white transition-colors">
            <Briefcase size={18} className="text-gray-400" />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-none mb-1">{name}</p>
            <p className="text-[10px] text-gray-400 font-medium">{desc}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5 font-bold tracking-tight">{val}</td>
      <td className="px-8 py-5">
        <span className="text-emerald-500 font-bold text-xs">{perf}</span>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-slate-200"></div>
          <span className="text-xs font-medium text-gray-600">{manager}</span>
        </div>
      </td>
    </motion.tr>
  );
}

function StatCard({ label, val, sub, verified }: { label: string, val: string, sub: string, verified?: boolean }) {
  return (
    <motion.div 
      variants={cardVariants}
      className="bg-white p-6 rounded-2xl border border-[#E9ECEF] shadow-sm group hover:border-black transition-all"
    >
      <div className="flex items-center mb-2">
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{label}</p>
        {verified && <CheckCircle2 size={12} className="ml-2 text-emerald-500" />}
      </div>
      <h4 className="text-lg font-bold mb-1">{val}</h4>
      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">{sub}</p>
    </motion.div>
  );
}

function Counter({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1000;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setDisplayValue(progress * value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <span>{prefix}{displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
  );
}

function PortfolioView() {
  const { t, language } = useTranslation();
  const [showAssetModal, setShowAssetModal] = React.useState(false);
  const [selectedAssetId, setSelectedAssetId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', value: '', category: 'Real Estate', ownerId: 'ent-001' });
  const [localAssets, setLocalAssets] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/assets')
      .then(res => res.json())
      .then(d => setLocalAssets(d.data));
  }, []);

  const handleAcquire = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, value: Number(formData.value) })
      });
      if (res.ok) {
        setShowAssetModal(false);
        const newAssetData = await res.json();
        setLocalAssets([...localAssets, newAssetData]);
        alert(language === 'vi' ? "Yêu cầu mua tài sản đã được gửi và đang chờ phê duyệt." : "Asset acquisition request submitted and pending approval.");
      } else {
        const err = await res.json();
        alert(`${language === 'vi' ? 'Lỗi' : 'Error'}: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('portfolioTitle')}</h2>
            <p className="text-gray-500 text-sm mt-1">{t('portfolioDesc')}</p>
          </div>
          <div className="flex space-x-3">
             <button className="px-4 py-2 bg-white border border-[#E9ECEF] rounded-lg text-sm font-semibold flex items-center hover:bg-gray-50"><Download size={16} className="mr-2" /> {t('exportReport')}</button>
             <button 
                onClick={() => setShowAssetModal(true)}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold flex items-center hover:bg-opacity-90 transition-all shadow-sm"
             >
                <Plus size={16} className="mr-2" /> {t('addNewAsset')}
             </button>
          </div>
        </div>

        {showAssetModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold">{t('acquisitionTitle')}</h3>
                   <button onClick={() => setShowAssetModal(false)} className="text-gray-400 hover:text-black"><X size={20} /></button>
                </div>
                <form onSubmit={handleAcquire} className="space-y-4">
                   <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">{t('assetName')}</label>
                      <input 
                        required 
                        className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5" 
                        placeholder={language === 'vi' ? "VD: Diamond Heights Villa" : "e.g. Diamond Heights Villa"}
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">{t('assetType')}</label>
                         <select 
                           className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                           value={formData.category}
                           onChange={e => setFormData({...formData, category: e.target.value})}
                         >
                            <option>Real Estate</option>
                            <option>Private Equity</option>
                            <option>Crypto</option>
                            <option>Luxury Goods</option>
                         </select>
                      </div>
                      <div>
                         <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">{t('assetValue')}</label>
                         <input 
                           required 
                           type="number"
                           className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" 
                           placeholder="0"
                           value={formData.value}
                           onChange={e => setFormData({...formData, value: e.target.value})}
                         />
                      </div>
                   </div>
                   <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">{t('ownerEntity')}</label>
                      <select 
                        className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                        value={formData.ownerId}
                        onChange={e => setFormData({...formData, ownerId: e.target.value})}
                      >
                         <option value="ent-001">Sterling Family Trust</option>
                         <option value="ent-002">Grand Horizon Capital</option>
                         <option value="ent-003">Lumina Global Ventures</option>
                      </select>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-bold tracking-widest mb-1">{t('complianceProcess')}</p>
                      <p className="text-[10px] text-gray-400 leading-relaxed italic">{t('complianceInfo')}</p>
                   </div>
                   <button 
                     disabled={loading}
                     className="w-full bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs mt-4 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                   >
                      {loading ? t('processing') : t('confirmAcquisition')}
                   </button>
                </form>
             </div>
          </div>
        )}

        {selectedAssetId && <AssetDetailModal assetId={selectedAssetId} onClose={() => setSelectedAssetId(null)} />}

        <section className="bg-white p-8 rounded-2xl border border-[#E9ECEF] flex items-center justify-between">
           <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{t('totalCurrentValue')}</p>
              <h3 className="text-4xl font-bold">124.850.000.000 <span className="text-sm font-medium text-gray-400 uppercase">VND</span></h3>
           </div>
           <div className="flex space-x-12">
              <div>
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{t('growthRate')}</p>
                 <p className="text-emerald-500 font-bold text-xl">+12.4% <TrendingUp size={16} className="inline ml-1" /></p>
              </div>
              <div>
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{t('annualProfit')}</p>
                 <p className="text-black font-bold text-xl">+15.200.000.000 VND</p>
              </div>
           </div>
        </section>

        {/* Filters */}
        <div className="flex space-x-4 overflow-x-auto pb-2">
           <FilterDropdown label="Loại tài sản" value="Tất cả" />
           <FilterDropdown label="Trạng thái" value="Đang hoạt động" />
           <FilterDropdown label="Người sở hữu" value="Gia tộc Lê" />
        </div>

        {/* List */}
        <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-[#F8F9FA] text-[10px] uppercase font-bold text-gray-400 border-b">
                 <tr>
                    <th className="px-8 py-5">Tài sản</th>
                    <th className="px-8 py-5">Phân loại</th>
                    <th className="px-8 py-5 text-right">Giá trị hiện tại</th>
                    <th className="px-8 py-5">Tăng trưởng</th>
                    <th className="px-8 py-5">Trạng thái</th>
                 </tr>
              </thead>
              <tbody>
                 {localAssets.map((asset: any) => (
                   <tr key={asset.id} onClick={() => setSelectedAssetId(asset.id)} className="border-b hover:bg-gray-50 transition-colors cursor-pointer group">
                      <td className="px-8 py-6">
                         <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white transition-all"><Briefcase size={20} /></div>
                            <div>
                               <p className="font-bold text-gray-900 leading-none mb-1">{asset.name}</p>
                               <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{asset.id}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-gray-600">{asset.category}</td>
                      <td className="px-8 py-6 text-right font-bold text-sm tracking-tight">{asset.value.toLocaleString()} <span className="text-[10px] text-gray-400 ml-1">VND</span></td>
                      <td className="px-8 py-6">
                         <span className={cn(
                           "text-xs font-bold",
                           asset.performance >= 0 ? "text-emerald-500" : "text-rose-500"
                         )}>{asset.performance > 0 ? `+${asset.performance}%` : `${asset.performance}%`}</span>
                      </td>
                      <td className="px-8 py-6">
                         <span className={cn(
                           "px-2 py-1 rounded text-[10px] font-bold uppercase",
                           asset.risk === 'Low' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                         )}>{asset.risk === 'Low' ? 'Ổn định' : 'Biến động'}</span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
     </div>
  );
}

function PortfolioItem({ name, type, val, perf, status, negative }: { name: string, type: string, val: string, perf: string, status: string, negative?: boolean }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E9ECEF] flex items-center hover:shadow-md transition-shadow group cursor-pointer">
       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mr-6">
          <Briefcase size={24} className="text-gray-400" />
       </div>
       <div className="flex-1 grid grid-cols-4 gap-8">
          <div>
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{type}</p>
             <p className="font-bold">{name}</p>
          </div>
          <div>
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Giá trị hiện tại</p>
             <p className="font-bold">{val} <span className="text-[10px]">VND</span></p>
          </div>
          <div>
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Tăng trưởng (YTD)</p>
             <p className={cn("font-bold text-lg", negative ? "text-rose-500" : "text-emerald-500")}>{perf}</p>
          </div>
          <div>
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Trạng thái</p>
             <span className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase", status === "Bình lợi" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500")}>{status}</span>
          </div>
       </div>
    </div>
  );
}

function FilterDropdown({ label, value }: { label: string, value: string }) {
  return (
    <button className="px-4 py-2 bg-white border border-[#E9ECEF] rounded-lg text-xs font-bold flex items-center">
       <span className="text-gray-400 mr-2 uppercase tracking-widest">{label}:</span>
       <span>{value}</span>
    </button>
  );
}

function EmployeeProfileModal({ employee, onClose }: { employee: any, onClose: () => void }) {
  const [activeTab, setActiveTab] = React.useState('Tổng quan');
  const [payments, setPayments] = React.useState<any[]>([]);
  const [commissions, setCommissions] = React.useState<any[]>([]);
  const [payroll, setPayroll] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [payRes, comRes, prRes] = await Promise.all([
          fetch(`/api/finance/payments/${employee.id}`),
          fetch(`/api/finance/commissions/${employee.id}`),
          fetch(`/api/finance/payroll/${employee.id}`)
        ]);
        const [payData, comData, prData] = await Promise.all([
          payRes.json(),
          comRes.json(),
          prRes.json()
        ]);
        setPayments(payData);
        setCommissions(comData);
        setPayroll(prData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [employee.id]);

  const tabs = [
    "Tổng quan", "Giấy tờ", "Phân quyền", "Project", "Lịch sử hoạt động", "Lịch sử thanh toán", "Commission"
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Tổng quan':
        return (
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Thông tin cơ bản</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Ngày sinh:</strong> 12/05/1992</p>
                  <p><strong>Giới tính:</strong> Nam</p>
                  <p><strong>Email:</strong> {employee.email}</p>
                  <p><strong>Phone:</strong> {employee.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4 italic">Snapshot Định danh</p>
                <div className="flex items-center space-x-4">
                   <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-300"><FileText size={24} /></div>
                   <div className="text-xs">
                     <p className="font-bold">CCCD: {employee.cccd}</p>
                     <p className="text-emerald-600 font-bold mt-1">Verified: NIST AES-256</p>
                   </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Total Payout</p>
                 <p className="text-xl font-bold">1.2B <span className="text-xs">đ</span></p>
               </div>
               <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Commission</p>
                 <p className="text-xl font-bold">450M <span className="text-xs">đ</span></p>
               </div>
               <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Performance</p>
                 <p className="text-xl font-bold text-emerald-600">{employee.performance}%</p>
               </div>
               <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Status</p>
                 <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-600 rounded uppercase">{employee.status}</span>
               </div>
            </div>
          </div>
        );
      case 'Lịch sử thanh toán':
        return (
          <div className="space-y-4">
             <div className="flex justify-between items-center bg-black text-white p-6 rounded-2xl">
                <div>
                   <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Unpaid Balance</p>
                   <h4 className="text-2xl font-bold">15,000,000 <span className="text-sm font-normal text-gray-400">VND</span></h4>
                </div>
                <button className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-100">Review Batch</button>
             </div>
             
             <section className="bg-white border rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                   <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
                      <tr>
                         <th className="px-6 py-4">TXN ID</th>
                         <th className="px-6 py-4">Type</th>
                         <th className="px-6 py-4">Amount</th>
                         <th className="px-6 py-4">Period</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Method</th>
                      </tr>
                   </thead>
                   <tbody>
                      {payments.map(p => (
                        <tr key={p.id} className="border-t hover:bg-gray-50">
                           <td className="px-6 py-4 font-mono">{p.id}</td>
                           <td className="px-6 py-4 font-bold">{p.type}</td>
                           <td className="px-6 py-4 font-bold">{p.amount.toLocaleString()}</td>
                           <td className="px-6 py-4">{p.period}</td>
                           <td className="px-6 py-4">
                              <span className={cn(
                                "px-2 py-1 rounded text-[10px] font-bold",
                                p.status === 'PAID' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                              )}>{p.status}</span>
                           </td>
                           <td className="px-6 py-4 text-gray-400">{p.method}</td>
                        </tr>
                      ))}
                      {payments.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-gray-400">No payment transaction records found.</td></tr>}
                   </tbody>
                </table>
             </section>
          </div>
        );
      case 'Commission':
        return (
          <div className="space-y-4">
             <section className="bg-white border rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                   <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
                      <tr>
                         <th className="px-6 py-4">Project</th>
                         <th className="px-6 py-4">Revenue</th>
                         <th className="px-6 py-4">Rate (%)</th>
                         <th className="px-6 py-4">Commission</th>
                         <th className="px-6 py-4">Calculated At</th>
                         <th className="px-6 py-4">Status</th>
                      </tr>
                   </thead>
                   <tbody>
                      {commissions.map(c => (
                        <tr key={c.id} className="border-t hover:bg-gray-50">
                           <td className="px-6 py-4 font-bold">{c.projectId}</td>
                           <td className="px-6 py-4">{c.revenue.toLocaleString()}</td>
                           <td className="px-6 py-4">{c.percentage}%</td>
                           <td className="px-6 py-4 font-bold text-emerald-600">{c.amount.toLocaleString()}</td>
                           <td className="px-6 py-4 text-gray-400">{c.calculatedAt}</td>
                           <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded text-[10px] font-bold">{c.status}</span>
                           </td>
                        </tr>
                      ))}
                      {commissions.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-gray-400">No commission records found.</td></tr>}
                   </tbody>
                </table>
             </section>
          </div>
        );
      case 'Giấy tờ':
        return (
          <div className="grid grid-cols-3 gap-6">
            {[
              { name: "CCCD / Passport", status: "Verified", date: "10/05/2026" },
              { name: "Hợp đồng Lao động", status: "Signed", date: "11/05/2026" },
              { name: "NDA & IP Assignment", status: "Signed", date: "11/05/2026" },
              { name: "Bằng cấp / Chứng chỉ", status: "Reviewing", date: "12/05/2026" }
            ].map((doc, idx) => (
              <div key={idx} className="bg-white border rounded-2xl p-6 hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 mb-4 group-hover:text-black group-hover:bg-gray-100"><FileText size={20} /></div>
                <h5 className="text-xs font-bold mb-1">{doc.name}</h5>
                <p className="text-[10px] text-gray-400 mb-3 italic">{doc.date}</p>
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest",
                  doc.status === 'Verified' ? "bg-emerald-100 text-emerald-600" : 
                  doc.status === 'Signed' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                )}>{doc.status}</span>
              </div>
            ))}
            <button className="border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center p-6 hover:bg-gray-50 transition-all text-gray-300">
               <Plus size={24} />
               <p className="text-[10px] font-bold mt-2 uppercase tracking-widest">Add Document</p>
            </button>
          </div>
        );
      case 'Lịch sử hoạt động':
        return (
          <div className="space-y-6">
            {[
              { type: 'LOGIN', time: '10:15 - May 12, 2026', ip: '192.168.1.45', device: 'Chrome / MacOS', status: 'Success' },
              { type: 'DOCUMENT_UPLOAD', time: '14:20 - May 11, 2026', meta: 'Hợp đồng Lao động.pdf', status: 'Verified' },
              { type: 'PAYMENT_RECEIVE', time: '09:00 - May 05, 2026', amount: '12,000,000 đ', status: 'Paid' },
              { type: 'ROLE_UPDATE', time: '16:00 - May 01, 2026', by: 'Admin (system)', status: 'Approved' }
            ].map((log, idx) => (
              <div key={idx} className="flex space-x-6 relative pb-6 last:pb-0">
                <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-100 last:hidden"></div>
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 z-10 shrink-0">
                   <Clock size={14} />
                </div>
                <div className="flex-1 pt-1">
                   <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest">{log.type}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{log.time}</p>
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded">{log.status}</span>
                   </div>
                   <div className="mt-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                      <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                        {log.device || log.meta || log.amount || `Updated by ${log.by}`}
                        {log.ip && ` • IP: ${log.ip}`}
                      </p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <div className="p-12 text-center text-gray-400 italic">Module UI for "{activeTab}" is under migration to AuditVault v2.</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-8 backdrop-blur-xl">
      <div className="bg-white rounded-[40px] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-huge animate-in zoom-in-95 duration-300">
         <div className="p-10 border-b flex justify-between items-center">
            <div className="flex items-center space-x-6">
               <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden ring-4 ring-gray-50">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`} alt={employee.name} />
               </div>
               <div>
                  <h3 className="text-3xl font-bold">{employee.name}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                     <p className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">{employee.role} • {employee.id}</p>
                     <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                     <p className="text-emerald-500 font-bold uppercase tracking-widest text-[10px] flex items-center"><ShieldCheck size={12} className="mr-1" /> Governance Certified</p>
                  </div>
               </div>
            </div>
            <button onClick={onClose} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-all"><X size={24} /></button>
         </div>

         <div className="flex border-b px-10 overflow-x-auto scrollbar-hide bg-gray-50/50">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-5 text-[10px] font-bold uppercase tracking-widest transition-all relative min-w-max",
                  activeTab === tab ? "text-black" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
              </button>
            ))}
         </div>

         <div className="flex-1 overflow-y-auto p-10">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium italic animate-pulse">Synchronizing financial records...</div>
            ) : (
              renderTabContent()
            )}
         </div>

         <div className="p-8 border-t bg-gray-50 flex justify-between items-center">
            <p className="text-[10px] text-gray-400 font-medium italic">Immutable history protected by server-side audit logs. All financial views are tracked.</p>
            <div className="flex space-x-3">
               <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100">Export Payout History</button>
               <button className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-100">Terminate Access</button>
            </div>
         </div>
      </div>
    </div>
  );
}

function NewEmployeeModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    position: '',
    name: '',
    dob: '',
    gender: 'Nam',
    phone: '',
    email: '',
    address: '',
    nationality: 'Việt Nam',
    cccd: '',
    cccdDate: '',
    cccdPlace: '',
    employeeId: '',
    deptId: 'dept-001',
    managerId: 'tm-001',
    joinedAt: new Date().toISOString().split('T')[0],
    workType: 'Full-time',
    salary: '',
    commission: '',
    bankAccount: '',
    kycReady: false,
    ndaSigned: false
  });

  const steps = [
    { id: 1, title: "Vị trí" },
    { id: 2, title: "Cá nhân" },
    { id: 3, title: "Định danh" },
    { id: 4, title: "Công việc" },
    { id: 5, title: "Tài chính & Pháp lý" }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hr/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salary: Number(formData.salary),
          commission: Number(formData.commission)
        })
      });
      if (res.ok) {
        alert("Nhân sự mới đã được tạo thành công.");
        onClose();
        window.location.reload();
      } else {
        const err = await res.json();
        alert(`Lỗi: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="grid grid-cols-1 gap-4">
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest text-center">Chọn vị trí ứng tuyển</label>
            {[
              { id: 'Quản lý', icon: <Users size={24} />, desc: "Quản lý team, approve workflow, xem report team." },
              { id: 'Chuyên viên', icon: <UserCheck size={24} />, desc: "Xử lý nghiệp vụ, quản lý khách hàng, project assigned." },
              { id: 'CTV', icon: <UserRound size={24} />, desc: "Quyền giới hạn, chỉ xem task được giao." }
            ].map(pos => (
              <button 
                key={pos.id}
                onClick={() => { setFormData({...formData, position: pos.id}); setStep(2); }}
                className={cn(
                  "p-6 rounded-2xl border-2 text-left transition-all hover:border-black",
                  formData.position === pos.id ? "border-black bg-gray-50" : "border-gray-100"
                )}
              >
                <div className="flex items-center mb-2">
                  <div className="mr-4 p-3 bg-white rounded-xl shadow-sm">{pos.icon}</div>
                  <p className="font-bold">{pos.id}</p>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{pos.desc}</p>
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Họ và tên</label>
                <input required className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="Nguyễn Văn A" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Ngày sinh</label>
                <input type="date" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Số điện thoại</label>
                <input className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="090..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Email</label>
                <input type="email" required className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="email@elysium.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Địa chỉ thường trú</label>
              <input className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="Số nhà, đường, phường..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Số CCCD / Passport</label>
              <input required className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="037..." value={formData.cccd} onChange={e => setFormData({...formData, cccd: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Ngày cấp</label>
                <input type="date" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" value={formData.cccdDate} onChange={e => setFormData({...formData, cccdDate: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Nơi cấp</label>
                <input className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="Cục Cảnh sát..." value={formData.cccdPlace} onChange={e => setFormData({...formData, cccdPlace: e.target.value})} />
              </div>
            </div>
            <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center bg-gray-50">
               <Download size={24} className="mx-auto text-gray-300 mb-2" />
               <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Upload CCCD & Ảnh chân dung</p>
               <p className="text-[10px] text-gray-400 mt-1 italic">Kéo thả file vào đây để hệ thống tự động nhận diện (OCR)</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Mã nhân viên</label>
                <input className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="EMP-001" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Phòng ban</label>
                <select className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" value={formData.deptId} onChange={e => setFormData({...formData, deptId: e.target.value})}>
                  <option value="dept-001">Asset Management</option>
                  <option value="dept-002">Compliance & Risk</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Người quản lý trực tiếp</label>
              <select className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})}>
                <option value="tm-001">Lê Minh Anh</option>
                <option value="tm-003">Phạm Thảo Vy</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Ngày vào làm</label>
                <input type="date" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" value={formData.joinedAt} onChange={e => setFormData({...formData, joinedAt: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Hình thức</label>
                <select className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" value={formData.workType} onChange={e => setFormData({...formData, workType: e.target.value})}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contractor</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Lương cơ bản</label>
                <input type="number" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-widest">Commission (%)</label>
                <input type="number" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" value={formData.commission} onChange={e => setFormData({...formData, commission: e.target.value})} />
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={formData.ndaSigned} onChange={e => setFormData({...formData, ndaSigned: e.target.checked})} className="w-4 h-4 rounded text-black focus:ring-black" />
                <span className="text-sm font-medium">Đã ký NDA & Hợp đồng lao động</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={formData.kycReady} onChange={e => setFormData({...formData, kycReady: e.target.checked})} className="w-4 h-4 rounded text-black focus:ring-black" />
                <span className="text-sm font-medium text-emerald-600">Hồ sơ đã sẵn sàng cho KYC Verification</span>
              </label>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-huge animate-in zoom-in-95 duration-300">
         <div className="flex justify-between items-center mb-8">
            <div>
               <h3 className="text-2xl font-bold">Thêm Nhân sự mới</h3>
               <p className="text-gray-400 text-xs mt-1">Giai đoạn Onboarding: Bước {step} / 5</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-all"><X size={20} /></button>
         </div>

         <div className="flex justify-between mb-10 overflow-x-auto pb-4 scrollbar-hide">
            {steps.map(s => (
              <div key={s.id} className={cn(
                "flex items-center space-x-3 min-w-max",
                step === s.id ? "opacity-100" : "opacity-40"
              )}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", step >= s.id ? "bg-black text-white" : "bg-gray-100 text-gray-400")}>{s.id}</div>
                <span className="text-[10px] uppercase font-bold tracking-widest">{s.title}</span>
                {s.id < 5 && <div className="w-4 h-px bg-gray-200 mx-2" />}
              </div>
            ))}
         </div>

         <div className="min-h-[300px]">
          {renderStep()}
         </div>

         <div className="flex justify-between mt-10">
            <button 
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
            >
              Quay lại
            </button>
            {step < 5 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="px-8 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-colors"
              >
                Tiếp theo
              </button>
            ) : (
              <button 
                disabled={loading}
                onClick={handleSubmit}
                className="px-12 py-4 bg-emerald-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-colors"
              >
                {loading ? "Đang xử lý..." : "Xác nhận & Khởi tạo"}
              </button>
            )}
         </div>
      </div>
    </div>
  );
}

function TeamView() {
  const { t, language } = useTranslation();
  const [team, setTeam] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/hr/team')
      .then(res => res.json())
      .then(data => {
        setTeam(data);
        setLoading(false);
      });
  }, []);

  const handleTerminate = async (id: string, name: string) => {
    if (!confirm(language === 'vi' ? `Xác nhận ngắt kết nối và thu hồi toàn bộ quyền truy cập của ${name}?` : `Confirm termination and revoke all access for ${name}?`)) return;
    
    const res = await fetch('/api/hr/terminate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: id })
    });

    if (res.ok) {
      setTeam(team.map(t => t.id === id ? { ...t, status: 'TERMINATED' } : t));
    }
  };

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
       <div className="flex justify-between items-end">
           <motion.div variants={cardVariants}>
              <h2 className="text-3xl font-bold tracking-tight">{t('teamTitle')}</h2>
              <p className="text-gray-500 text-sm mt-1">{t('teamDesc')}</p>
           </motion.div>
           <motion.div variants={cardVariants} className="flex items-center space-x-4">
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus size={16} className="mr-2" /> {t('addMember')}
              </button>
              <div className="flex bg-white p-6 rounded-2xl border border-[#E9ECEF] space-x-12 shadow-sm">
                 <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{t('totalStaff')}</p>
                    <p className="text-2xl font-bold">
                      <Counter value={team.filter(t => t.status === 'ACTIVE').length + 21} />
                    </p>
                 </div>
                 <div className="border-l pl-12 border-[#E9ECEF]">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Dự báo Compliance</p>
                    <p className="text-2xl font-bold">1.4B <span className="text-sm">đ</span></p>
                 </div>
              </div>
           </motion.div>
        </div>

        <AnimatePresence>
          {showAddModal && <NewEmployeeModal onClose={() => setShowAddModal(false)} />}
          {selectedEmployee && <EmployeeProfileModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
        </AnimatePresence>

        <motion.section variants={cardVariants} className="bg-white p-8 rounded-2xl border border-[#E9ECEF] shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500">Hiệu suất Đội ngũ</h3>
              <span className="text-emerald-500 text-xs font-bold">+12.4% vs T1</span>
           </div>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={AUM_HISTORY}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#ADB5BD' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#F1F3F5">
                       {AUM_HISTORY.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index === 5 ? '#000000' : '#ADB5BD'} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </motion.section>

        <div className="grid grid-cols-12 gap-8">
           <div className="col-span-4 space-y-4">
              {team.map((t: any) => (
                <TeamMemberCard 
                  key={t.id}
                  name={t.name} 
                  role={t.role} 
                  perf={t.performance || 0} 
                  active={selectedEmployee?.id === t.id}
                  onClick={() => setSelectedEmployee(t)}
                />
              ))}
              {!loading && team.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-xs italic">No team members active.</div>
              )}
           </div>
           <motion.div variants={cardVariants} className="col-span-8 bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-sm">
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Hồ sơ chi tiết</p>
                    <h3 className="text-2xl font-bold">{selectedEmployee?.name || team[0]?.name || "Select Employee"}</h3>
                    <div className="flex text-amber-400 mt-1">
                       {[1,2,3,4,5].map(i => <Plus size={12} key={i} fill="currentColor" />)}
                    </div>
                 </div>
                 <div className="flex space-x-2">
                   {selectedEmployee && (
                    <button 
                      onClick={() => setSelectedEmployee({...selectedEmployee})} 
                      className="text-[10px] uppercase font-bold tracking-widest bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Thông tin tài chính
                    </button>
                   )}
                   <button className="text-[10px] uppercase font-bold tracking-widest bg-gray-100 px-4 py-2 rounded-lg">Xếp hạng Hiệu suất</button>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                 <div className="space-y-4">
                    <p className="text-[10px] text-gray-400 mb-2 uppercase font-bold tracking-widest">Tài sản đang quản lý</p>
                    <AssetMini name="Elysium Diamond Tower" val={(selectedEmployee || team[0])?.aum || "0 đ"} />
                    <AssetMini name="Villas at Central Park" val="8.2B đ" />
                    <AssetMini name="Luxury Suite Collection" val="4.1B đ" />
                 </div>
                 <div className="bg-[#F8F9FA] p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                       <p className="text-[10px] text-gray-400 mb-4 uppercase font-bold tracking-widest">Mục tiêu doanh thu</p>
                       <p className="text-3xl font-bold">{(selectedEmployee || team[0])?.target || "0B"} <span className="text-sm">đ</span> <span className="text-xs font-medium text-gray-400">/ 25B đ</span></p>
                       <div className="w-full h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
                          <div className="h-full bg-black" style={{ width: `${(selectedEmployee || team[0])?.performance || 0}%` }}></div>
                       </div>
                    </div>
                    <p className="text-[10px] text-gray-500 italic mt-4">"{(selectedEmployee || team[0])?.name || "Member"} đang duy trì phong độ ổn định."</p>
                 </div>
              </div>
           </motion.div>
        </div>
    </motion.div>
  );
}

function TeamMemberCard({ name, role, perf, active, onClick }: { name: string, role: string, perf: number, active?: boolean, onClick?: () => void, key?: any }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-6 rounded-2xl border transition-all cursor-pointer",
        active ? "bg-white border-black shadow-lg" : "bg-[#F8F9FA] border-transparent hover:bg-white hover:border-[#E9ECEF]"
      )}
    >
       <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 mr-4 overflow-hidden">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt={name} />
          </div>
          <div>
             <p className="font-bold text-sm">{name}</p>
             <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{role}</p>
          </div>
       </div>
       <div>
          <div className="flex justify-between items-center text-[10px] font-bold mb-1 uppercase tracking-widest">
             <span className="text-gray-400">Tiến độ doanh thu</span>
             <span>{perf}%</span>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
             <div className={cn("h-full", perf > 50 ? "bg-emerald-500" : "bg-black")} style={{ width: `${perf}%` }}></div>
          </div>
       </div>
    </div>
  );
}

function AssetMini({ name, val }: { name: string, val: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-[#F1F3F5] last:border-0">
       <span className="text-xs font-medium text-gray-600">{name}</span>
       <span className="text-xs font-bold">{val}</span>
    </div>
  );
}

function RiskAnalyzerView() {
  const { t, language } = useTranslation();
  const [trends, setTrends] = React.useState<any[]>([]);
  const [alerts, setAlerts] = React.useState<any[]>([]);
  const [selectedAssetRisk, setSelectedAssetRisk] = React.useState<any>(null);
  const [assets, setAssets] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, trendsRes, alertsRes] = await Promise.all([
          fetch('/api/assets'),
          fetch('/api/risk/trends'),
          fetch('/api/risk/alerts')
        ]);
        const assetsData = await assetsRes.json();
        const trendsData = await trendsRes.json();
        const alertsData = await alertsRes.json();
        
        setAssets(assetsData.data);
        setTrends(trendsData);
        setAlerts(alertsData);
        
        if (assetsData.data.length > 0) {
          handleAssetSelect(assetsData.data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssetSelect = async (id: string) => {
    try {
      const res = await fetch(`/api/risk/analysis/${id}`);
      const data = await res.json();
      setSelectedAssetRisk(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold animate-pulse">{language === 'vi' ? 'Khởi tạo công cụ rủi ro...' : 'Initializing Risk Engine...'}</div>;

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <motion.div variants={cardVariants}>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Protocol Intelligence</p>
          <h2 className="text-3xl font-bold tracking-tight">{t('enterpriseRiskEngine')}</h2>
          <p className="text-gray-500 text-sm mt-1">{language === 'vi' ? 'Phân tích điểm trọng số đa yếu tố & mô phỏng thử nghiệm căng thẳng trên tất cả các loại tài sản.' : 'Multi-factor weighted scoring & stress-test simulation across all asset types.'}</p>
        </motion.div>
        <motion.div variants={cardVariants} className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm flex items-center">
            <Download size={14} className="mr-2" /> {t('exportAudit')}
          </button>
          <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 transition-colors shadow-lg">
            {t('runStressTest')}
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Risk Matrix & Factors */}
        <div className="col-span-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <motion.section variants={cardVariants} className="bg-white border border-[#E9ECEF] rounded-2xl p-8 shadow-sm">
              <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-8">{t('riskHeatmap')}</h3>
              <div className="aspect-square relative flex flex-col border-l border-b border-gray-200">
                <div className="flex-1 grid grid-cols-5 gap-1">
                  {[...Array(25)].map((_, i) => {
                    const row = Math.floor(i / 5);
                    const col = i % 5;
                    // Heatmap colors
                    const intensity = (4 - row) + col;
                    const bgColor = intensity > 6 ? "bg-rose-500" : intensity > 4 ? "bg-amber-500" : intensity > 2 ? "bg-emerald-500" : "bg-gray-100";
                    
                    const isTarget = selectedAssetRisk && 
                                     (4 - selectedAssetRisk.matrix.impact) === row && 
                                     (selectedAssetRisk.matrix.probability - 1) === col;

                    return (
                      <div key={i} className={cn("rounded-sm flex items-center justify-center relative", bgColor, "bg-opacity-20")}>
                        {isTarget && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 bg-black rounded-full shadow-lg ring-4 ring-white animate-bounce"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Labels */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-bold uppercase tracking-widest text-gray-400">{language === 'vi' ? 'Tác động' : 'Impact'}</div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-widest text-gray-400">{language === 'vi' ? 'Xác suất' : 'Probability'}</div>
                <div className="absolute top-0 right-0 text-[10px] font-bold p-2 text-rose-600 bg-rose-50 rounded">Extreme Zone</div>
              </div>
            </motion.section>

            <motion.section variants={cardVariants} className="bg-white border border-[#E9ECEF] rounded-2xl p-8 shadow-sm">
              <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-6">{t('weightedFactorAnalysis')}</h3>
              <div className="space-y-6">
                {selectedAssetRisk?.factors.map((f: any) => (
                  <div key={f.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold">{f.name}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Weight: {f.weight * 100}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(f.score / 5) * 100}%` }}
                         className={cn(
                           "h-full", 
                           f.score > 4 ? "bg-rose-500" : f.score > 2 ? "bg-amber-500" : "bg-emerald-500"
                         )} 
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Composite Risk Score</p>
                  <p className="text-4xl font-bold tracking-tight">{selectedAssetRisk?.overallScore}<span className="text-sm font-medium text-gray-400">/5.00</span></p>
                  <div className={cn(
                    "mt-3 inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    selectedAssetRisk?.threshold === 'CRITICAL' ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {selectedAssetRisk?.threshold} Condition
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          <motion.section variants={cardVariants} className="bg-white border border-[#E9ECEF] rounded-2xl p-8 shadow-sm">
            <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-8">Historical Risk Snapshots (Trend Analysis)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={10} />
                  <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}
                  />
                  <Line type="monotone" dataKey="Market" stroke="#000000" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Liquidity" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="Compliance" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.section>
        </div>

        {/* Sidebar: Alerts & Asset Selection */}
        <div className="col-span-4 space-y-8">
          <motion.section variants={cardVariants} className="bg-white border border-[#E9ECEF] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6 italic flex items-center">
              <AlertTriangle size={14} className="mr-2 text-rose-500" /> Early Warning Alerts
            </h3>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest",
                      alert.level === 'CRITICAL' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                    )}>{alert.level}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{alert.factor}</span>
                  </div>
                  <h4 className="text-xs font-bold mb-1 group-hover:text-black transition-colors">{alert.assetName}</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{alert.message}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors bg-gray-50 rounded-xl">
              Show All Mitigation Strategies
            </button>
          </motion.section>

          <motion.section variants={cardVariants} className="bg-white border border-[#E9ECEF] rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-6">Asset Repository</h3>
            <div className="space-y-2">
              {assets.map(asset => (
                <div 
                  key={asset.id} 
                  onClick={() => handleAssetSelect(asset.id)}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center group",
                    selectedAssetRisk?.asset.id === asset.id ? "bg-black border-black text-white shadow-lg" : "bg-white border-gray-100 hover:bg-gray-50"
                  )}
                >
                  <div>
                    <h4 className="text-xs font-bold mb-1">{asset.name}</h4>
                    <p className={cn("text-[9px] uppercase font-bold tracking-widest", selectedAssetRisk?.asset.id === asset.id ? "text-gray-400" : "text-gray-400")}>{asset.category}</p>
                  </div>
                  <ChevronRight size={14} className={cn("transition-transform", selectedAssetRisk?.asset.id === asset.id ? "translate-x-1" : "group-hover:translate-x-1")} />
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}

function PnLManagementView() {
  const { t, language } = useTranslation();
  const [summary, setSummary] = React.useState<any>(null);
  const [cashflowData, setCashflowData] = React.useState<any[]>([]);
  const [selectedPnL, setSelectedPnL] = React.useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, cashflowRes] = await Promise.all([
        fetch('/api/finance/pnl/summary'),
        fetch('/api/finance/cashflow/trends')
      ]);
      const summaryData = await summaryRes.json();
      const cashflowData = await cashflowRes.json();
      setSummary(summaryData);
      setCashflowData(cashflowData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold animate-pulse uppercase tracking-[0.2em] text-gray-400">Loading Financial Engine...</div>;

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <motion.div variants={cardVariants}>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Institutional Finance</p>
          <h2 className="text-3xl font-bold tracking-tight">{t('finance')}</h2>
          <p className="text-gray-500 text-sm mt-1">{language === 'vi' ? 'Quản lý doanh thu, chi phí, và tối ưu hóa dòng tiền tài sản theo thời gian thực.' : 'Manage revenue, expenses, and asset cashflow optimization in real-time.'}</p>
        </motion.div>
        <motion.div variants={cardVariants} className="flex space-x-3">
          <button 
            className="px-4 py-2 bg-white border border-gray-200 text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm flex items-center"
          >
            <Download size={14} className="mr-2" /> {t('exportAudit')}
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg flex items-center"
          >
            <Plus size={16} className="mr-2" /> {t('createPnl')}
          </button>
        </motion.div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard title={t('totalRevenue')} value={summary?.kpis.totalRevenue} type="currency" trend={12.5} />
        <KPICard title={t('totalExpenses')} value={summary?.kpis.totalExpenses} type="currency" trend={-4.2} inverseTrend />
        <KPICard title={t('netProfit')} value={summary?.kpis.netProfit} type="currency" trend={18.8} />
        <KPICard title={t('grossMargin')} value={summary?.kpis.grossMargin} type="percent" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main P&L Table */}
        <motion.div variants={cardVariants} className="col-span-8 bg-white border border-[#E9ECEF] rounded-2xl overflow-hidden shadow-sm">
           <div className="p-8 border-b border-[#F1F3F5] flex justify-between items-center">
              <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500">Transaction Intelligence / P&L Records</h3>
              <div className="flex space-x-2">
                 <button className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase rounded">{language === 'vi' ? 'Tất cả' : 'All'}</button>
                 <button className="px-3 py-1 bg-gray-50 text-gray-400 text-[9px] font-bold uppercase rounded hover:text-black">{language === 'vi' ? 'Đã chốt' : 'Finalized'}</button>
                 <button className="px-3 py-1 bg-gray-50 text-gray-400 text-[9px] font-bold uppercase rounded hover:text-black">{language === 'vi' ? 'Chờ duyệt' : 'Review'}</button>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/50 text-[10px] uppercase font-bold tracking-widest text-gray-400">
                       <th className="px-8 py-4">{language === 'vi' ? 'Hồ sơ P&L / Dự án' : 'P&L Record / Project'}</th>
                       <th className="px-8 py-4">{t('reportingPeriod')}</th>
                       <th className="px-8 py-4">{t('netProfit')}</th>
                       <th className="px-8 py-4">{t('status')}</th>
                       <th className="px-8 py-4"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#F1F3F5]">
                    {summary?.pnlRecords.map((record: any) => (
                       <tr key={record.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                          <td className="px-8 py-6" onClick={() => setSelectedPnL(record.id)}>
                             <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-white transition-colors duration-500 group-hover:shadow-md">
                                   <FileText size={18} />
                                </div>
                                <div>
                                   <p className="text-xs font-bold">{record.assetName}</p>
                                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{record.id} • {record.lineItemsCount} {language === 'vi' ? 'hạng mục' : 'items'}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-xs font-bold" onClick={() => setSelectedPnL(record.id)}>{record.period}</td>
                          <td className="px-8 py-6" onClick={() => setSelectedPnL(record.id)}>
                             <p className="text-xs font-bold">{formatCurrency(record.netProfit, record.currency)}</p>
                             <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-1">ROI: {record.roi}%</p>
                          </td>
                          <td className="px-8 py-6" onClick={() => setSelectedPnL(record.id)}>
                             <span className={cn(
                                "px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest",
                                record.status === 'FINALIZED' ? "bg-emerald-50 text-emerald-600" : "bg-amber-100 text-amber-600"
                             )}>
                                {record.status === 'FINALIZED' ? <CheckCircle2 size={10} className="inline mr-1" /> : <Clock size={10} className="inline mr-1" />}
                                {record.status}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <button className="text-gray-300 hover:text-black transition-colors">
                                <MoreVertical size={16} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </motion.div>

        {/* Sidebar: Analytics & Insights */}
        <div className="col-span-4 space-y-8">
           <motion.section variants={cardVariants} className="bg-white border border-[#E9ECEF] rounded-2xl p-8 shadow-sm">
              <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-8">Cashflow Engine Projection</h3>
              <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashflowData}>
                       <defs>
                          <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="month" hide />
                       <Tooltip 
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '10px' }}
                       />
                       <Area type="monotone" dataKey="inflow" stroke="#10b981" fillOpacity={1} fill="url(#colorIn)" strokeWidth={2} />
                       <Area type="monotone" dataKey="outflow" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-8 flex justify-between items-center px-4">
                 <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Inflow</p>
                    <p className="text-sm font-bold text-emerald-500">+$1.2M</p>
                 </div>
                 <div className="w-px h-8 bg-gray-100"></div>
                 <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Outflow</p>
                    <p className="text-sm font-bold text-rose-500">-$0.8M</p>
                 </div>
              </div>
           </motion.section>

           <motion.section variants={cardVariants} className="bg-black text-white rounded-2xl p-8 shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform duration-700 opacity-20">
                 <PieChartIcon size={64} className="text-white" />
              </div>
              <div className="relative z-10">
                 <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-6">Commission Analytics</h3>
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Tổng hoa hồng chờ xử lý</p>
                       <p className="text-3xl font-bold tracking-tighter">185.000.000 <span className="text-xs font-medium text-gray-500">VND</span></p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Hạn mức hệ thống</span>
                          <span className="text-[10px] font-bold">12% / Gross Revenue</span>
                       </div>
                       <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: '65%' }}
                             className="h-full bg-emerald-400"
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {selectedPnL && <PnLDetailModal pnlId={selectedPnL} onClose={() => setSelectedPnL(null)} />}
        {showCreateModal && <NewPnLModal onClose={() => setShowCreateModal(false)} onCreated={fetchData} />}
      </AnimatePresence>
    </motion.div>
  );
}

function KPICard({ title, value, type, trend, inverseTrend }: { title: string, value: number, type: 'currency' | 'percent', trend?: number, inverseTrend?: boolean }) {
  const isPositive = trend && trend > 0;
  const isGood = inverseTrend ? !isPositive : isPositive;

  return (
    <motion.div variants={cardVariants} className="bg-white p-8 rounded-2xl border border-[#E9ECEF] shadow-sm hover:shadow-md transition-all">
       <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-3">{title}</p>
       <div className="flex justify-between items-end">
          <div>
             <p className="text-2xl font-bold tracking-tight">
               {type === 'currency' ? formatCurrency(value, 'VND') : `${value}%`}
             </p>
          </div>
          {trend && (
             <div className={cn(
                "flex items-center text-[10px] font-bold uppercase tracking-widest",
                isGood ? "text-emerald-500" : "text-rose-500"
             )}>
                {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {Math.abs(trend)}%
             </div>
          )}
       </div>
    </motion.div>
  );
}

function PnLDetailModal({ pnlId, onClose }: { pnlId: string, onClose: () => void }) {
   const [data, setData] = React.useState<any>(null);
   const [loading, setLoading] = React.useState(true);

   React.useEffect(() => {
      const fetchDetail = async () => {
         try {
            const res = await fetch(`/api/finance/pnl/${pnlId}`);
            const json = await res.json();
            setData(json);
         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };
      fetchDetail();
   }, [pnlId]);

   const handleTransition = async (action: string) => {
      try {
         const res = await fetch(`/api/finance/pnl/${pnlId}/transition`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
         });
         const updated = await res.json();
         if (updated.error) alert(updated.message);
         else setData({ ...data, record: updated });
      } catch (err) {
         console.error(err);
      }
   };

   if (loading) return null;

   const record = data.record;
   const items = data.items;
   const revenue = items.filter((i: any) => i.category === 'REVENUE');
   const expenses = items.filter((i: any) => i.category === 'EXPENSE');

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
         <motion.div 
            variants={modalVariants.backdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
         />
         <motion.div 
            variants={modalVariants.content}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-5xl bg-white rounded-3xl shadow-huge overflow-hidden relative flex flex-col max-h-[90vh]"
         >
            {/* Header */}
            <div className="p-8 border-b border-[#F1F3F5] flex justify-between items-start bg-gray-50/50">
               <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg">
                     <Building2 size={24} />
                  </div>
                  <div>
                     <div className="flex items-center space-x-3 mb-1">
                        <h2 className="text-xl font-bold">{record.assetName}</h2>
                        <span className={cn(
                           "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                           record.status === 'FINALIZED' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        )}>{record.status}</span>
                     </div>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">P&L Hồ sơ: {record.id} • Kỳ báo cáo: {record.period}</p>
                  </div>
               </div>
               <div className="flex space-x-3">
                  {record.status === 'DRAFT' && (
                     <button 
                        onClick={() => handleTransition('SUBMIT')}
                        className="px-6 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-md"
                     >
                        Submit for Review
                     </button>
                  )}
                  {record.status === 'UNDER_REVIEW' && (
                     <button 
                        onClick={() => handleTransition('APPROVE')}
                        className="px-6 py-2.5 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-md"
                     >
                        Finalize & Lock
                     </button>
                  )}
                  <button onClick={onClose} className="p-2.5 text-gray-400 hover:text-black transition-colors">
                     <X size={20} />
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12">
               {/* Financial Summary Grid */}
               <div className="grid grid-cols-4 gap-6">
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                     <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Gross Profit</p>
                     <p className="text-xl font-bold">{formatCurrency(record.grossProfit, record.currency)}</p>
                  </div>
                  <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                     <p className="text-[9px] text-rose-600 font-bold uppercase tracking-widest mb-1">Net Profit</p>
                     <p className="text-xl font-bold">{formatCurrency(record.netProfit, record.currency)}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                     <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">EBITDA</p>
                     <p className="text-xl font-bold">{formatCurrency(record.ebitda, record.currency)}</p>
                  </div>
                  <div className="p-6 bg-black text-white rounded-2xl border border-black shadow-lg">
                     <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">ROI Analysis</p>
                     <p className="text-xl font-bold">{record.roi}%</p>
                  </div>
               </div>

               {/* Detailed Line Items */}
               <div className="grid grid-cols-2 gap-12">
                  {/* Revenue */}
                  <div>
                     <h3 className="text-xs uppercase font-bold tracking-widest text-emerald-600 mb-6 flex items-center">
                        <ArrowUpRight size={14} className="mr-2" /> Revenue Stream
                     </h3>
                     <div className="space-y-4">
                        {revenue.map((item: any) => (
                           <div key={item.id} className="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center hover:shadow-md transition-all">
                              <div>
                                 <p className="text-xs font-bold">{item.subcategory}</p>
                                 <p className="text-[9px] text-gray-400 font-bold mt-0.5">{item.description}</p>
                              </div>
                              <p className="text-xs font-bold text-emerald-500">+{formatCurrency(item.amount, record.currency)}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                  {/* Expenses */}
                  <div>
                     <h3 className="text-xs uppercase font-bold tracking-widest text-rose-600 mb-6 flex items-center">
                        <ArrowDownRight size={14} className="mr-2" /> Expense tracking
                     </h3>
                     <div className="space-y-4">
                        {expenses.map((item: any) => (
                           <div key={item.id} className="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center hover:shadow-md transition-all">
                              <div>
                                 <p className="text-xs font-bold">{item.subcategory}</p>
                                 <p className="text-[9px] text-gray-400 font-bold mt-0.5">{item.description}</p>
                              </div>
                              <p className="text-xs font-bold text-rose-500">-{formatCurrency(item.amount, record.currency)}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Commission & Audit Section */}
               <div className="grid grid-cols-12 gap-8 pt-8 border-t border-gray-100">
                  <div className="col-span-12">
                     <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-6 italic">Immutable Audit Trail & Adjustments</h3>
                     <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="text-[9px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200">
                                 <th className="px-6 py-3">Timestamp</th>
                                 <th className="px-6 py-3">User Agent</th>
                                 <th className="px-6 py-3">Action</th>
                                 <th className="px-6 py-3">Detailed Log</th>
                              </tr>
                           </thead>
                           <tbody className="text-[10px] font-medium leading-relaxed">
                              {data.auditTrail.map((audit: any) => (
                                 <tr key={audit.id} className="border-b border-gray-100 last:border-0">
                                    <td className="px-6 py-4 text-gray-400">{new Date(audit.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4 font-bold">{audit.user}</td>
                                    <td className="px-6 py-4">
                                       <span className="px-2 py-0.5 bg-black text-white rounded-[4px] uppercase text-[8px]">{audit.action}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{audit.details}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-[#F1F3F5] bg-gray-50/50 flex justify-between items-center">
               <div className="flex space-x-6">
                  <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                     <BadgeCheck size={14} className="mr-2 text-emerald-500" /> Compliance Verified
                  </div>
                  <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                     <Lock size={14} className="mr-2" /> Encrypted Storage
                  </div>
               </div>
               <button className="px-6 py-3 bg-white border border-gray-200 text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all flex items-center">
                  <Download size={14} className="mr-2" /> Tải báo cáo PDF
               </button>
            </div>
         </motion.div>
      </div>
   );
}

function NewPnLModal({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) {
   const [step, setStep] = React.useState(1);
   const [assets, setAssets] = React.useState<any[]>([]);
   const [formData, setFormData] = React.useState({
      assetId: '',
      period: '2024-Q2',
      currency: 'VND',
      items: [
         { category: 'REVENUE', subcategory: 'Doanh thu định kỳ', description: '', amount: 0, frequency: 'MONTHLY' }
      ]
   });

   React.useEffect(() => {
     fetch('/api/assets').then(res => res.json()).then(data => setAssets(data.data));
   }, []);

   const addItem = (category: 'REVENUE' | 'EXPENSE') => {
      setFormData({
         ...formData,
         items: [...formData.items, { category, subcategory: category === 'REVENUE' ? 'Doanh thu thu khác' : 'Phí vận hành', description: '', amount: 0, frequency: 'ONE_TIME' }]
      });
   };

   const updateItem = (index: number, field: string, value: any) => {
      const newItems = [...formData.items];
      newItems[index] = { ...newItems[index], [field]: field === 'amount' ? Number(value) : value };
      setFormData({ ...formData, items: newItems });
   };

   const handleSubmit = async () => {
      try {
         const res = await fetch('/api/finance/pnl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
         });
         if (res.ok) {
            onCreated();
            onClose();
         }
      } catch (err) {
         console.error(err);
      }
   };

   return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-8">
         <motion.div 
            variants={modalVariants.backdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
         />
         <motion.div 
            variants={modalVariants.content}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-2xl bg-white rounded-3xl shadow-huge overflow-hidden relative flex flex-col"
         >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-bold">Protocol Finance Entry</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Step {step} of 2 • Ledger Compliance v1.0</p>
               </div>
               <button onClick={onClose} className="p-2 text-gray-400 hover:text-black">
                  <X size={20} />
               </button>
            </div>

            <div className="p-10">
               {step === 1 ? (
                  <div className="space-y-6">
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Linked Asset / Property</label>
                        <select 
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black transition-all text-sm font-bold"
                           value={formData.assetId}
                           onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                        >
                           <option value="">Select Asset for P&L Record</option>
                           {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Reporting Period</label>
                           <input 
                              type="text" 
                              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black transition-all text-sm font-bold"
                              placeholder="e.g. 2024-Q3"
                              value={formData.period}
                              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Currency Node</label>
                           <select 
                              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black transition-all text-sm font-bold"
                              value={formData.currency}
                              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                           >
                              <option value="VND">Vietnam Dong (VND)</option>
                              <option value="USD">US Dollar (USD)</option>
                              <option value="SGD">Singapore Dollar (SGD)</option>
                           </select>
                        </div>
                     </div>
                     <div className="pt-6">
                        <button 
                           disabled={!formData.assetId}
                           onClick={() => setStep(2)}
                           className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 disabled:opacity-30 transition-all font-mono shadow-xl flex items-center justify-center"
                        >
                           Next: Detailed Line Items <ChevronRight size={16} className="ml-2" />
                        </button>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Financial Ledger Balance</h3>
                        <div className="flex space-x-2">
                           <button onClick={() => addItem('REVENUE')} className="text-[9px] font-bold text-emerald-500 uppercase">+ Add Rev</button>
                           <button onClick={() => addItem('EXPENSE')} className="text-[9px] font-bold text-rose-400 uppercase">+ Add Exp</button>
                        </div>
                     </div>
                     {formData.items.map((item, idx) => (
                        <div key={idx} className={cn(
                           "p-4 rounded-2xl border flex flex-col space-y-4",
                           item.category === 'REVENUE' ? "bg-emerald-50/30 border-emerald-100" : "bg-rose-50/30 border-rose-100"
                        )}>
                           <div className="flex space-x-4">
                              <input 
                                 type="text"
                                 placeholder="Hạng mục (Dịch vụ, bảo trì...)"
                                 className="flex-1 bg-white p-3 rounded-lg border border-gray-100 text-xs font-bold outline-none"
                                 value={item.subcategory}
                                 onChange={(e) => updateItem(idx, 'subcategory', e.target.value)}
                              />
                              <input 
                                 type="number"
                                 placeholder="Số tiền"
                                 className="w-40 bg-white p-3 rounded-lg border border-gray-100 text-xs font-bold outline-none"
                                 value={item.amount}
                                 onChange={(e) => updateItem(idx, 'amount', e.target.value)}
                              />
                           </div>
                           <input 
                              type="text"
                              placeholder="Mô tả chi tiết hoặc Ghi chú Audit"
                              className="w-full bg-white p-3 rounded-lg border border-gray-100 text-[10px] font-medium outline-none"
                              value={item.description}
                              onChange={(e) => updateItem(idx, 'description', e.target.value)}
                           />
                        </div>
                     ))}
                     <div className="pt-6 grid grid-cols-2 gap-4">
                        <button 
                           onClick={() => setStep(1)}
                           className="py-4 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all shadow-sm"
                        >
                           Back
                        </button>
                        <button 
                           onClick={handleSubmit}
                           className="py-4 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-xl"
                        >
                           Finalize Entry & Review
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </motion.div>
      </div>
   );
}


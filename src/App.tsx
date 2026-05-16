import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  LayoutDashboard, Briefcase, Users, UserRound, FileText, Lock, MessageSquare,
  Search, Bell, Settings, TrendingUp, AlertTriangle, ArrowUpRight, 
  DollarSign, FileCode, CheckCircle2, ChevronRight, Download, Plus, X, Building2, ShieldCheck, ArrowRight, ArrowLeft, UserCheck, Clock,
  TrendingDown, ArrowDownRight, MoreVertical, Calendar, BadgeCheck, PieChart as PieChartIcon,
  Handshake, Share2, Network, Mail, Globe, ExternalLink, Wallet, Scale, ShieldAlert,
  Folder, UploadCloud, HardDrive, Shield, File, Info, Filter, Grid, List as ListIcon
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
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [valuingAssetId, setValuingAssetId] = React.useState<string | null>(null);

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
            <NavItem active={activeTab === 'reports'} icon={<FileText size={20} />} label={t('reports')} onClick={() => setActiveTab('reports')} collapsed={isSidebarCollapsed} />
            <NavItem active={activeTab === 'governance'} icon={<Users size={20} />} label={t('governance')} onClick={() => setActiveTab('governance')} collapsed={isSidebarCollapsed} />
            <NavItem active={activeTab === 'team'} icon={<UserRound size={20} />} label={t('team')} onClick={() => setActiveTab('team')} collapsed={isSidebarCollapsed} />
            <NavItem active={activeTab === 'partners'} icon={<Handshake size={20} />} label={t('partners')} onClick={() => setActiveTab('partners')} collapsed={isSidebarCollapsed} />
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

               <div className="relative">
                 <button 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={cn(
                    "relative p-2.5 transition-all rounded-xl shadow-sm border",
                    isChatOpen ? "bg-black text-white border-black" : "text-gray-400 hover:text-black bg-gray-50 border-gray-100"
                  )}
                 >
                   <MessageSquare size={20} />
                   {!isChatOpen && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>}
                 </button>

                 <AnimatePresence>
                    {isChatOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full mt-4 right-0 w-[450px] z-[100] shadow-huge"
                      >
                         <InternalChatView />
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
              {valuingAssetId ? (
                <ValuationView assetId={valuingAssetId} onBack={() => setValuingAssetId(null)} />
              ) : (
                <>
                  {activeTab === 'dashboard' && <DashboardView onAssetClick={(id) => setValuingAssetId(id)} />}
                  {activeTab === 'portfolio' && <PortfolioTabWrapper onAssetClick={(id) => setValuingAssetId(id)} />}
                  {activeTab === 'finance' && <PnLManagementView />}
                  {activeTab === 'risk' && <RiskAnalyzerView />}
                  {activeTab === 'reports' && <ReportsView />}
                  {activeTab === 'governance' && <GovernanceView onAssetClick={(id) => setValuingAssetId(id)} />}
                  {activeTab === 'team' && <TeamView />}
                  {activeTab === 'partners' && <PartnerNetworkView />}
                  {activeTab === 'vault' && <VaultView />}
                </>
              )}
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

function GovernanceView({ onAssetClick }: { onAssetClick: (id: string) => void }) {
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
            <SubAccount onClick={() => onAssetClick('AST-7721')} name="Horizon Tower Singapore" percent={65} aum="$420.0M" type="Real Estate" />
            <SubAccount onClick={() => onAssetClick('AST-8822')} name="Nova Fintech Solutions" percent={12.5} aum="$85.2M" type="Venture Capital" />
            <SubAccount onClick={() => onAssetClick('AST-1124')} name="Oceanic Logistics Corp" percent={100} aum="$312.8M" type="Core Ops" />
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

function SubAccount({ name, percent, aum, type, onClick }: { name: string, percent: number, aum: string, type: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-6 bg-[#F8F9FA] rounded-2xl border border-transparent transition-all cursor-pointer",
        onClick ? "hover:border-black hover:bg-white shadow-sm" : "hover:border-[#E9ECEF] hover:bg-white"
      )}
    >
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
  const { t, language } = useTranslation();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const [selectedFile, setSelectedFile] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/vault/overview')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const handleUpload = async () => {
    const name = prompt(language === 'vi' ? "Nhập tên tài liệu:" : "Enter document name:");
    if (!name) return;
    
    const res = await fetch('/api/vault/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type: 'PDF' })
    });
    const newDoc = await res.json();
    setData({ ...data, recentFiles: [newDoc, ...data.recentFiles] });
  };

  if (loading) return <div className="p-20 text-center font-bold animate-pulse">{language === 'vi' ? 'Đang truy cập rương dữ liệu...' : 'Accessing data vault...'}</div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <AnimatePresence>
        {selectedFile && <DocumentModal file={selectedFile} onClose={() => setSelectedFile(null)} />}
      </AnimatePresence>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">{t('documentVault')}</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-2xl leading-relaxed">{t('vaultDesc')}</p>
        </div>
        <button 
          onClick={handleUpload}
          className="px-6 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center"
        >
          <UploadCloud size={18} className="mr-2" /> {t('uploadNew')}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <VaultStatCard label={t('totalDocuments')} val="1,248" sub={language === 'vi' ? "+12 tháng này" : "+12 this month"} icon={<FileText className="text-gray-400" size={20} />} />
        <VaultStatCard label={t('activeContracts')} val="84" sub="Verified by Legal" verified icon={<BadgeCheck className="text-emerald-500" size={20} />} />
        <VaultStatCard label={t('storageUsed')} val="14.2 GB" sub="Cloud Instance" icon={<HardDrive className="text-gray-400" size={20} />} />
        <VaultStatCard label={t('securityStatus')} val={t('encryptedAES')} sub="Active Protection" icon={<Shield className="text-emerald-500" size={20} />} />
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
           <div className="flex items-center space-x-8">
              <FilterTab active={activeFilter === 'all'} label={t('allFiles')} onClick={() => setActiveFilter('all')} />
              <FilterTab active={activeFilter === 'contract'} label={t('finance')} onClick={() => setActiveFilter('contract')} />
              <FilterTab active={activeFilter === 'tax'} label={t('taxDocs')} onClick={() => setActiveFilter('tax')} />
              <FilterTab active={activeFilter === 're'} label={t('realEstate')} onClick={() => setActiveFilter('re')} />
              <FilterTab active={activeFilter === 'will'} label={t('wills')} onClick={() => setActiveFilter('will')} />
           </div>
           <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-50 p-1 rounded-lg border">
                 <button onClick={() => setViewMode('grid')} className={cn("p-1.5 rounded-md", viewMode === 'grid' ? "bg-white shadow text-black" : "text-gray-400")}>
                    <Grid size={16} />
                 </button>
                 <button onClick={() => setViewMode('list')} className={cn("p-1.5 rounded-md", viewMode === 'list' ? "bg-white shadow text-black" : "text-gray-400")}>
                    <ListIcon size={16} />
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
           {data.folders.map((f: any) => (
             <FolderCard key={f.id} folder={f} />
           ))}
           <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all cursor-pointer group">
              <Plus size={32} className="mb-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{language === 'vi' ? 'Thêm thư mục' : 'Add Folder'}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 pt-8">
         <div className="col-span-8 space-y-8">
            <h3 className="text-2xl font-bold">{t('recentActivity')}</h3>
            <div className="space-y-2">
               {data.recentFiles.map((file: any) => (
                 <RecentFileRow key={file.id} file={file} onClick={() => setSelectedFile(file)} />
               ))}
            </div>
            <button className="text-[10px] font-bold uppercase tracking-widest text-black hover:underline">{t('viewFullHistory')}</button>
         </div>

         <div className="col-span-4 space-y-8">
            <div className="bg-black text-white rounded-3xl p-10 relative overflow-hidden group shadow-2xl">
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                    <UploadCloud className="text-white" size={24} />
                  </div>
                  <h4 className="text-2xl font-bold mb-3">{t('dragAndDrop')}</h4>
                  <p className="text-xs text-gray-500 mb-8 leading-relaxed italic">{t('vaultEncryptionInfo')}</p>
                  <button className="w-full py-4 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">{t('chooseFromComputer')}</button>
               </div>
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Lock size={160} />
               </div>
            </div>

            <section className="bg-white border border-[#E9ECEF] rounded-3xl p-8 shadow-sm">
               <h4 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-6">{t('legalAuditStatus')}</h4>
               <div className="space-y-6">
                  {data.status.map((s: any) => (
                    <div key={s.id} className="flex justify-between items-center">
                       <div>
                          <p className="text-xs font-bold text-gray-900">{s.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-medium tracking-tight mt-0.5">{s.period}</p>
                       </div>
                       <span className={cn(
                        "text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter",
                        s.status === 'COMPLETED' || s.status === 'CLEAN' ? "bg-emerald-100 text-emerald-600" : 
                        s.status === 'PROCESSING' ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-400"
                       )}>{t(s.status.toLowerCase()) || s.status}</span>
                    </div>
                  ))}
               </div>
            </section>
         </div>
      </div>

      <footer className="pt-20 border-t border-gray-100 flex justify-between items-center text-gray-400">
         <div className="flex items-center space-x-4">
           <span className="text-[10px] font-bold uppercase tracking-widest text-black">Elysium Ledger</span>
           <span className="w-px h-3 bg-gray-200"></span>
           <span className="text-[9px] font-medium uppercase tracking-tighter">{language === 'vi' ? 'Hệ thống Lưu trữ Tài liệu Bảo mật' : 'Confidential Document Vault'}</span>
         </div>
         <div className="flex items-center space-x-8">
            <span className="text-[9px] font-medium uppercase tracking-tighter hover:text-black cursor-pointer">Privacy Policy</span>
            <span className="text-[9px] font-medium uppercase tracking-tighter hover:text-black cursor-pointer">Security Audit</span>
         </div>
      </footer>
    </div>
  );
}

function VaultStatCard({ label, val, sub, icon, verified }: any) {
  return (
    <motion.div variants={cardVariants} className="bg-white p-8 rounded-3xl border border-[#E9ECEF] shadow-sm flex flex-col justify-between group hover:border-black transition-all">
       <div className="flex justify-between items-start mb-6">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{label}</p>
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
            {icon}
          </div>
       </div>
       <div>
          <div className="flex items-baseline space-x-2">
            <h4 className="text-3xl font-bold">{val}</h4>
            {verified && <CheckCircle2 size={16} className="text-emerald-500" />}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-medium italic">{sub}</p>
       </div>
    </motion.div>
  );
}

const FolderCard: React.FC<{ folder: any }> = ({ folder }) => {
  const { language } = useTranslation();
  return (
    <div className="bg-white border border-[#E9ECEF] rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-black transition-all cursor-pointer group">
       <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-colors duration-500">
          <Folder size={32} />
       </div>
       <h4 className="text-sm font-bold text-gray-900 mb-1">{folder.name}</h4>
       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
         {folder.count} {language === 'vi' ? 'tài liệu' : 'documents'} • {folder.size}
       </p>
    </div>
  );
};

function DocumentModal({ file, onClose }: { file: any, onClose: () => void }) {
  const { language } = useTranslation();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         onClick={onClose}
         className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
       />
       <motion.div 
         initial={{ scale: 0.9, opacity: 0, y: 20 }}
         animate={{ scale: 1, opacity: 1, y: 0 }}
         exit={{ scale: 0.9, opacity: 0, y: 20 }}
         className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]"
       >
          <div className="w-full md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-12 border-r">
             <div className={cn(
               "w-32 h-32 rounded-3xl flex items-center justify-center mb-8 shadow-inner",
               file.type === 'PDF' ? "bg-rose-50 text-rose-500" :
               file.type === 'IMG' ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-500"
             )}>
                <FileText size={64} />
             </div>
             <p className="text-xl font-bold text-gray-900 text-center px-4">{file.name}</p>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{file.type} DOCUMENT • 4.2 MB</p>
          </div>
          
          <div className="flex-1 p-12 flex flex-col justify-between">
             <div>
                <div className="flex justify-between items-start mb-8">
                   <span className="text-[10px] font-bold uppercase py-1.5 px-3 bg-emerald-100 text-emerald-600 rounded-lg">Verified AES-256</span>
                   <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                
                <h3 className="text-2xl font-bold mb-8">{language === 'vi' ? 'Chi tiết tài liệu' : 'Document Details'}</h3>
                
                <div className="space-y-6">
                   <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{language === 'vi' ? 'Người tải lên' : 'Uploaded By'}</p>
                      <div className="flex items-center space-x-3">
                         <div className="w-8 h-8 rounded-full bg-slate-200" />
                         <span className="text-sm font-bold">{file.uploadedBy}</span>
                      </div>
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{language === 'vi' ? 'Thời gian' : 'Uploaded At'}</p>
                      <p className="text-sm font-medium">{file.uploadedAt}</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{language === 'vi' ? 'Phân loại' : 'Tags'}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                         {file.tags.map((tag: string) => (
                           <span key={tag} className="text-[9px] font-bold uppercase py-1 px-2 border border-gray-100 rounded-md text-gray-500">{tag}</span>
                         ))}
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex space-x-3 mt-12">
                <button className="flex-1 py-4 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center">
                   <Download size={14} className="mr-2" /> {language === 'vi' ? 'Tải xuống' : 'Download'}
                </button>
                <button className="p-4 border border-gray-100 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-50 transition-all">
                   <Share2 size={16} />
                </button>
             </div>
          </div>
       </motion.div>
    </div>
  );
}

const RecentFileRow: React.FC<{ file: any, onClick?: () => void }> = ({ file, onClick }) => {
  const { language } = useTranslation();
  return (
    <div 
      onClick={onClick}
      className="flex items-center space-x-6 p-6 hover:bg-gray-50 rounded-2xl transition-colors group cursor-pointer"
    >
       <div className={cn(
         "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-[10px]",
         file.type === 'PDF' ? "bg-rose-50 text-rose-500" :
         file.type === 'IMG' ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-500"
       )}>
          {file.type}
       </div>
       <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-black">{file.name}</h4>
          <p className="text-[10px] text-gray-400 mt-1">
             {language === 'vi' ? 'Đã được tải lên bởi' : 'Uploaded by'} <span className="font-bold text-gray-600">{file.uploadedBy}</span> {language === 'vi' ? 'vào lúc' : 'at'} {file.uploadedAt}.
          </p>
       </div>
       <div className="flex items-center space-x-3">
          {file.tags.map((tag: string) => (
            <span key={tag} className="text-[9px] font-bold uppercase px-2 py-1 bg-gray-100 text-gray-400 rounded-md">
               {tag}
            </span>
          ))}
       </div>
       <button className="p-2 text-gray-200 group-hover:text-gray-400 hover:text-black transition-colors">
          <MoreVertical size={18} />
       </button>
    </div>
  );
};


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

function DashboardView({ onAssetClick }: { onAssetClick: (id: string) => void }) {
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
              <AssetRow onClick={() => onAssetClick('AST-7721')} name="Villa Vinhome Riverside" desc={t('realEstate')} val="$1,250,000" perf="+18.5%" manager="Minh Hoàng" />
              <AssetRow onClick={() => onAssetClick('AST-8822')} name="Cổ phần Tech Start-up A" desc={t('privateEquity')} val="$840,000" perf="+24.2%" manager="Anh Nguyễn" />
              <AssetRow onClick={() => onAssetClick('AST-9923')} name="Bộ sưu tập đồng hồ Patek" desc="Tài sản xa xỉ" val="$420,000" perf="+8.1%" manager="Lê Tú" />
              <AssetRow onClick={() => onAssetClick('AST-1124')} name="Đất nền Long Thành" desc="Đầu tư dài hạn" val="$710,000" perf="+5.4%" manager="Minh Hoàng" />
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

function AssetRow({ name, desc, val, perf, manager, onClick }: { name: string, desc: string, val: string, perf: string, manager: string, onClick?: () => void }) {
  return (
    <motion.tr 
      variants={cardVariants}
      onClick={onClick}
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

function PortfolioTabWrapper({ onAssetClick }: { onAssetClick: (id: string) => void }) {
  const [viewingValuationId, setViewingValuationId] = React.useState<string | null>(null);

  if (viewingValuationId) {
    return <ValuationView assetId={viewingValuationId} onBack={() => setViewingValuationId(null)} />;
  }

  return <PortfolioView onViewValuation={(id) => onAssetClick(id)} />;
}

function PortfolioView({ onViewValuation }: { onViewValuation: (id: string) => void }) {
  const { t, language } = useTranslation();
  const [showAssetModal, setShowAssetModal] = React.useState(false);
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
              <tbody className="divide-y divide-gray-50">
                 {localAssets.map((asset: any) => (
                   <tr key={asset.id} onClick={() => onViewValuation(asset.id)} className="hover:bg-gray-50 transition-colors cursor-pointer group">
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

const TeamMemberCard: React.FC<{ name: string, role: string, perf: number, active?: boolean, onClick?: () => void }> = ({ name, role, perf, active, onClick }) => {
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
};

function PartnerNetworkView() {
  const { t, language } = useTranslation();
  const [activeFilter, setActiveFilter] = React.useState('all');

  const partners = [
    {
      id: 'P001',
      name: 'Swiss Capital Group',
      type: language === 'vi' ? 'Đối tác Tài chính Quốc tế' : 'International Finance Partner',
      email: 'contact@swiss-capital.ch',
      project: language === 'vi' ? 'Quản lý Quỹ Hưu trí G2' : 'G2 Pension Fund Management',
      status: 'ACTIVE',
      category: 'finance',
      icon: <Building2 className="text-gray-400" size={24} />
    },
    {
      id: 'P002',
      name: 'Nexus Quantum',
      type: language === 'vi' ? 'Đối tác Công nghệ Blockchain' : 'Blockchain Tech Partner',
      email: 'dev@nexus-q.io',
      project: language === 'vi' ? 'Tích hợp Ví Lạnh A1' : 'A1 Cold Wallet Integration',
      status: 'AUDITING',
      category: 'tech',
      icon: <Share2 className="text-gray-400" size={24} />
    },
    {
      id: 'P003',
      name: 'Hogan & Moore',
      type: language === 'vi' ? 'Tư vấn Pháp lý & Tuân thủ' : 'Legal & Compliance Advisory',
      email: 'legal@hoganmoore.com',
      project: language === 'vi' ? 'Chứng nhận ESG Toàn cầu' : 'Global ESG Certification',
      status: 'SUSPENDED',
      category: 'legal',
      icon: <ShieldCheck className="text-gray-400" size={24} />
    }
  ];

  const filteredPartners = activeFilter === 'all' 
    ? partners 
    : partners.filter(p => p.category === activeFilter);

  const projects = [
    { name: language === 'vi' ? 'Hệ thống Ủy thác Kỹ thuật số' : 'Digital Trust System', partner: 'Nexus Quantum', deadline: 'Q4 2024', progress: 65 },
    { name: language === 'vi' ? 'Kiểm toán Danh mục Bền vững' : 'Sustainable Portfolio Audit', partner: 'Swiss Capital Group', deadline: 'Q1 2025', progress: 20 },
    { name: language === 'vi' ? 'Giao diện API Ngân hàng Mở' : 'Open Banking API Interface', partner: 'Nexus Quantum', deadline: 'Q3 2024', progress: 95 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">{t('partnersNetwork')}</h2>
          <p className="text-gray-500 text-sm mt-2">{t('partnersDesc')}</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm">{t('exportReport')}</button>
          <button className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg">{t('addPartner')}</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 bg-white border border-[#E9ECEF] rounded-3xl p-10 flex items-center justify-between shadow-sm overflow-hidden relative group">
           <div className="relative z-10 w-1/2">
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">{t('partnerSummary')}</p>
             <h3 className="text-3xl font-bold mb-4">{t('partnerGrowth')}</h3>
             <p className="text-sm text-gray-500 leading-relaxed">{t('partnerStats')}</p>
             
             <div className="grid grid-cols-3 gap-8 mt-10">
                <div>
                   <p className="text-3xl font-bold">12</p>
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{t('categoryFinance')}</p>
                </div>
                <div>
                   <p className="text-3xl font-bold">08</p>
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{t('categoryTech')}</p>
                </div>
                <div>
                   <p className="text-3xl font-bold">04</p>
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{t('categoryLegal')}</p>
                </div>
             </div>
           </div>
           <div className="flex-1 flex justify-center relative">
              <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center border border-dashed border-gray-200 group-hover:border-black transition-colors duration-500">
                 <Network size={64} className="text-gray-100 group-hover:text-black transition-colors duration-500" />
              </div>
           </div>
        </div>

        <div className="col-span-4 bg-black text-white rounded-3xl p-10 flex flex-col justify-between shadow-xl">
           <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{t('activeProjectCount')}</p>
              <h3 className="text-6xl font-bold">15</h3>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed italic">"{language === 'vi' ? 'Các sáng kiến liên kết đang được triển khai trên toàn cầu.' : 'Linked initiatives are being deployed globally.'}"</p>
           </div>
           
           <div className="mt-10">
              <div className="flex justify-between items-center mb-2">
                 <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{t('completionRate')}</p>
                 <p className="text-lg font-bold">78%</p>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} className="h-full bg-white"></motion.div>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center space-x-8 border-b border-gray-100 pb-2">
          <FilterTab active={activeFilter === 'all'} label={t('allPartners')} onClick={() => setActiveFilter('all')} />
          <FilterTab active={activeFilter === 'finance'} label={t('categoryFinance')} onClick={() => setActiveFilter('finance')} />
          <FilterTab active={activeFilter === 'tech'} label={t('categoryTech')} onClick={() => setActiveFilter('tech')} />
          <FilterTab active={activeFilter === 'legal'} label={t('categoryLegal')} onClick={() => setActiveFilter('legal')} />
        </div>

        <div className="grid grid-cols-3 gap-8">
          {filteredPartners.map(p => (
            <PartnerCard key={p.id} partner={p} />
          ))}
        </div>
      </div>

      <section className="pt-12">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-2xl font-bold">{t('ongoingProjects')}</h3>
           <button className="text-xs font-bold text-gray-400 hover:text-black transition-colors flex items-center">{t('viewAllProjects')} <ChevronRight size={14} className="ml-1" /></button>
        </div>
        
        <div className="bg-white border border-[#E9ECEF] rounded-3xl overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-[#F8F9FA] text-[10px] uppercase font-bold text-gray-400 border-b">
                 <tr>
                    <th className="px-8 py-5">{t('projectName')}</th>
                    <th className="px-8 py-5">{t('primaryPartner')}</th>
                    <th className="px-8 py-5">{t('deadline')}</th>
                    <th className="px-8 py-5">{t('progress')}</th>
                    <th className="px-8 py-5 w-20"></th>
                 </tr>
              </thead>
              <tbody>
                 {projects.map((proj, i) => (
                   <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6">
                         <div>
                            <p className="font-bold text-sm text-gray-900">{proj.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">{language === 'vi' ? 'Phát triển hạ tầng nền tảng' : 'Platform infrastructure development'}</p>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-xs font-medium text-gray-600">{proj.partner}</span>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-xs font-bold text-gray-500 uppercase">{proj.deadline}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center space-x-4">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                               <div className="h-full bg-black" style={{ width: `${proj.progress}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold w-10 text-gray-400">{proj.progress}%</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <ChevronRight size={18} className="text-gray-200 group-hover:text-black transition-colors" />
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </section>

      <footer className="pt-20 pb-10 border-t border-gray-100 flex justify-between items-center text-gray-400">
         <div className="flex items-center space-x-4">
           <span className="text-[10px] font-bold uppercase tracking-widest text-black">Elysium Ledger</span>
           <span className="w-px h-3 bg-gray-200"></span>
           <span className="text-[9px] font-medium uppercase tracking-tighter">{language === 'vi' ? 'Hệ thống Quản lý Đối tác Nội bộ' : 'Internal Partner Management System'}</span>
         </div>
         <p className="text-[9px] font-medium uppercase tracking-tighter">© 2024 Elysium Ledger Private Wealth. {language === 'vi' ? 'Tất cả quyền được bảo lưu.' : 'All rights reserved.'}</p>
      </footer>
    </div>
  );
}

function FilterTab({ active, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "text-xs font-bold uppercase tracking-widest pb-3 transition-all relative",
        active ? "text-black" : "text-gray-400 hover:text-black"
      )}
    >
      {label}
      {active && (
        <motion.div layoutId="filter-active" className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
      )}
    </button>
  );
}

const PartnerCard: React.FC<{ partner: any }> = ({ partner }) => {
  const { t, language } = useTranslation();
  return (
    <div className="bg-white border border-[#E9ECEF] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-black transition-all group flex flex-col h-full">
       <div className={cn(
         "h-32 p-8 flex justify-between items-start",
         partner.category === 'finance' ? "bg-gray-50" : 
         partner.category === 'tech' ? "bg-black" : "bg-slate-100"
       )}>
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
             {partner.icon}
          </div>
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border",
            partner.status === 'ACTIVE' ? "bg-emerald-100 text-emerald-600 border-emerald-200" :
            partner.status === 'AUDITING' ? "bg-amber-100 text-amber-600 border-amber-200" : "bg-rose-100 text-rose-600 border-rose-200"
          )}>
            {partner.status === 'ACTIVE' ? (language === 'vi' ? 'Đang hoạt động' : 'Active') :
             partner.status === 'AUDITING' ? (language === 'vi' ? 'Đang đánh giá' : 'Auditing') : (language === 'vi' ? 'Đang tạm dừng' : 'Suspended')}
          </span>
       </div>
       <div className="p-8 flex-1 flex flex-col">
          <h4 className="text-xl font-bold mb-1">{partner.name}</h4>
          <p className="text-xs text-gray-500 mb-6">{partner.type}</p>
          
          <div className="space-y-4 mb-8">
             <div className="flex items-center space-x-3 text-gray-500">
                <Mail size={14} className="text-gray-300" />
                <span className="text-xs truncate font-medium">{partner.email}</span>
             </div>
             <div className="flex items-center space-x-3 text-gray-500">
                <FileCode size={14} className="text-gray-300" />
                <span className="text-xs font-medium">{language === 'vi' ? 'Dự án' : 'Project'}: {partner.project}</span>
             </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-50 flex items-center space-x-2">
             <button className="flex-1 py-3 border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">{t('viewDetails')}</button>
             <button className="p-3 border border-gray-100 rounded-xl text-gray-400 hover:text-black transition-colors"><MoreVertical size={14} /></button>
          </div>
       </div>
    </div>
  );
};

function AssetMini({ name, val }: { name: string, val: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-[#F1F3F5] last:border-0">
       <span className="text-xs font-medium text-gray-600">{name}</span>
       <span className="text-xs font-bold">{val}</span>
    </div>
  );
}

const RiskMetricCard = ({ label, score, subFactors }: { label: string, score: number, subFactors?: any[] }) => {
  return (
    <motion.div 
      variants={cardVariants}
      className="bg-white border border-[#E9ECEF] rounded-[32px] p-8 shadow-sm group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="bg-gray-50 p-3 rounded-2xl text-black shadow-inner group-hover:scale-110 transition-transform duration-500">
           {label.includes('Thị trường') || label.includes('Market') ? <Globe size={20} /> :
            label.includes('Thanh khoản') || label.includes('Liquidity') ? <Wallet size={20} /> :
            label.includes('Pháp lý') || label.includes('Legal') ? <Scale size={20} /> : <Settings size={20} />}
        </div>
        <div className={cn(
          "flex items-center font-bold px-2 py-1 rounded-lg",
          score < 30 ? "bg-emerald-50 text-emerald-500" : 
          score < 70 ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-500"
        )}>
           {score < 70 ? <ArrowDownRight size={14} className="mr-1" /> : <ArrowUpRight size={14} className="mr-1" />}
           <span className="text-[10px]">{score < 30 ? 'STABLE' : score < 70 ? 'MEDIUM' : 'CRITICAL'}</span>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-end space-x-2 mb-4">
         <h4 className="text-4xl font-black">{score}</h4>
         <span className="text-gray-300 font-bold text-sm mb-1">/ 100</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            score < 30 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : 
            score < 70 ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
          )}
        />
      </div>

      {subFactors && subFactors.length > 0 && (
        <div className="mt-auto space-y-4 pt-6 border-t border-gray-50">
           {subFactors.map((factor, i) => (
             <div key={i} className="flex justify-between items-center group/factor">
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">{factor.name}</span>
                 <div className="w-20 h-1 bg-gray-50 rounded-full mt-1 overflow-hidden">
                    <div className={cn("h-full", factor.score > 70 ? "bg-rose-400" : "bg-gray-200")} style={{ width: `${factor.score}%` }}></div>
                 </div>
               </div>
               <div className="flex items-center space-x-2">
                 <span className={cn("text-[10px] font-black", factor.score > 70 ? "text-rose-500" : "text-gray-400")}>{factor.score}%</span>
                 {factor.trend === 'up' ? <TrendingUp size={12} className="text-rose-400" /> : <TrendingDown size={12} className="text-emerald-400" />}
               </div>
             </div>
           ))}
        </div>
      )}
    </motion.div>
  );
};

const RiskScoreCircle = ({ score, index, language }: { score: number, index: string, language: string }) => {
  const percentage = (score / 100) * 100;
  const strokeDasharray = 283; // 2 * PI * r
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-gray-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="45" fill="transparent"></circle>
          <motion.circle 
            initial={{ strokeDashoffset: strokeDasharray }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={cn(
              "stroke-current transform -rotate-90 origin-center transition-all duration-1000",
              score < 30 ? "text-emerald-500" : score < 70 ? "text-amber-500" : "text-rose-500"
            )} 
            strokeWidth="8" 
            strokeDasharray={strokeDasharray}
            cx="50" cy="50" r="45" fill="transparent" strokeLinecap="round"
          ></motion.circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-black">{score}</span>
        </div>
      </div>
      <div className="ml-8 text-left">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">RISK SCORE</p>
        <h4 className="text-2xl font-black text-gray-900">{index === 'HIGH' ? 'Cao' : index === 'MEDIUM' ? 'Trung bình' : index === 'CRITICAL' ? 'Nguy hiểm' : 'Thấp'}</h4>
        <p className="text-[10px] text-gray-500 font-medium">Thấp hơn 12% so với tháng trước</p>
      </div>
    </div>
  );
};

const RiskHeatmap = ({ selectedPoint }: { selectedPoint: { impact: number, probability: number } }) => {
  return (
    <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Ma trận Rủi ro 5x5</h3>
        <Info size={16} className="text-gray-400" />
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <div className="flex flex-col justify-between py-2 mr-4">
             <span className="text-[8px] font-black uppercase text-gray-400 -rotate-90 origin-center">Tác động</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 flex-1">
            {[...Array(25)].map((_, i) => {
              const row = 4 - Math.floor(i / 5);
              const col = (i % 5) + 1;
              const isSelected = selectedPoint.impact === row && selectedPoint.probability === col;
              
              const intensity = row + col;
              let bgColor = "bg-gray-200";
              if (intensity >= 8) bgColor = "bg-rose-500/20";
              else if (intensity >= 6) bgColor = "bg-amber-500/20";
              else if (intensity >= 4) bgColor = "bg-emerald-500/20";

              return (
                <div key={i} className={cn("aspect-square rounded-sm flex items-center justify-center transition-all", bgColor)}>
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-black rounded-full shadow-lg ring-4 ring-white"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center mt-6">
           <span className="text-[8px] font-black uppercase text-gray-400">Khả năng xảy ra</span>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
         <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-black"></div><span className="text-[10px] font-bold text-gray-500">Thị trường</span></div>
         <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-gray-400"></div><span className="text-[10px] font-bold text-gray-500">Pháp lý</span></div>
         <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-gray-300"></div><span className="text-[10px] font-bold text-gray-500">Vận hành</span></div>
         <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-gray-200"></div><span className="text-[10px] font-bold text-gray-500">Tài chính</span></div>
      </div>
    </div>
  );
};

const RiskTrendDetailChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Xu hướng Rủi ro</h3>
          <p className="text-[10px] text-gray-400 mt-1">6 tháng gần nhất</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 text-[8px] font-bold border border-gray-100">
           <button className="px-3 py-1 bg-gray-100 rounded">SCORE</button>
           <button className="px-3 py-1 text-gray-400">EXPOSURE</button>
        </div>
      </div>
      <div className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#000" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECEF" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 700, fill: '#ADB5BD' }} dy={10} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '10px' }}
            />
            <Area type="monotone" dataKey="score" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#riskGradient)" dot={{ r: 4, fill: 'white', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
         <div>
            <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">Mức cao nhất</p>
            <p className="text-xl font-black">58</p>
         </div>
         <div>
            <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">Mức thấp nhất</p>
            <p className="text-xl font-black">34</p>
         </div>
         <div>
            <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">Trung bình</p>
            <p className="text-xl font-black text-gray-900">45.2</p>
         </div>
      </div>
    </div>
  );
};



const EffectivenessView = ({ entity, t }: { entity: any, t: any }) => {
  const effectiveness = entity.effectiveness;
  if (!effectiveness) return <div className="p-20 text-center text-gray-400">Dữ liệu hiệu quả đang được tổng hợp...</div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">PHÒNG QUẢN LÝ RỦI RO › BÁO CÁO HIỆU QUẢ</p>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-2">{t('postMitigationAnalysis')}</h2>
            <p className="text-xl font-medium text-gray-400 italic">{entity.name}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">MÃ HỒ SƠ: RH-9921-2024</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">NGÀY PHÁT HÀNH: 24/05/2024</p>
          </div>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-6">{t('efficiencyScore')}</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-7xl font-black">{effectiveness.score}</span>
                <span className="text-2xl font-bold text-gray-300">%</span>
              </div>
              <p className="text-xs font-black text-emerald-500 mt-4 italic">~ {t('highEfficiency')}</p>
           </div>
           <p className="text-xs text-gray-500 mt-10 leading-relaxed">{effectiveness.summary}</p>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-[#F8F9FA] p-10 rounded-[32px] border border-gray-100 flex flex-col space-y-10">
           <div className="flex-1 border-b border-gray-100 pb-10">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-4">{t('beforeRemediation')}</p>
              <div className="flex items-baseline justify-between">
                 <span className="text-4xl font-black text-rose-500">{effectiveness.beforeScore}</span>
                 <span className="text-[10px] font-black bg-rose-50 py-1 px-3 rounded text-rose-500">HIGH RISK</span>
              </div>
              <div className="mt-4 w-full h-8 bg-gray-200 rounded overflow-hidden opacity-20"></div>
           </div>
           <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-4">{t('afterRemediation')}</p>
              <div className="flex items-baseline justify-between">
                 <span className="text-4xl font-black text-emerald-500">{effectiveness.afterScore}</span>
                 <span className="text-[10px] font-black bg-emerald-50 py-1 px-3 rounded text-emerald-500">LOW RISK</span>
              </div>
              <div className="mt-4 w-full h-8 bg-emerald-500 rounded overflow-hidden opacity-20"></div>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-black text-white p-10 rounded-[32px] shadow-2xl flex flex-col justify-center">
           <h4 className="text-xl font-bold mb-2">{t('netRiskReduction')}</h4>
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t('basedOn12MonthAnalysis')}</p>
           <div className="mt-10 border-t border-white/10 pt-10">
              <div className="flex justify-between items-baseline">
                 <span className="text-6xl font-black text-white">{effectiveness.reductionDelta}%</span>
                 <span className="text-[10px] font-black text-gray-500">TOTAL EXPOSURE DELTA</span>
              </div>
           </div>
        </div>
      </div>

      {/* Matrix Comparison */}
      <div className="space-y-8">
         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{t('mitigationMatrix')}</h4>
         <div className="grid grid-cols-2 gap-10 bg-gray-50/50 p-12 rounded-[48px] border border-gray-100">
            <div className="space-y-6 text-center">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('initialState')}</p>
               <div className="grid grid-cols-5 gap-1.5 aspect-square">
                  {[...Array(25)].map((_, i) => {
                    const row = 5 - Math.floor(i / 5);
                    const col = (i % 5) + 1;
                    let bgColor = "bg-white";
                    if (row + col >= 8) bgColor = "bg-rose-500";
                    else if (row + col >= 6) bgColor = "bg-amber-400";
                    else bgColor = "bg-emerald-100";
                    
                    const isOccupied = effectiveness.matrixBefore.some((p: any) => p.impact === row && p.probability === col);

                    return (
                      <div key={i} className={cn("rounded-sm flex items-center justify-center", bgColor)}>
                         {isOccupied && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>}
                      </div>
                    );
                  })}
               </div>
            </div>
            <div className="space-y-6 text-center relative">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('mitigationResult')}</p>
               <div className="grid grid-cols-5 gap-1.5 aspect-square opacity-30">
                  {[...Array(25)].map((_, i) => {
                    const row = 5 - Math.floor(i / 5);
                    const col = (i % 5) + 1;
                    return <div key={i} className="bg-rose-50 rounded-sm"></div>;
                  })}
               </div>
               <div className="absolute inset-0 top-12 grid grid-cols-5 gap-1.5 aspect-square">
                  {[...Array(25)].map((_, i) => {
                    const row = 5 - Math.floor(i / 5);
                    const col = (i % 5) + 1;
                    const isOccupied = effectiveness.matrixAfter.some((p: any) => p.impact === row && p.probability === col);
                    const isInSafeZone = row <= 2 && col <= 2;
                    return (
                      <div key={i} className={cn("rounded-sm flex items-center justify-center", isInSafeZone ? "bg-emerald-400" : "transparent")}>
                         {isOccupied && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>}
                      </div>
                    );
                  })}
               </div>
               <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                  <button className="bg-black text-white p-4 rounded-xl shadow-lg transform translate-x-10">
                     <Download size={20} />
                  </button>
               </div>
            </div>
         </div>
         <p className="text-[10px] text-gray-400 italic italic">* Các điểm chấm trắng đại diện cho các rủi ro chiến lược chính đã được dịch chuyển về vùng an toàn.</p>
      </div>

      {/* Timeline */}
      <div className="space-y-10">
         <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">{t('remediationTimeline')}</h3>
         <div className="space-y-12 pl-10 border-l border-gray-100">
            {effectiveness.timeline.map((item: any, i: number) => (
               <div key={i} className="relative group">
                  <div className="absolute -left-12 top-0 w-4 h-4 bg-black rounded-full border-4 border-white ring-1 ring-gray-100 group-last:bg-emerald-500"></div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">{item.date}</p>
                  <h4 className="text-lg font-black mb-3">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mb-4">{item.description}</p>
                  <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-tighter italic">{item.status}</span>
               </div>
            ))}
         </div>
      </div>

      {/* Residual Risk and Lessons */}
      <div className="grid grid-cols-2 gap-10">
         <div className="space-y-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">{t('residualRisk')}</h3>
            <div className="space-y-4">
               {effectiveness.residualRisks.map((risk: any, i: number) => (
                  <div key={i} className="bg-amber-50/30 border-l-4 border-amber-400 p-6 rounded-r-2xl">
                     <div className="flex items-center space-x-3 mb-2">
                        <AlertTriangle size={14} className="text-amber-500" />
                        <h4 className="text-xs font-black">{risk.title}</h4>
                     </div>
                     <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{risk.description}</p>
                  </div>
               ))}
            </div>
         </div>
         <div className="space-y-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">{t('lessonsAndRecommendations')}</h3>
            <div className="bg-white border border-gray-100 rounded-[32px] p-10 space-y-4 shadow-sm">
               {effectiveness.lessons.map((lesson: string, i: number) => (
                  <div key={i} className="flex items-start space-x-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5"></div>
                     <p className="text-xs font-medium text-gray-700 leading-relaxed italic">{lesson}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Approval Block */}
      <div className="bg-gray-50 p-16 rounded-[48px] flex items-center justify-between">
         <div className="flex-1 pr-20">
            <h4 className="text-2xl font-black mb-4">{t('approveReport')}</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-medium italic">{t('approvalStatement')}</p>
         </div>
         <div className="flex flex-col items-center">
            <div className="mb-4">
               <span className="font-serif text-5xl text-gray-300 italic opacity-50">Julian Sterling</span>
               <div className="w-64 h-px bg-gray-200 mt-4"></div>
            </div>
            <p className="text-[10px] font-black uppercase text-gray-900 tracking-widest mb-1">JULIAN STERLING</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">GIÁM ĐỐC QUẢN TRỊ RỦI RO (CRO)</p>
         </div>
         <div className="ml-10">
            <button className="bg-black text-white px-10 py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform flex flex-col items-center space-y-2">
               <span>KÝ SỐ &</span>
               <span>PHÁT HÀNH</span>
            </button>
         </div>
      </div>
    </div>
  );
};

const ValuationView = ({ assetId, onBack }: { assetId: string, onBack: () => void }) => {
  const { t, language } = useTranslation();
  const [asset, setAsset] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/assets/${assetId}/valuation-details`)
      .then(res => res.json())
      .then(data => {
        setAsset(data);
        setLoading(false);
      });
  }, [assetId]);

  if (loading) return (
    <div className="flex items-center justify-center h-[500px]">
      <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
        <button onClick={onBack} className="hover:text-black transition-colors">{t('asset')}</button>
        <ChevronRight size={12} />
        <span className="text-gray-900">{asset.category} {asset.name}</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="max-w-xl">
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 mb-4">{t('valuationAndFluctuation')}</h1>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">{t('valuationSubtitle')}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{t('currentMarketValue')}</p>
          <div className="flex flex-col items-end">
            <h2 className="text-4xl font-black tracking-tight">{asset.value.toLocaleString()} <span className="text-base font-bold text-gray-400">VND</span></h2>
            <div className="flex items-center text-emerald-500 font-bold text-sm mt-1">
              <TrendingUp size={16} className="mr-1" />
              <span>+{asset.valuationSummary?.lastYearGrowth || 0}% {t('vsLastYear')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Chart Section */}
        <div className="col-span-8 bg-gray-50/50 rounded-[40px] border border-gray-100 p-10 space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-xs uppercase font-black tracking-widest text-gray-500">{t('valueHistoryChart')}</h3>
              <div className="flex bg-white/80 p-1 rounded-xl border border-gray-100">
                 {['1Y', '5Y', 'MAX'].map(p => (
                   <button key={p} className={cn(
                     "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                     p === '1Y' ? "bg-black text-white shadow-lg" : "text-gray-400 hover:text-black"
                   )}>{p}</button>
                 ))}
              </div>
           </div>

           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={asset.valuationChart || []}>
                 <defs>
                   <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Tooltip 
                   content={({ active, payload }) => {
                     if (active && payload && payload.length) {
                       return (
                         <div className="bg-black text-white p-3 rounded-xl shadow-huge border border-white/10">
                           <p className="text-[10px] font-bold uppercase opacity-50 mb-1">{payload[0].payload.year}</p>
                           <p className="text-sm font-black">{payload[0].value}B VND</p>
                         </div>
                       );
                     }
                     return null;
                   }}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="value" 
                   stroke="#000000" 
                   strokeWidth={4} 
                   fillOpacity={1} 
                   fill="url(#colorValue)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>

           <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-6">
              <span>2018</span>
              <span>2020</span>
              <span>2022</span>
              <span className="text-black">Hiện tại</span>
           </div>
        </div>

        {/* Info Cards Side */}
        <div className="col-span-4 space-y-8">
           <div className="bg-black text-white p-10 rounded-[40px] shadow-huge space-y-10 relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-10">{t('performanceMetrics')}</h3>
                 
                 <div className="space-y-10">
                    <div>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{t('fiveYearGrowth')}</p>
                       <p className="text-5xl font-black leading-none">+{asset.valuationSummary?.growth5Y || 0}%</p>
                    </div>
                    
                    <div>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{t('estimatedCumulativeProfit')}</p>
                       <p className="text-3xl font-black italic">{asset.valuationSummary?.estimatedProfit || 0} tỷ <span className="text-sm not-italic opacity-50 uppercase ml-1 font-bold">VND</span></p>
                    </div>
                 </div>
              </div>

              <button className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl relative z-10">
                {t('requestRevaluation')}
              </button>

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] -mr-10 -mt-10"></div>
           </div>

           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8 h-full">
              <h3 className="text-[10px] uppercase font-black tracking-widest text-gray-500">{t('fluctuationReasons')}</h3>
              
              <div className="space-y-10">
                 {(asset.fluctuationReasons || []).map((reason: any, idx: number) => (
                   <div key={idx} className="relative pl-8">
                      <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-black"></div>
                      {idx < (asset.fluctuationReasons?.length - 1) && (
                        <div className="absolute left-[3.5px] top-4 w-[1px] h-[calc(100%+40px)] bg-gray-100"></div>
                      )}
                      
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{reason.date}</p>
                      <h4 className="text-xs font-black text-gray-900 mb-2">{reason.title}</h4>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{reason.description}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Detailed Table Section */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-9 bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xs uppercase font-black tracking-widest text-gray-500">{t('detailedValuationTable')}</h3>
              <button className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                <Download size={14} className="mr-2" /> {language === 'vi' ? 'Xuất báo cáo PDF' : 'Export PDF Report'}
              </button>
           </div>

           <table className="w-full text-left">
              <thead>
                 <tr className="text-[10px] uppercase font-black text-gray-300 border-b border-gray-50">
                    <th className="pb-6 px-4">{t('valuationDate')}</th>
                    <th className="pb-6 px-4">{t('assetValue')}</th>
                    <th className="pb-6 px-4">Biến động (%)</th>
                    <th className="pb-6 px-4">{t('appraisalUnit')}</th>
                    <th className="pb-6 px-4">{t('valuationStatus')}</th>
                 </tr>
              </thead>
              <tbody className="text-[11px]">
                 {(asset.valuationHistory || []).map((hist: any, idx: number) => (
                   <tr key={idx} className="border-b border-gray-50 last:border-0 group hover:bg-gray-50/50 transition-colors">
                      <td className="py-6 px-4 font-black text-gray-900">{hist.date}</td>
                      <td className="py-6 px-4 font-black">{hist.value.toLocaleString()}</td>
                      <td className="py-6 px-4">
                         <span className={cn(
                           "font-black",
                           hist.change > 0 ? "text-emerald-500" : hist.change < 0 ? "text-rose-500" : "text-gray-400"
                         )}>
                            {hist.change > 0 ? `+${hist.change}%` : hist.change === 0 ? '0.0%' : `${hist.change}%`}
                         </span>
                      </td>
                      <td className="py-6 px-4 font-medium text-gray-500">{hist.appraiser}</td>
                      <td className="py-6 px-4">
                         <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md font-black text-[9px] uppercase">{hist.status}</span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Risk Snippet */}
        <div className="col-span-3 bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm flex flex-col justify-between">
           <div>
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-6">{t('riskShortAnalysis')}</p>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-baseline mb-2">
                       <h4 className="text-xs font-black">Thanh khoản</h4>
                       <span className="text-[10px] font-black uppercase text-amber-500">Trung bình</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500 w-[60%]"></div>
                    </div>
                 </div>
                 <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Dự kiến thời gian chuyển nhượng khoảng 6-9 tháng dựa trên dữ liệu giao dịch khu vực.</p>
              </div>
           </div>

           <div className="pt-10 border-t border-gray-50 flex items-center space-x-4">
               <div className="w-12 h-12 bg-slate-800 rounded-2xl overflow-hidden border border-gray-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tuấn" alt="Advisor" />
               </div>
               <div>
                  <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">{t('advisor')}</p>
                  <p className="text-xs font-black">Lê Minh Tuấn</p>
                  <p className="text-[10px] text-gray-400 font-medium underline">tuan.le@elysiumledger.com</p>
               </div>
           </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="pt-12 border-t border-gray-100 flex justify-between items-start text-[10px] font-medium text-gray-400 leading-relaxed uppercase tracking-widest">
         <div className="max-w-2xl">
            Miễn trừ trách nhiệm: {t('disclaimer')}
         </div>
      </footer>
    </div>
  );
};

const InternalChatView = () => {
  const { t, language } = useTranslation();
  const [messages, setMessages] = React.useState<any[]>([]);
  const [inputText, setInputText] = React.useState('');
  const [ws, setWs] = React.useState<WebSocket | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Simulation of current user (Huy Nguyễn)
  const currentUser = { id: 'tm-001', name: 'Huy Nguyễn' };

  React.useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    
    socket.onopen = () => console.log('Connected to chat server');
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'history') {
        setMessages(payload.data);
      } else if (payload.type === 'chat') {
        setMessages(prev => [...prev, payload.data]);
      }
    };

    setWs(socket as any);
    return () => socket.close();
  }, []);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !ws) return;

    ws.send(JSON.stringify({
      type: 'chat',
      senderId: currentUser.id,
      text: inputText
    }));
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden">
       {/* Chat Header */}
       <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
             <h2 className="text-sm font-black tracking-tight">{t('internalChat')}</h2>
             <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{t('companyMembersOnly')}</p>
          </div>
          <div className="flex items-center space-x-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">{t('online')}</span>
          </div>
       </div>

       {/* Messages Area */}
       <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
          {messages.map((msg, i) => {
             const isMe = msg.sender === currentUser.id;
             const senderName = msg.sender === 'tm-001' ? 'Huy Nguyễn' : 
                                msg.sender === 'tm-002' ? 'Nguyễn Hoàng Nam' : 
                                msg.sender === 'tm-003' ? 'Phạm Thảo Vy' : 'Admin';
             
             return (
               <div key={msg.id || i} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                  <div className="flex items-baseline space-x-2 mb-1">
                     <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{senderName}</span>
                     <span className="text-[7px] text-gray-300 font-medium">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={cn(
                    "max-w-[85%] p-3 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm",
                    isMe ? "bg-black text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none"
                  )}>
                     {msg.text}
                  </div>
               </div>
             );
          })}
       </div>

       {/* Input Area */}
       <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center space-x-3">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('typeMessage')}
            className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-3 text-[11px] font-medium focus:outline-none focus:placeholder-gray-300 transition-all shadow-sm"
          />
          <button 
            type="submit"
            className="bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center shadow-lg"
          >
             <ArrowRight size={14} />
          </button>
       </form>
    </div>
  );
};

const DetailedAnalysisCard = ({ title, icon: Icon, factors }: { title: string, icon: any, factors: any[] }) => {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-8">
        <Icon size={18} className="text-gray-900" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">{title}</h3>
      </div>
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {factors?.map((f, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase">{f.name}</span>
              <span className={cn(
                "text-[10px] font-black",
                f.status === 'AN TOÀN' ? "text-emerald-500" : 
                f.status === 'ĐANG XÉT DUYỆT' ? "text-amber-500" : "text-black"
              )}>
                {f.status || `${f.score}%`}
              </span>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${f.score}%` }}
                 className={cn(
                   "h-full", 
                   f.status === 'AN TOÀN' ? "bg-emerald-500" :
                   f.status === 'ĐANG XÉT DUYỆT' ? "bg-amber-500" : 
                   f.score > 70 ? "bg-black" : "bg-gray-300"
                 )}
               ></motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgressBars = ({ percentage }: { percentage: number }) => {
  return (
    <div className="flex items-end justify-between h-32 space-x-1">
      {[...Array(12)].map((_, i) => {
        const height = 20 + Math.random() * 80;
        const isActive = (i / 12) * 100 < percentage;
        return (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            className={cn(
              "w-full rounded-sm",
              isActive ? "bg-black" : "bg-gray-100"
            )}
          />
        );
      })}
    </div>
  );
};

const MitigationView = ({ entity, language, t }: { entity: any, language: string, t: any }) => {
  return (
    <div className="space-y-12">
      {/* Header Info */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
           <div className="w-8 h-px bg-black"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('riskMitigationStrategy')}</span>
        </div>
        <div className="flex justify-between items-end">
           <div>
              <h2 className="text-6xl font-black tracking-tighter mb-6">{entity.name}</h2>
              <p className="text-xs text-gray-500 max-w-lg leading-relaxed">
                 Kế hoạch khắc phục và giảm thiểu rủi ro chiến lược cho giai đoạn Q4/2024. 
                 Tập trung vào tính thanh khoản và ổn định ngoại hối.
              </p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Chỉ số rủi ro hiện tại</p>
              <div className="flex items-baseline justify-end space-x-2">
                 <span className="text-6xl font-black">{entity.totalRiskScore / 10}</span>
              </div>
              <p className="text-[10px] text-rose-500 font-black mt-2">~ Mức độ cao</p>
           </div>
        </div>
      </div>

      {/* Progress and Summary */}
      <div className="grid grid-cols-12 gap-8">
         <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm flex items-center">
            <div className="flex-1 pr-10 border-r border-gray-100">
               <h4 className="text-xl font-black mb-1">{t('overallMitigationProgress')}</h4>
               <p className="text-[10px] text-gray-400 font-bold">{entity.mitigationProgress}% {t('goalsAchieved')}</p>
               <div className="mt-10">
                  <ProgressBars percentage={entity.mitigationProgress} />
               </div>
            </div>
            <div className="pl-10 text-center">
               <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">ACTIONS</span>
               <span className="text-2xl font-black">{entity.mitigationActionsCount}</span>
            </div>
         </div>
         <div className="col-span-12 lg:col-span-4 bg-black text-white p-10 rounded-[32px] shadow-xl">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">{t('riskStatus')}</h4>
            <div className="space-y-8">
               {entity.riskStatusSummary?.map((s: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-400">{s.label}</span>
                     <span className={cn(
                       "text-xs font-black",
                       s.color === 'rose' ? "text-rose-500" : s.color === 'amber' ? "text-amber-500" : "text-emerald-500"
                     )}>{s.value}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Priority Risks Table */}
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black">{t('priorityRiskEvents')}</h3>
            <button className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-lg">
               {t('filterByLevel')}
            </button>
         </div>
         <div className="space-y-4">
            {entity.priorityRisks?.map((risk: any) => (
               <div key={risk.id} className="bg-gray-50/50 border border-gray-100 rounded-[32px] p-10 flex flex-col lg:flex-row lg:items-start space-y-8 lg:space-y-0 relative overflow-hidden group">
                  {risk.type.includes('tài chính') && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>}
                  <div className="lg:w-1/3">
                     <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block mb-2">{risk.type}</span>
                     <h4 className="text-xl font-black mb-2">{risk.title}</h4>
                     <p className="text-[10px] text-gray-400 font-bold">{risk.exposure}</p>
                  </div>
                  <div className="flex-1">
                     <div className="grid grid-cols-4 gap-4 mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Hành động</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase text-center lg:text-left">Người phụ trách</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase text-center">Thời hạn</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase text-right">Trạng thái</span>
                     </div>
                     <div className="space-y-6">
                        {risk.actions.map((act: any, i: number) => (
                           <div key={i} className="grid grid-cols-4 gap-4 items-center">
                              <p className="text-xs font-bold text-gray-900">{act.name}</p>
                              <p className="text-xs font-medium text-gray-600 text-center lg:text-left">{act.owner}</p>
                              <p className={cn(
                                "text-xs font-black text-center",
                                act.status === 'DELAYED' ? "text-rose-500" : "text-gray-900"
                              )}>{act.deadline}</p>
                              <div className="text-right">
                                 <span className={cn(
                                   "text-[8px] font-black px-3 py-1 rounded-full",
                                   act.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" : 
                                   act.status === 'PROCESSING' ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                                 )}>
                                    {act.status === 'COMPLETED' ? t('completed') : act.status === 'PROCESSING' ? t('processing') : t('delayed')}
                                 </span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Discussion and Change Log */}
      <div className="grid grid-cols-2 gap-10">
         <div className="space-y-6">
            <div className="flex items-center space-x-3">
               <Mail size={18} />
               <h3 className="text-xl font-black">{t('internalDiscussion')}</h3>
            </div>
            <div className="bg-gray-50/50 border border-gray-100 rounded-[32px] p-8 space-y-6">
               {entity.discussion?.map((d: any, i: number) => (
                  <div key={i} className="flex space-x-4">
                     <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">
                        {d.avatar}
                     </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex-1">
                        <div className="flex justify-between items-center mb-2">
                           <span className="font-black text-xs">{d.user}</span>
                           <span className="text-[10px] text-gray-300 font-bold">{d.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{d.message}</p>
                     </div>
                  </div>
               ))}
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Nhập tin nhắn của bạn..." 
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-xs font-medium focus:ring-0 focus:border-black transition-all"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:scale-110 transition-transform">
                     <ArrowRight size={18} />
                  </button>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="flex items-center space-x-3">
               <Clock size={18} />
               <h3 className="text-xl font-black">{t('changeLog')}</h3>
            </div>
            <div className="relative pl-8 space-y-10 py-4">
               <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100"></div>
               {entity.changeLog?.map((log: any, i: number) => (
                  <div key={i} className="relative">
                     <div className={cn(
                       "absolute -left-10 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-1 ring-gray-100",
                       log.level === 'critical' ? "bg-rose-500" : log.level === 'success' ? "bg-emerald-500" : "bg-gray-300"
                     )}></div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{log.time}</p>
                     <p className="text-xs font-bold text-gray-900 max-w-sm leading-relaxed">
                        {log.message.split('Nghiêm trọng').map((part: string, idx: number, arr: any[]) => (
                          <React.Fragment key={idx}>
                            {part}
                            {idx < arr.length - 1 && <span className="text-rose-500">Nghiêm trọng</span>}
                          </React.Fragment>
                        ))}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

function RiskAnalyzerView() {
  const { t, language } = useTranslation();
  const [data, setData] = React.useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [showDetail, setShowDetail] = React.useState(false);
  const [detailTab, setDetailTab] = React.useState<'analysis' | 'mitigation' | 'effectiveness'>('analysis');

  React.useEffect(() => {
    fetch('/api/risk/analysis')
      .then(res => res.json())
      .then(d => {
        setData(d);
        if (d.length > 0) setSelectedEntity(d[0]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse font-bold">{language === 'vi' ? 'Đang phân tích dữ liệu rủi ro...' : 'Analyzing risk data...'}</div>;

  if (showDetail && selectedEntity) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10 pb-20"
      >
        <div className="flex items-center justify-between">
           <div className="flex items-center space-x-6">
              <button 
                onClick={() => setShowDetail(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all transform hover:scale-110"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                 <button 
                   onClick={() => setDetailTab('analysis')}
                   className={cn(
                     "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                     detailTab === 'analysis' ? "bg-white shadow-sm" : "text-gray-400 hover:text-black"
                   )}
                 >
                   Phân tích
                 </button>
                 <button 
                   onClick={() => setDetailTab('mitigation')}
                   className={cn(
                     "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                     detailTab === 'mitigation' ? "bg-white shadow-sm" : "text-gray-400 hover:text-black"
                   )}
                 >
                   Khắc phục
                 </button>
                 <button 
                   onClick={() => setDetailTab('effectiveness')}
                   className={cn(
                     "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                     detailTab === 'effectiveness' ? "bg-white shadow-sm" : "text-gray-400 hover:text-black"
                   )}
                 >
                   Hiệu quả
                 </button>
              </div>
           </div>
        </div>

        {detailTab === 'analysis' ? (
          <div className="space-y-10">
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Chi tiết Thực thể</p>
                  <div className="flex items-baseline space-x-6">
                    <h2 className="text-5xl font-black tracking-tighter">{selectedEntity.name}</h2>
                    <div className="flex items-center space-x-4">
                      <span className="px-3 py-1 bg-gray-100 rounded text-[10px] font-bold uppercase tracking-widest">{selectedEntity.type}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tổng rủi ro: <span className="text-black">$2.4B</span></span>
                    </div>
                  </div>
               </div>
               <RiskScoreCircle score={selectedEntity.totalRiskScore} index={selectedEntity.index} language={language} />
            </div>

            <div className="grid grid-cols-2 gap-10">
               <RiskHeatmap selectedPoint={selectedEntity.matrix || { impact: 3, probability: 3 }} />
               <RiskTrendDetailChart data={selectedEntity.trends || []} />
            </div>

            <div>
               <h3 className="text-2xl font-black mb-8">Phân tích Chi tiết</h3>
               <div className="grid grid-cols-3 gap-8">
                  <DetailedAnalysisCard title="Rủi ro Thị trường" icon={TrendingUp} factors={selectedEntity.subFactors?.market} />
                  <DetailedAnalysisCard title="Rủi ro Pháp lý" icon={Scale} factors={selectedEntity.subFactors?.legal} />
                  <DetailedAnalysisCard title="Rủi ro Vận hành" icon={Settings} factors={selectedEntity.subFactors?.operational} />
               </div>
            </div>

            <div className="bg-black text-white p-16 rounded-[48px] shadow-2xl relative overflow-hidden">
               {/* ... (previous analysis alerts code) */}
               <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-12">
                     <AlertTriangle size={24} className="text-rose-500" />
                     <h3 className="text-xl font-bold uppercase tracking-widest">Cảnh báo rủi ro quan trọng</h3>
                  </div>
                  <div className="space-y-12">
                     {selectedEntity.alerts?.map((alert: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between pb-12 border-b border-white/10 last:border-0 last:pb-0">
                           <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-2">
                                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{alert.time}</span>
                                 <h4 className="text-lg font-bold">{alert.message}</h4>
                              </div>
                              <p className="text-sm text-gray-500 italic">{alert.detail}</p>
                           </div>
                           <button className="px-8 py-3 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                              {alert.level}
                           </button>
                        </div>
                     )) || (
                       <p className="text-gray-500 italic">Không có cảnh báo rủi ro trọng yếu tại thời điểm này.</p>
                     )}
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-12 opacity-5">
                  <ShieldAlert size={200} />
               </div>
            </div>
          </div>
        ) : detailTab === 'mitigation' ? (
          <MitigationView entity={selectedEntity} language={language} t={t} />
        ) : (
          <EffectivenessView entity={selectedEntity} t={t} />
        )}

        <footer className="mt-20 pt-20 border-t border-gray-100 text-center">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300">
              ELYSIUM LEDGER © 2024 • PRIVATE ASSET GOVERNANCE SYSTEM
            </p>
        </footer>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-10 pb-20"
    >
      <div className="flex justify-between items-end">
        <motion.div variants={cardVariants}>
          <h2 className="text-3xl font-bold tracking-tight">{t('customerRiskAnalysis')}</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-2xl">
            {language === 'vi' 
              ? "Hệ thống tự động chấm điểm rủi ro dựa trên 4 trụ cột chính: Thị trường, Thanh khoản, Pháp lý và Vận hành."
              : "Automated risk scoring system based on 4 key pillars: Market, Liquidity, Legal, and Operational."}
          </p>
        </motion.div>
        <motion.div variants={cardVariants} className="flex space-x-3">
          <button className="px-6 py-3 bg-white border border-gray-200 text-black rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center shadow-sm">
             <Download size={16} className="mr-2" /> {t('exportRiskPDF')}
          </button>
          <button className="px-6 py-3 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center shadow-lg">
             <ShieldAlert size={16} className="mr-2" /> {t('runStressTest')}
          </button>
        </motion.div>
      </div>

      {selectedEntity && (
        <div className="grid grid-cols-4 gap-6">
           <RiskMetricCard label={t('riskMarket')} score={selectedEntity.marketScore} subFactors={selectedEntity.subFactors?.market} />
           <RiskMetricCard label={t('riskLiquidity')} score={selectedEntity.liquidityScore} subFactors={selectedEntity.subFactors?.liquidity} />
           <RiskMetricCard label={t('riskLegal')} score={selectedEntity.legalScore} subFactors={selectedEntity.subFactors?.legal} />
           <RiskMetricCard label={t('riskOperational')} score={selectedEntity.operationalScore} subFactors={selectedEntity.subFactors?.operational} />
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
         <div className="col-span-12 lg:col-span-7 space-y-8">
            <AnimatePresence mode="wait">
               {selectedEntity?.alerts?.length > 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-2xl shadow-sm overflow-hidden"
                  >
                     <div className="flex items-center mb-4">
                        <AlertTriangle className="text-rose-500 mr-2" size={20} />
                        <h4 className="text-sm font-black uppercase tracking-widest text-rose-900">Cảnh báo rủi ro trọng yếu ({selectedEntity.alerts.length})</h4>
                     </div>
                     <div className="space-y-3">
                        {selectedEntity.alerts.map((alert: any, i: number) => (
                           <div key={i} className="flex justify-between items-center bg-white/50 p-3 rounded-lg border border-rose-100">
                              <p className="text-xs font-bold text-rose-800">{alert.message}</p>
                              <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded">{alert.level}</span>
                           </div>
                        ))}
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            <motion.div variants={cardVariants} className="bg-white border border-[#E9ECEF] rounded-[32px] overflow-hidden shadow-sm">
               <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                  <h3 className="text-xl font-bold">{t('entityRiskDetails')}</h3>
                  <div className="flex items-center space-x-2 bg-white border rounded-lg px-3 py-1.5 shadow-sm">
                     <Filter size={14} className="text-gray-400" />
                     <span className="text-[10px] font-bold uppercase text-gray-500">Filter</span>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-[#F8F9FA] text-[10px] uppercase font-bold text-gray-400">
                        <tr>
                           <th className="px-8 py-5">Entity</th>
                           <th className="px-8 py-5 text-center">{t('averageScore')}</th>
                           <th className="px-8 py-5">{t('riskIndex')}</th>
                           <th className="px-8 py-5"></th>
                        </tr>
                     </thead>
                     <tbody className="text-sm">
                        {data.map((entity) => (
                          <tr 
                            key={entity.id} 
                            onClick={() => {
                              setSelectedEntity(entity);
                              setShowDetail(true);
                            }}
                            className={cn(
                              "border-t border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer",
                              selectedEntity?.id === entity.id ? "bg-gray-50" : ""
                            )}
                          >
                             <td className="px-8 py-6">
                                <div className="flex flex-col">
                                   <span className="font-bold text-gray-900">{entity.name}</span>
                                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{entity.type}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 border-2 border-gray-100 font-black text-lg">
                                   {entity.totalRiskScore}
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <span className={cn(
                                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm",
                                  entity.index === 'CRITICAL' ? "bg-rose-500 text-white" :
                                  entity.index === 'HIGH' ? "bg-rose-100 text-rose-600" :
                                  entity.index === 'MEDIUM' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                                )}>
                                  {entity.index}
                                </span>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEntity(entity);
                                    setShowDetail(true);
                                  }}
                                  className="text-[10px] font-black uppercase bg-black text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                                >
                                  Xem chi tiết
                                </button>
                                <ChevronRight size={18} className="text-gray-300 ml-4 inline-block" />
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>

            {selectedEntity && (
               <motion.div variants={cardVariants} className="bg-black text-white p-10 rounded-[32px] relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10 grid grid-cols-3 gap-8 items-center">
                     <div className="col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                           <Shield className="text-emerald-400" size={24} />
                           <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Chỉ số rủi ro tổng hợp</h4>
                        </div>
                        <h3 className="text-5xl font-black mb-4">{selectedEntity.totalRiskScore} <span className="text-lg font-bold text-gray-500 uppercase ml-2">{selectedEntity.index}</span></h3>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                           {language === 'vi' 
                             ? "Mức độ phơi nhiễm hiện tại cần sự giám sát chặt chẽ từ ban điều hành và định hướng tái cấu trúc danh mục."
                             : "Current exposure level requires close oversight from management and portfolio restructuring guidance."}
                        </p>
                     </div>
                     <div className="col-span-1 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-700">
                           <TrendingUp size={32} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">+12% trend</span>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <Lock size={120} />
                  </div>
               </motion.div>
            )}
         </div>

         <div className="col-span-12 lg:col-span-5">
            {selectedEntity ? (
               <motion.div 
                 key={selectedEntity.id}
                 variants={cardVariants}
                 className="bg-white border border-[#E9ECEF] rounded-[32px] p-8 shadow-sm h-full"
               >
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                     <h3 className="text-xl font-bold">{t('riskMitigationPlan')}</h3>
                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-black shadow-inner">
                        <BadgeCheck size={20} />
                     </div>
                  </div>

                  <div className="space-y-8">
                     {selectedEntity.mitigationPlan.map((step: any, idx: number) => (
                        <div key={idx} className="relative pl-10 group">
                           {idx !== selectedEntity.mitigationPlan.length - 1 && (
                             <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-gray-100"></div>
                           )}
                           <div className={cn(
                             "absolute left-0 top-1 w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center z-10 transition-colors",
                             step.status === 'COMPLETED' ? "border-emerald-500 text-emerald-500" : 
                             step.status === 'PROCESSING' ? "border-amber-500 text-amber-500" : "border-gray-200 text-gray-400"
                           )}>
                              {step.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                           </div>
                           
                           <div>
                              <div className="flex justify-between items-start mb-1">
                                 <h5 className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors">{step.action}</h5>
                                 <span className={cn(
                                   "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                                   step.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" : 
                                   step.status === 'PROCESSING' ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-400"
                                 )}>{step.status}</span>
                              </div>
                              <div className="flex items-center space-x-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                                 <span className="flex items-center"><UserRound size={12} className="mr-1.5" /> {step.responsible}</span>
                                 <span className="flex items-center"><Clock size={12} className="mr-1.5" /> {step.timeline}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-12 p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-4">
                     <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                     <div>
                        <p className="text-xs font-bold text-rose-900 mb-1">Cảnh báo rủi ro</p>
                        <p className="text-[10px] text-rose-600 leading-relaxed font-medium">
                           Một số hành động khắc phục đã vượt quá thời hạn dự kiến. Yêu cầu xem xét lại nguồn lực nhân sự phụ trách.
                        </p>
                     </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-gray-100">
                     <div className="flex items-center space-x-2 mb-6">
                        <Mail size={16} className="text-gray-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Thảo luận nội bộ</h4>
                     </div>
                     <div className="space-y-4">
                        <div className="flex space-x-3">
                           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">MA</div>
                           <div className="bg-gray-50 p-3 rounded-2xl flex-1">
                              <p className="text-[10px] font-bold mb-1">Minh Anh <span className="text-gray-300 ml-2">14:20</span></p>
                              <p className="text-[10px] text-gray-500">Đã gửi yêu cầu xác nhận Forward Contract cho bên Techcombank.</p>
                           </div>
                        </div>
                        <div className="flex space-x-3">
                           <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">AD</div>
                           <div className="bg-black text-white p-3 rounded-2xl flex-1">
                              <p className="text-[10px] font-bold mb-1">Admin <span className="text-gray-500 ml-2">14:45</span></p>
                              <p className="text-[10px] text-gray-300">Duyệt ngân sách bổ sung cho kế hoạch này. Ưu tiên xử lý nhanh.</p>
                           </div>
                        </div>
                     </div>
                     <div className="mt-4 flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-transparent focus-within:border-gray-200 transition-all">
                        <input type="text" placeholder="Gửi bình luận..." className="bg-transparent border-none text-[10px] focus:ring-0 flex-1 py-1" />
                        <button className="text-black ml-2"><ArrowRight size={14} /></button>
                     </div>
                  </div>

                  <button className="w-full mt-10 py-4 border-2 border-gray-900 text-black hover:bg-black hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                     Cập nhật kế hoạch
                  </button>
               </motion.div>
            ) : (
               <div className="bg-gray-50 border border-dashed rounded-[32px] p-20 text-center flex flex-col items-center justify-center text-gray-400 h-full">
                  <Info size={40} className="mb-4 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Chọn một thực thể để xem kế hoạch khắc phục</p>
               </div>
            )}
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

function ReportsView() {
  const { t, language } = useTranslation();
  const [reportData, setReportData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/reports/comprehensive')
      .then(res => res.json())
      .then(data => {
        setReportData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>
  );

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8 pb-20"
    >
      {/* Header */}
      <div className="flex justify-between items-end">
        <motion.div variants={cardVariants}>
          <h2 className="text-3xl font-bold tracking-tight">{t('detailedReport')}</h2>
        </motion.div>
        <div className="flex items-center space-x-6">
           <div className="flex items-center bg-gray-100 px-4 py-2.5 rounded-xl border border-transparent focus-within:border-black/5 focus-within:bg-white transition-all w-64 shadow-sm">
              <Search className="text-gray-400 mr-3" size={18} />
              <input 
                type="text" 
                placeholder={t('search')} 
                className="bg-transparent border-none outline-none text-sm w-full font-medium" 
              />
           </div>
        </div>
      </div>

      {/* Filters */}
      <motion.div variants={cardVariants} className="grid grid-cols-5 gap-4 items-end">
         <div className="col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Khoảng thời gian</label>
            <button className="w-full flex items-center justify-between bg-white border border-[#E9ECEF] rounded-xl px-4 py-3 text-xs font-bold shadow-sm hover:border-black transition-colors text-left">
               <span className="flex items-center"><Calendar size={14} className="mr-2" /> Q3 2024 (01/07 - 30/09)</span>
               <ChevronRight className="rotate-90" size={14} />
            </button>
         </div>
         <div className="col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Loại tài sản</label>
            <button className="w-full flex items-center justify-between bg-white border border-[#E9ECEF] rounded-xl px-4 py-3 text-xs font-bold shadow-sm hover:border-black transition-colors text-left">
               <span>Tất cả tài sản</span>
               <ChevronRight className="rotate-90" size={14} />
            </button>
         </div>
         <div className="col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Khách hàng</label>
            <button className="w-full flex items-center justify-between bg-white border border-[#E9ECEF] rounded-xl px-4 py-3 text-xs font-bold shadow-sm hover:border-black transition-colors text-left">
               <span className="flex items-center"><UserRound size={14} className="mr-2" /> Phân khúc High-Net-Worth</span>
               <ChevronRight className="rotate-90" size={14} />
            </button>
         </div>
         <div className="col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Nhân sự phụ trách</label>
            <button className="w-full flex items-center justify-between bg-white border border-[#E9ECEF] rounded-xl px-4 py-3 text-xs font-bold shadow-sm hover:border-black transition-colors text-left">
               <span>Tất cả chuyên viên</span>
               <ChevronRight className="rotate-90" size={14} />
            </button>
         </div>
         <div className="col-span-1">
            <button className="w-full bg-black text-white py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 shadow-xl transition-all">
               Áp dụng bộ lọc
            </button>
         </div>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-6">
         <ReportMetricCard 
           label={t('totalROI')} 
           value={`${reportData.metrics.roi}%`} 
           change={`+${reportData.metrics.roiChange}%`} 
           positive 
         />
         <ReportMetricCard 
           label={t('netProfitPL')} 
           value={`${(reportData.metrics.netProfit / 1000000000).toFixed(2)} tỷ`} 
           suffix="VND"
           change={`Tăng ${reportData.metrics.netProfitChange / 1000000} triệu so với tháng trước`}
         />
         <ReportMetricCard 
           label={t('riskIndex')} 
           value={reportData.metrics.riskLevel} 
           isRisk 
         />
         <ReportMetricCard 
           label={t('growthForecast')} 
           value={`+${reportData.metrics.growthForecast}%`} 
           subLabel="Dựa trên dữ liệu thị trường Q4"
           isTrend
         />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-8">
         <motion.div variants={cardVariants} className="col-span-8 bg-white border border-[#E9ECEF] rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h3 className="text-xl font-bold">{t('cashFlowTrend')}</h3>
                  <p className="text-xs text-gray-400 mt-1">{t('cashFlowTrendDesc')}</p>
               </div>
               <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-all">
                     <Download size={14} className="mr-1.5" /> {t('exportExcel')}
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-all">
                     <FileText size={14} className="mr-1.5" /> {t('exportPDF')}
                  </button>
               </div>
            </div>
            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={reportData.cashFlowTrend} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                   <XAxis 
                     dataKey="month" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                   />
                   <Tooltip 
                     cursor={{ fill: '#f8fafc' }}
                     content={({ active, payload }) => {
                       if (active && payload && payload.length) {
                         const data = payload[0].payload;
                         return (
                           <div className="bg-black text-white p-3 rounded-xl shadow-2xl border border-white/10">
                             <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{data.month} {data.forecast ? '(DỰ BÁO)' : ''}</p>
                             <p className="text-sm font-bold text-emerald-400">In: {data.inflow}B</p>
                             <p className="text-sm font-bold text-rose-400">Out: {data.outflow}B</p>
                           </div>
                         );
                       }
                       return null;
                     }}
                   />
                   <Bar 
                     dataKey="inflow" 
                     radius={[4, 4, 0, 0]} 
                   >
                     {reportData.cashFlowTrend.map((entry: any, index: number) => (
                       <Cell 
                         key={`cell-${index}`} 
                         fill={entry.forecast ? '#E2E8F0' : (index === 4 ? '#000000' : '#F1F3F5')} 
                         strokeDasharray={entry.forecast ? "4 4" : "0"}
                       />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

         <motion.div variants={cardVariants} className="col-span-4 bg-white border border-[#E9ECEF] rounded-3xl p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-8">{t('assetAllocation')}</h3>
            <div className="flex-1 space-y-6">
               {reportData.assetAllocation.map((item: any) => (
                  <div key={item.name} className="flex justify-between items-center group cursor-pointer">
                     <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-bold text-gray-700">{item.name}</span>
                     </div>
                     <span className="text-sm font-black">{item.value.toFixed(1)}%</span>
                  </div>
               ))}
            </div>
            <div className="pt-8 mt-auto">
               <button className="w-full py-4 bg-gray-50 text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center border border-gray-100">
                  <PieChartIcon size={14} className="mr-2" /> {t('viewDetailedPortfolio')}
               </button>
            </div>
         </motion.div>
      </div>

      {/* Detailed Client P&L */}
      <motion.div variants={cardVariants} className="bg-white border border-[#E9ECEF] rounded-3xl overflow-hidden shadow-sm">
         <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <div>
               <h3 className="text-xl font-bold">{t('pnlByClient')}</h3>
               <p className="text-xs text-gray-400 mt-1">{t('pnlByClientDesc')}</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
               <Download size={14} className="mr-1.5" /> {t('exportAllExcel')}
            </button>
         </div>
         <table className="w-full text-left">
            <thead className="bg-[#F8F9FA] text-[10px] uppercase font-bold text-gray-400">
               <tr>
                  <th className="px-8 py-5">{t('client')}</th>
                  <th className="px-8 py-5">{t('totalInvestment')}</th>
                  <th className="px-8 py-5">{t('currentValue')}</th>
                  <th className="px-8 py-5">{t('pnlAmount')}</th>
                  <th className="px-8 py-5">{t('pnlPercent')}</th>
                  <th className="px-8 py-5">{t('status')}</th>
                  <th className="px-8 py-5">{t('action')}</th>
               </tr>
            </thead>
            <tbody className="text-sm">
               {reportData.clientReports.map((client: any) => (
                  <tr key={client.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                     <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="font-bold text-gray-900 group-hover:text-black transition-colors">{client.name}</span>
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Mã KH: {client.code}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6 font-medium text-gray-600">{client.investment.toLocaleString()}</td>
                     <td className="px-8 py-6 font-black text-gray-900">{client.currentValue.toLocaleString()}</td>
                     <td className={cn(
                       "px-8 py-6 font-bold",
                       client.pnlVnd >= 0 ? "text-emerald-500" : "text-rose-500"
                     )}>
                       {client.pnlVnd >= 0 ? "+" : ""}{client.pnlVnd.toLocaleString()}
                     </td>
                     <td className="px-8 py-6">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold",
                          client.pnlPercent >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                          {client.pnlPercent >= 0 ? "+" : ""}{client.pnlPercent.toFixed(1)}%
                        </span>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                           <div className={cn(
                             "w-1.5 h-1.5 rounded-full animate-pulse",
                             client.status === 'growing' ? "bg-emerald-500" :
                             client.status === 'underReview' ? "bg-rose-500" : "bg-amber-500"
                           )}></div>
                           <span className="text-[11px] font-bold text-gray-500">{t(client.status)}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <button className="p-2 text-gray-300 hover:text-black transition-colors rounded-lg hover:bg-gray-100">
                           <MoreVertical size={18} />
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </motion.div>

      {/* AI Strategy section */}
      <motion.div 
        variants={cardVariants}
        className="bg-white border-l-4 border-black p-8 rounded-3xl shadow-sm flex items-center justify-between"
      >
         <div className="max-w-3xl">
            <h3 className="text-2xl font-bold tracking-tight mb-3">{t('strategyAdvisory')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {t('strategyAdvisoryDesc')}
            </p>
         </div>
         <div className="flex flex-col items-center space-y-4">
            <button className="px-8 py-4 bg-black text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl whitespace-nowrap">
               {t('viewExportDetails')}
            </button>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('updated2HoursAgo')}</p>
         </div>
      </motion.div>
    </motion.div>
  );
}

function ReportMetricCard({ label, value, change, positive, suffix, isRisk, subLabel, isTrend }: any) {
  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-3xl border border-[#E9ECEF] shadow-sm flex flex-col group hover:border-black transition-all relative overflow-hidden"
    >
      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6">{label}</p>
      <div className="flex flex-col">
         <div className="flex items-baseline space-x-2">
            <h3 className="text-4xl font-black tracking-tighter">{value}</h3>
            {suffix && <span className="text-[10px] font-bold text-gray-400 uppercase">{suffix}</span>}
         </div>
         <div className="mt-4">
           {change && (
             <p className={cn(
               "text-[10px] font-bold",
               positive ? "text-emerald-500" : "text-gray-400"
             )}>{change}</p>
           )}
           {subLabel && <p className="text-[10px] text-gray-400 font-bold">{subLabel}</p>}
           {isRisk && (
             <div className="flex items-center space-x-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-1/3"></div>
                </div>
             </div>
           )}
           {isTrend && (
             <TrendingUp size={16} className="text-gray-400" />
           )}
         </div>
      </div>
      <div className="absolute right-0 bottom-0 w-24 h-1 bg-black translate-y-full group-hover:translate-y-0 transition-transform"></div>
    </motion.div>
  );
}


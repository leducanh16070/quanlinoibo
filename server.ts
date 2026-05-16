import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- CORE UTILITIES ---
  const Logger = {
    info: (msg: string, context: any = {}) => console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, context),
    warn: (msg: string, context: any = {}) => console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, context),
    error: (msg: string, context: any = {}) => console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, context)
  };

  // --- MOCK DATABASE ENTITIES ---
  const auditLogs: any[] = [];
  const workflowSessions: any[] = [];
  const ownership: any[] = [
    { parent: "ent-002", child: "ent-004", percentage: 100 },
    { parent: "ent-001", child: "ent-002", percentage: 51 }
  ];
  
  const entities = [
    { 
      id: "ent-001", 
      name: "Sterling Family Trust", 
      type: "Trust", 
      jurisdiction: "Singapore", 
      status: "Active",
      governance: {
        veto: { name: "David Sterling", role: "Beneficiary UBO", title: "Head of House" },
        executors: [{ name: "Sarah Chen", role: "Trustee Director" }],
        reviewers: [{ name: "Legal Counsel BVI", role: "Compliance Auditor" }]
      },
      aum: 412850000,
      description: "Phân khúc khách hàng tổ chức đa ngành. Trọng tâm đầu tư vào bất động sản cao cấp, hạ tầng năng lượng sạch và quỹ đầu tư mạo hiểm công nghệ cao."
    },
    { 
      id: "ent-002", 
      name: "Tập đoàn Vĩnh Thịnh (V-Holdings)", 
      type: "Holding Company", 
      jurisdiction: "Vietnam", 
      status: "Active",
      governance: {
        veto: { name: "Alexander Vĩnh Cửu", role: "Veto Power (Người phủ quyết)", title: "Chủ tịch Hội đồng" },
        executors: [
          { name: "Elena Vĩnh Cửu", role: "Executor (Người điều hành)", title: "Giám đốc Điều hành" },
          { name: "Marcus Trương", role: "Executor (Người điều hành)", title: "Giám đốc Tài chính" }
        ],
        reviewers: [
          { name: "Hội đồng Pháp lý", role: "Reviewer", title: "Cố vấn Pháp lý" },
          { name: "Ban Kiểm soát", role: "Reviewer", title: "Giám sát" },
          { name: "Cố vấn Thuế", role: "Reviewer", title: "Tài chính" }
        ]
      },
      aum: 412850000,
      description: "Tập đoàn đa ngành tập trung vào Bất động sản, Năng lượng và Tech Ventures."
    },
    { id: "ent-003", name: "Lumina Global Ventures", type: "LP", jurisdiction: "Cayman Islands", status: "Active" },
    { id: "ent-004", name: "Horizon Tower Singapore", type: "SPV", jurisdiction: "Singapore", status: "Active" },
  ];

  const assets = [
    { 
      id: "ast-001", 
      name: "The Grand Marina Saigon", 
      category: "Real Estate", 
      value: 125000000, 
      performance: 8.2, 
      ownerId: "ent-002", 
      risk: "Low", 
      status: "ACTIVE", 
      version: 1,
      allocation: "Real Estate",
      valuationHistory: [
        { date: '15/03/2024', value: 125000000, change: 4.2, appraiser: 'Savills Vietnam', status: 'COMPLETED' },
        { date: '10/09/2023', value: 120000000, change: 1.8, appraiser: 'Internal Team', status: 'COMPLETED' },
        { date: '15/03/2023', value: 118000000, change: 0.0, appraiser: 'Knight Frank', status: 'COMPLETED' },
        { date: '20/08/2022', value: 105000000, change: 15.5, appraiser: 'Savills Vietnam', status: 'COMPLETED' }
      ],
      valuationSummary: {
        growth5Y: 45.8,
        estimatedProfit: 7.7, // in billion
        lastYearGrowth: 12.4
      },
      fluctuationReasons: [
        { date: 'THÁNG 03, 2024', title: 'Thị trường hồi phục', description: 'Nhu cầu bất động sản cao cấp khu vực Đông TP.HCM tăng 15% sau khi các chính sách tín dụng được nới lỏng.' },
        { date: 'THÁNG 08, 2022', title: 'Hạ tầng giao thông', description: 'Khởi công tuyến đường vành đai và cầu nối trực tiếp vào trung tâm tài chính, tạo đà tăng giá mạnh.' },
        { date: 'THÁNG 12, 2019', title: 'Nâng cấp tài sản', description: 'Hoàn thiện gói nội thất cao cấp và cảnh quan sân vườn theo tiêu chuẩn quốc tế.' }
      ],
      valuationChart: [
        { year: '2018', value: 85 },
        { year: '2019', value: 92 },
        { year: '2020', value: 105 },
        { year: '2021', value: 102 },
        { year: '2022', value: 108 },
        { year: '2023', value: 118 },
        { year: '2024', value: 125 }
      ]
    },
    { 
      id: "ast-002", 
      name: "V-Energy Solar Farm", 
      category: "Infrastructure", 
      value: 84300000, 
      performance: 15.7, 
      ownerId: "ent-002", 
      risk: "Medium", 
      status: "ACTIVE", 
      version: 1,
      allocation: "Alternatives"
    },
    { 
      id: "ast-003", 
      name: "Global Blue Chip ETF", 
      category: "Equities", 
      value: 62150000, 
      performance: -2.4, 
      ownerId: "ent-002", 
      risk: "Low", 
      status: "ACTIVE", 
      version: 1,
      allocation: "Equities"
    },
  ];

  const team = [
    { id: "tm-001", name: "Lê Minh Anh", role: "Senior Advisor", aum: "12.5B", target: "20.8B", performance: 85, deptId: "dept-001", managerId: null, status: "ACTIVE", email: "minhanh@elysium.com", cccd: "037201001234", salary: 85000000 },
    { id: "tm-002", name: "Nguyễn Hoàng Nam", role: "Strategy Consultant", aum: "8.2B", target: "20.8B", performance: 42, deptId: "dept-001", managerId: "tm-001", status: "ACTIVE", email: "hoangnam@elysium.com", cccd: "037201005678", salary: 45000000 },
    { id: "tm-003", name: "Phạm Thảo Vy", role: "Project Manager", aum: "4.1B", target: "20.8B", performance: 92, deptId: "dept-002", managerId: "tm-001", status: "ACTIVE", email: "thaovy@elysium.com", cccd: "037201009012", salary: 35000000 },
  ];

  const employeeDocuments: any[] = [];
  const employeeAssignments: any[] = [];

  const payrollRecords: any[] = [
    { id: "pr-001", employeeId: "tm-001", period: "2024-04", baseSalary: 50000000, bonus: 5000000, tax: 4500000, insurance: 1500000, finalPayout: 49000000, status: "PAID" },
    { id: "pr-002", employeeId: "tm-002", period: "2024-04", baseSalary: 35000000, bonus: 2000000, tax: 2500000, insurance: 1050000, finalPayout: 33450000, status: "PAID" },
  ];

  const paymentTransactions: any[] = [
    { id: "txn-001", employeeId: "tm-001", type: "SALARY", amount: 49000000, period: "2024-04", date: "2024-04-30", status: "PAID", method: "BANK_TRANSFER", approvedBy: "tm-003" },
    { id: "txn-002", employeeId: "tm-002", type: "COMMISSION", amount: 49000000, period: "2024-04", date: "2024-05-02", status: "PENDING", method: "BANK_TRANSFER", approvedBy: null },
  ];

  const commissionRecords: any[] = [
    { id: "com-001", employeeId: "tm-002", projectId: "prj-001", revenue: 500000000, percentage: 3, amount: 15000000, calculatedAt: "2024-04-28", status: "PENDING" },
  ];

  const salaryAdjustments: any[] = [];

  const chatMessages: any[] = [
    { id: 'm1', sender: 'tm-001', text: 'Chào mọi người, bản báo cáo rủi ro Q4 cho Grand Horizon đã được cập nhật.', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'm2', sender: 'tm-003', text: 'Đã nhận, phần thanh khoản đang được rà soát kỹ.', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'm3', sender: 'tm-002', text: 'Tôi vừa cập nhật dữ liệu từ Savills cho The Grand Marina.', timestamp: new Date(Date.now() - 1800000).toISOString() }
  ];

  const departments = [
    { id: "dept-001", name: "Asset Management", headId: "tm-001" },
    { id: "dept-002", name: "Compliance & Risk", headId: "tm-003" },
  ];

  // --- P&L MANAGEMENT DATA ---
  const pnlRecords: any[] = [
    { 
      id: "pnl-001", 
      assetId: "ast-001", 
      assetName: "The Grand Marina Saigon", 
      period: "2024-Q1", 
      status: "FINALIZED", 
      currency: "VND",
      grossProfit: 2500000000,
      netProfit: 1850000000,
      ebitda: 2100000000,
      roi: 12.5,
      cashflowDelta: 450000000,
      managerId: "tm-001",
      approvedBy: "tm-003",
      createdAt: "2024-04-01"
    },
    { 
      id: "pnl-002", 
      assetId: "ast-002", 
      assetName: "V-Energy Solar Farm", 
      period: "2024-Q1", 
      status: "UNDER_REVIEW", 
      currency: "VND",
      grossProfit: 1200000000,
      netProfit: 950000000,
      ebitda: 1050000000,
      roi: 18.2,
      cashflowDelta: -120000000,
      managerId: "tm-002",
      approvedBy: null,
      createdAt: "2024-04-05"
    }
  ];

  const pnlLineItems: any[] = [
    // pnl-001 Revenue
    { id: "pli-001", pnlId: "pnl-001", category: "REVENUE", subcategory: "Thuê mặt bằng", description: "Lumiere 1 Retail Space", amount: 1800000000, frequency: "MONTHLY", date: "2024-01-15" },
    { id: "pli-002", pnlId: "pnl-001", category: "REVENUE", subcategory: "Phí dịch vụ", description: "Building Service Fee", amount: 700000000, frequency: "MONTHLY", date: "2024-01-20" },
    // pnl-001 Expenses
    { id: "pli-003", pnlId: "pnl-001", category: "EXPENSE", subcategory: "Bảo trì", description: "Elevator Annual Maintenance", amount: 150000000, frequency: "ONE_TIME", date: "2024-02-10" },
    { id: "pli-004", pnlId: "pnl-001", category: "EXPENSE", subcategory: "Payroll", description: "Facility Management Team", amount: 450000000, frequency: "MONTHLY", date: "2024-02-28" },
    { id: "pli-005", pnlId: "pnl-001", category: "EXPENSE", subcategory: "Marketing", description: "Digital Ads Campaign", amount: 50000000, frequency: "ONE_TIME", date: "2024-03-05" },
  ];

  const pnlCommissionRecords: any[] = [
    { id: "pcom-001", pnlId: "pnl-001", recipientId: "tm-001", role: "Manager", percentage: 5, amount: 125000000, status: "PAID" },
    { id: "pcom-002", pnlId: "pnl-001", recipientId: "tm-002", role: "Sales", percentage: 2, amount: 50000000, status: "PAID" },
  ];

  const pnlAuditLogs: any[] = [
    { id: "pa-001", pnlId: "pnl-001", action: "FINALIZE", user: "tm-003", timestamp: "2024-04-10T10:00:00Z", details: "Q1 P&L finalized and locked." }
  ];

  // --- RISK ENGINE DATA ---
  const riskModels = {
    "Real Estate": {
      factors: [
        { id: "market_vol", name: "Biến động thị trường", weight: 0.25, category: "Market" },
        { id: "liquidity", name: "Tính thanh khoản", weight: 0.35, category: "Liquidity" },
        { id: "legal_compliance", name: "Pháp lý & Quy hoạch", weight: 0.30, category: "Compliance" },
        { id: "operational", name: "Vận hành", weight: 0.10, category: "Operational" }
      ]
    },
    "Stocks": {
      factors: [
        { id: "market_beta", name: "Thị trường (Beta)", weight: 0.45, category: "Market" },
        { id: "dividend", name: "Tâm lý cổ tức", weight: 0.15, category: "Financial" },
        { id: "sector_vol", name: "Biến động ngành", weight: 0.30, category: "Market" },
        { id: "liquidity", name: "Thanh khoản khớp lệnh", weight: 0.10, category: "Liquidity" }
      ]
    },
    "Crypto": {
      factors: [
        { id: "protocol", name: "Rủi ro Smart Contract", weight: 0.40, category: "Operational" },
        { id: "reg_risk", name: "Áp lực pháp lý", weight: 0.30, category: "Compliance" },
        { id: "volatility", name: "Biến động giá", weight: 0.30, category: "Market" }
      ]
    },
    "Private Equity": {
      factors: [
        { id: "execution", name: "Rủi ro thực thi", weight: 0.40, category: "Governance" },
        { id: "exit", name: "Rủi ro thoái vốn", weight: 0.40, category: "Liquidity" },
        { id: "valuation", name: "Thẩm định giá", weight: 0.20, category: "Financial" }
      ]
    }
  };

  const riskEvents = [
    { id: "re-001", assetId: "ast-001", type: "THREAT", factor: "Pháp lý", severity: "HIGH", description: "Thay đổi quy hoạch phân khu 4", date: "2024-05-01" },
    { id: "re-002", assetId: "ast-003", type: "ALERT", factor: "Thanh khoản", severity: "MEDIUM", description: "Khối lượng giao dịch thấp bất thường", date: "2024-05-05" }
  ];

  const riskThresholds = {
    critical: 4.5,
    high: 3.5,
    medium: 2.5,
    low: 0
  };

  const persons = [
    { 
      id: "per-001", 
      name: "Nguyễn Phi Long", 
      cid: "PB-992-X10", 
      dob: "12/04/1978", 
      kycStatus: "Verified", 
      kycLevel: 3, 
      nationality: "Vietnam", 
      status: "Active",
      entities: ["ent-002", "ent-001"]
    },
    { id: "per-002", name: "David Sterling", role: "UBO", nationality: "Singapore", status: "Verified" },
  ];

  const legalDocuments = [
    { id: "ld-001", ownerId: "per-001", name: "Hợp đồng Mở tài khoản (Private Banking)", category: "Hợp đồng", expiry: null, status: "Đã xác minh" },
    { id: "ld-002", ownerId: "per-001", name: "Căn cước công dân (001298412XXX)", category: "Định danh", expiry: "15/09/2023", status: "Sắp hết hạn" },
    { id: "ld-003", ownerId: "per-001", name: "Giấy phép thành lập Alpha Strategic", category: "Pháp lý DN", expiry: "12/10/2030", status: "Đang xử lý" },
    { id: "ld-004", ownerId: "per-001", name: "Xác nhận cư trú (Tạm trú dài hạn)", category: "Địa chỉ", expiry: "28/12/2024", status: "Đã xác minh" },
  ];

  const vaultFolders = [
    { id: 'f-1', name: 'Bất động sản Châu Âu', count: 24, size: '1.2 GB', category: 'RE' },
    { id: 'f-2', name: 'Hợp đồng Ủy thác Gold', count: 8, size: '45 MB', category: 'CONTRACT' },
    { id: 'f-3', name: 'Hồ sơ Pháp lý 2024', count: 156, size: '4.8 GB', category: 'LEGAL' },
  ];

  const vaultFiles = [
    { id: 'doc-1', name: 'SPA_Geneva_Penthouse_Final.pdf', type: 'PDF', uploadedBy: 'Cố vấn Marcus', uploadedAt: '14:20 yesterday', tags: ['Hợp đồng', 'Bất động sản'] },
    { id: 'doc-2', name: 'Artwork_Valuation_Certificate.jpg', type: 'IMG', uploadedBy: 'Admin', uploadedAt: '2 hours ago', tags: ['Chờ xử lý', 'Tài sản nghệ thuật'] },
    { id: 'doc-3', name: 'Trust_Deed_Amendment_V2.docx', type: 'DOC', uploadedBy: 'Phòng Pháp chế', uploadedAt: '3 hours ago', tags: ['Ủy thác'] },
  ];

  const auditStatus = [
    { id: 'as-1', name: 'Xác minh danh tính KYC', status: 'COMPLETED', period: '2024', color: 'emerald' },
    { id: 'as-2', name: 'Kiểm toán Thuế nội bộ', status: 'CLEAN', period: 'Q3 2023', color: 'emerald' },
    { id: 'as-3', name: 'Cập nhật Điều khoản Ủy thác', status: 'PROCESSING', period: 'Current', color: 'amber' },
    { id: 'as-4', name: 'Báo cáo ESG Portfolio', status: 'PLANNED', period: 'Q1 2025', color: 'gray' },
  ];

  const reportData = {
    metrics: {
      roi: 14.8,
      roiChange: 2.1,
      netProfit: 2450000000,
      netProfitChange: 120000000,
      riskLevel: "Trung bình",
      growthForecast: 5.2,
    },
    cashFlowTrend: [
      { month: 'T1', inflow: 1.2, outflow: 0.8, forecast: false },
      { month: 'T2', inflow: 1.5, outflow: 1.0, forecast: false },
      { month: 'T3', inflow: 1.8, outflow: 1.2, forecast: false },
      { month: 'T4', inflow: 1.7, outflow: 1.4, forecast: false },
      { month: 'T5', inflow: 2.1, outflow: 1.1, forecast: false },
      { month: 'T6', inflow: 1.9, outflow: 1.3, forecast: false },
      { month: 'T7', inflow: 1.6, outflow: 1.2, forecast: false },
      { month: 'T8', inflow: 1.8, outflow: 1.5, forecast: false },
      { month: 'T9', inflow: 2.0, outflow: 1.6, forecast: false },
      { month: 'T10', inflow: 2.2, outflow: 1.7, forecast: true },
      { month: 'T11', inflow: 2.3, outflow: 1.8, forecast: true },
      { month: 'T12', inflow: 2.5, outflow: 1.9, forecast: true },
    ],
    assetAllocation: [
      { name: 'Bất động sản', value: 45.0, color: '#000000' },
      { name: 'Chứng khoán', value: 30.0, color: '#6366f1' },
      { name: 'Trái phiếu', value: 15.0, color: '#94a3b8' },
      { name: 'Khác', value: 10.0, color: '#e2e8f0' },
    ],
    clientReports: [
      { 
        id: 'cl-1', 
        name: 'Tập đoàn Alpha Prime', 
        code: 'AP-2024-01', 
        investment: 12500000000, 
        currentValue: 14125000000, 
        pnlVnd: 1625000000, 
        pnlPercent: 13.0, 
        status: 'growing' 
      },
      { 
        id: 'cl-2', 
        name: 'Lê Hoàng Nam', 
        code: 'LHN-9912', 
        investment: 4200000000, 
        currentValue: 4010000000, 
        pnlVnd: -190000000, 
        pnlPercent: -4.5, 
        status: 'underReview' 
      },
      { 
        id: 'cl-3', 
        name: 'Quỹ đầu tư Việt Thắng', 
        code: 'VTF-0042', 
        investment: 25000000000, 
        currentValue: 26850000000, 
        pnlVnd: 1850000000, 
        pnlPercent: 7.4, 
        status: 'onTrack' 
      },
      { 
        id: 'cl-4', 
        name: 'Nguyễn Thị Minh', 
        code: 'NTM-8821', 
        investment: 850000000, 
        currentValue: 920000000, 
        pnlVnd: 70000000, 
        pnlPercent: 8.2, 
        status: 'growing' 
      },
      { 
        id: 'cl-5', 
        name: 'Bất động sản Thành Công', 
        code: 'TC-RE-01', 
        investment: 50000000000, 
        currentValue: 48500000000, 
        pnlVnd: -1500000000, 
        pnlPercent: -3.0, 
        status: 'underReview' 
      }
    ]
  };

  const riskAnalysisData = [
    {
      id: 'ent-001',
      name: 'Grand Horizon Capital',
      type: 'Quỹ đầu tư tư nhân',
      marketScore: 65,
      liquidityScore: 42,
      legalScore: 20,
      operationalScore: 35,
      totalRiskScore: 42, 
      index: 'MEDIUM',
      matrix: { impact: 4, probability: 4 },
      trends: [
        { month: 'TH10 23', score: 45 },
        { month: 'TH11 23', score: 48 },
        { month: 'TH12 23', score: 42 },
        { month: 'TH01 24', score: 46 },
        { month: 'TH02 24', score: 58 },
        { month: 'HIỆN TẠI', score: 42 }
      ],
      subFactors: {
        market: [
          { name: 'Biến động giá tài sản', score: 65, trend: 'up' },
          { name: 'Thanh khoản thị trường', score: 28, trend: 'stable' }
        ],
        liquidity: [
          { name: 'Khả năng thanh toán nhanh', score: 65, trend: 'down' },
          { name: 'Dòng tiền hoạt động', score: 79, trend: 'stable' }
        ],
        legal: [
          { name: 'Tuân thủ (Compliance)', status: 'AN TOÀN', score: 20 },
          { name: 'Giấy phép', status: 'ĐANG XÉT DUYỆT', score: 60 }
        ],
        operational: [
          { name: 'Quy trình nội bộ', score: 12, trend: 'stable' },
          { name: 'Nhân sự chủ chốt', score: 54, trend: 'up' }
        ]
      },
      alerts: [
        { level: 'XỬ LÝ NGAY', message: 'Biến động tỷ giá vượt ngưỡng 1.5%', time: 'HÔM NAY', detail: 'Danh mục Crypto-Assets đang chịu áp lực thanh khoản lớn.' },
        { level: 'CHI TIẾT', message: 'Cập nhật quy định mới từ SEC (Rule 2a-7)', time: '12 GIỜ TRƯỚC', detail: 'Yêu cầu báo cáo tuân thủ bổ sung cho quỹ Grand Horizon.' },
        { level: 'CHI TIẾT', message: 'Thay đổi nhân sự cấp cao (CFO)', time: 'HÔM QUA', detail: 'Hợp đồng pháp lý cần được ký lại cho các tài khoản đối tác.' }
      ],
      mitigationProgress: 68,
      mitigationActionsCount: "12/18",
      riskStatusSummary: [
        { label: 'Thanh khoản', value: 'Nghiêm trọng', color: 'rose' },
        { label: 'Thị trường', value: 'Trung bình', color: 'amber' },
        { label: 'Vận hành', value: 'Thấp', color: 'emerald' }
      ],
      priorityRisks: [
        {
          id: 'pr-01',
          type: 'Rủi ro ngoại hối',
          title: 'Biến động tỷ giá USD/VND',
          exposure: 'Phơi nhiễm dự kiến: $2.4M',
          actions: [
            { name: 'Thiết lập Forward Contract', owner: 'Lê Minh Anh', deadline: '15/11/2024', status: 'COMPLETED' },
            { name: 'Tái cấu trúc nợ vay ngoại tệ', owner: 'Trần Quốc Nam', deadline: '30/11/2024', status: 'PROCESSING' }
          ]
        },
        {
          id: 'pr-02',
          type: 'Rủi ro tài chính',
          title: 'Thiếu hụt thanh khoản ngắn hạn',
          exposure: 'Khoảng cách dòng tiền: -15.5B VND',
          actions: [
            { name: 'Mở rộng hạn mức tín dụng dự phòng', owner: 'Phạm Gia Bảo', deadline: '01/11/2024', status: 'DELAYED' },
            { name: 'Thanh lý tài sản phi cốt lõi', owner: 'Nguyễn Thùy Chi', deadline: '20/12/2024', status: 'PROCESSING' }
          ]
        }
      ],
      discussion: [
        { user: 'Lê Minh Anh', avatar: 'MA', time: '10:45 AM, Hôm nay', message: 'Hợp đồng Forward với Vietcombank đã hoàn tất ký kết. Tỷ giá chốt tại 25,450. Đang chờ xác nhận từ phía kho bạc.' },
        { user: 'Phạm Gia Bảo', avatar: 'PG', time: '09:12 AM, Hôm nay', message: 'Cần đẩy nhanh tiến độ hạn mức tín dụng. Bên ngân hàng yêu cầu thêm báo cáo tài chính kiểm toán 6 tháng đầu năm.' }
      ],
      changeLog: [
        { time: 'Hôm nay, 14:00', message: 'Hệ thống tự động cập nhật mức độ rủi ro thanh khoản lên Nghiêm trọng.', level: 'critical' },
        { time: 'Hôm qua, 16:30', message: 'Lê Minh Anh đã thay đổi trạng thái hành động "Forward Contract" sang Hoàn thành.', level: 'success' },
        { time: '22 TH10, 2024', message: 'Hồ sơ quản trị viên đã khởi tạo bản kế hoạch khắc phục rủi ro Q4.', level: 'info' }
      ],
      effectiveness: {
        score: 85,
        beforeScore: 7.4,
        afterScore: 2.1,
        reductionDelta: -71.6,
        summary: "Chiến dịch khắc phục đã giải quyết thành công các lỗ hổng thanh khoản chính và tái cấu trúc các nghĩa vụ nợ ngắn hạn.",
        matrixBefore: [
          { impact: 5, probability: 4 },
          { impact: 4, probability: 3 }
        ],
        matrixAfter: [
          { impact: 2, probability: 1 },
          { impact: 1, probability: 2 }
        ],
        timeline: [
          { date: '05/01/2024', title: 'Thiết lập Hợp đồng Kỳ hạn (Forward Contract)', description: 'Bảo hiểm rủi ro tỷ giá ngoại tệ cho các khoản đầu tư tại thị trường EU. Giảm thiểu biến động dòng tiền dự kiến 15%.', status: 'HOÀN TẤT' },
          { date: '12/02/2024', title: 'Tái cấu trúc nghĩa vụ nợ ngắn hạn', description: 'Chuyển đổi 250 triệu USD nợ vay ngắn hạn sang trái phiếu dài hạn kỳ hạn 5 năm. Cải thiện chỉ số thanh toán hiện hành từ 0.8 lên 1.4.', status: 'HOÀN TẤT' },
          { date: '20/04/2024', title: 'Thanh lý tài sản phi cốt lõi', description: 'Thoái vốn thành công tại các dự án bất động sản nghỉ dưỡng không thuộc danh mục ưu tiên, thu hồi 120 triệu USD tiền mặt.', status: 'HOÀN TẤT' }
        ],
        residualRisks: [
          { title: 'Rủi ro chính trị địa phương', description: 'Khả năng thay đổi chính sách thuế tại khu vực Đông Nam Á vẫn chưa thể kiểm soát hoàn toàn.' },
          { title: 'Biến động giá nguyên liệu thô', description: 'Dự báo giá thép thế giới vẫn trong biên độ dao động cao (+/- 12%).' }
        ],
        lessons: [
          'Thiết lập hệ thống cảnh báo sớm (EWS) tự động.',
          'Đa dạng hóa danh mục đầu tư vào các tài sản phi tương quan.',
          'Tổ chức đánh giá rủi ro định kỳ mỗi quý một lần.',
          'Xây dựng quỹ dự phòng thanh khoản tối thiểu 10%.'
        ]
      },
      mitigationPlan: [
        { action: 'Thiết lập Forward Contract ngoại tệ', responsible: 'Lê Minh Anh', timeline: '15/11/2024', status: 'COMPLETED' },
        { action: 'Tái cấu trúc nợ vay ngắn hạn', responsible: 'Trần Quốc Nam', timeline: '30/11/2024', status: 'PROCESSING' },
        { action: 'Mở rộng hạn mức tín dụng dự phòng', responsible: 'Phạm Gia Bảo', timeline: '01/12/2024', status: 'PLANNED' }
      ]
    },
    {
      id: 'ent-002',
      name: 'Lâm Phan Quốc Anh',
      type: 'Individual HNW',
      marketScore: 45,
      liquidityScore: 35,
      legalScore: 12,
      operationalScore: 10,
      totalRiskScore: 25,
      index: 'LOW',
      subFactors: {
        market: [{ name: 'Biến động danh mục cá nhân', score: 45, trend: 'stable' }],
        liquidity: [{ name: 'Số dư tiền mặt khả dụng', score: 35, trend: 'up' }],
        legal: [{ name: 'Rủi ro thuế cá nhân', score: 12, trend: 'stable' }],
        operational: [{ name: 'Rủi ro ủy quyền giao dịch', score: 10, trend: 'down' }]
      },
      alerts: [],
      mitigationPlan: [
        { action: 'Xác minh nguồn gốc tài sản (KYC Level 3)', responsible: 'Marcus', timeline: '20/11/2024', status: 'COMPLETED' }
      ]
    },
    {
      id: 'ent-003',
      name: 'Starlight Tech Ventures',
      type: 'Venture Capital',
      marketScore: 92,
      liquidityScore: 88,
      legalScore: 45,
      operationalScore: 75,
      totalRiskScore: 75,
      index: 'CRITICAL',
      subFactors: {
        market: [
          { name: 'Định giá Series C lỗi thời', score: 95, trend: 'up' },
          { name: 'Rủi ro bong bóng AI', score: 89, trend: 'up' }
        ],
        liquidity: [
          { name: 'Kỳ hạn thoái vốn (Exit Horizon)', score: 98, trend: 'up' },
          { name: 'Burn rate hàng tháng', score: 78, trend: 'stable' }
        ],
        legal: [
          { name: 'Quyền sở hữu trí tuệ', score: 45, trend: 'stable' }
        ],
        operational: [
          { name: 'Năng lực đội ngũ Founder', score: 75, trend: 'down' }
        ]
      },
      alerts: [
        { level: 'CRITICAL', message: 'Tốc độ đốt tiền vượt dự báo 25% trong Q2', category: 'Operational' },
        { level: 'CRITICAL', message: 'Rủi ro thanh khoản nghiêm trọng do hoãn IPO', category: 'Liquidity' }
      ],
      mitigationPlan: [
        { action: 'Thoái vốn một phần tại startup giai đoạn cuối', responsible: 'Nguyễn Hoàng Nam', timeline: '10/12/2024', status: 'PLANNED' },
        { action: 'Rà soát hợp đồng cổ đông (SHA)', responsible: 'Elena Vĩnh Cửu', timeline: '25/11/2024', status: 'PROCESSING' }
      ]
    },
    {
      id: 'ent-004',
      name: 'Sterling Family Trust',
      type: 'Trust',
      marketScore: 30,
      liquidityScore: 25,
      legalScore: 15,
      operationalScore: 20,
      totalRiskScore: 22,
      index: 'LOW',
      subFactors: {
        market: [{ name: 'Lợi suất trái phiếu chính phủ', score: 30, trend: 'stable' }],
        liquidity: [{ name: 'Phân bổ tài sản tiền mặt', score: 25, trend: 'stable' }],
        legal: [{ name: 'Tuân thủ luật tín thác BVI', score: 15, trend: 'stable' }],
        operational: [{ name: 'Quy trình kế thừa', score: 20, trend: 'down' }]
      },
      alerts: [],
      mitigationPlan: [
        { action: 'Báo cáo độc lập từ kiểm toán BVI', responsible: 'Ban Kiểm soát', timeline: '05/12/2024', status: 'PLANNED' }
      ]
    }
  ];

  // --- CORE SERVICES ---
  
  const HRService = {
    terminateEmployee: (id: string) => {
      const emp = team.find(e => e.id === id);
      if (!emp) throw new Error("Employee not found");
      emp.status = "TERMINATED";
      AuditService.log("SYSTEM", "EMPLOYEE_TERMINATED", `Employee:${id}`, `Access revoked for ${emp.name}`, true);
      EventService.emit('EMPLOYEE_OFFBOARDED', { id });
    },
    validateNewEmployee: (data: any) => {
      // Uniqueness checks
      if (team.find(e => e.email === data.email)) throw new Error("Email already exists in system");
      if (team.find(e => e.cccd === data.cccd)) throw new Error("CCCD/Passport already exists in system");

      // Required fields
      if (!data.name || !data.email || !data.cccd) throw new Error("Missing mandatory fields (Name, Email, CCCD)");

      // Position based rules
      if (data.position === 'CTV' && (data.salary > 0 || data.approvalLimit > 0)) {
        throw new Error("CTV position cannot have fixed salary or approval authority");
      }
      if (data.position === 'Chuyên viên' && data.accessScope === 'Global') {
        throw new Error("Specialists cannot have Global access scope");
      }
      if (data.position === 'Quản lý' && !departments.find(d => d.id === data.deptId)) {
        throw new Error("Managers must be assigned to a valid department");
      }

      return true;
    },
    getReportingChain: (id: string, chain: string[] = []): string[] => {
      const emp = team.find(e => e.id === id);
      if (!emp || !emp.managerId) return chain;
      chain.push(emp.managerId);
      return HRService.getReportingChain(emp.managerId, chain);
    }
  };
  
  const AuditService = {
    log: (userId: string, action: string, entity: string, details: string, critical: boolean = false) => {
      const entry = {
        id: `log-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        userId, action, entity, details, critical
      };
      console.log(`[AUDIT] ${JSON.stringify(entry)}`);
      auditLogs.push(entry);
      return entry;
    }
  };

  const BusinessRulesService = {
    validateAssetUpdate: (asset: any, user: any) => {
      if (asset.status === 'LIQUIDATED') throw new Error("Cannot modify liquidated assets");
      if (asset.value > 10000000 && asset.risk === 'High') {
        throw new Error("High value assets with High Risk must be pre-approved by Risk Committee");
      }
      return true;
    },
    validateOwnershipAddition: (parent: string, child: string, percentage: number) => {
      // Rule 0: Basic validation
      if (percentage <= 0 || percentage > 100) throw new Error("Share percentage must be between 0 and 100");
      if (parent === child) throw new Error("Self-ownership is not permitted");

      // Rule 1: Cap 100%
      const currentTotal = ownership.filter(o => o.child === child).reduce((s, o) => s + o.percentage, 0);
      if (currentTotal + percentage > 100.0001) { // Floating point safety
        throw new Error(`Total ownership of ${child} would exceed 100% (Current: ${currentTotal}%)`);
      }

      // Rule 2: Anti-Circular Detection
      const isCircular = (current: string, target: string, visited: Set<string>): boolean => {
        if (current === target) return true;
        if (visited.has(current)) return false;
        visited.add(current);
        const children = ownership.filter(o => o.parent === current).map(o => o.child);
        return children.some(c => isCircular(c, target, visited));
      };

      if (isCircular(child, parent, new Set())) {
        throw new Error("Circular ownership detected: This relationship would create a loop in the governance graph.");
      }

      return true;
    }
  };

  const EventService = {
    emit: (event: string, payload: any) => {
      Logger.info(`Event Emitted: ${event}`, payload);
    }
  };

  const WorkflowService = {
    transitions: {
      ASSET: {
        'DRAFT': ['UNDER_REVIEW'],
        'UNDER_REVIEW': ['ACTIVE', 'REJECTED'],
        'ACTIVE': ['LIQUIDATED', 'DORMANT'],
        'LIQUIDATED': []
      }
    },
    canTransition: (entityType: 'ASSET', from: string, to: string) => {
      return WorkflowService.transitions[entityType][from]?.includes(to);
    }
  };

  const ApprovalService = {
    process: async (assetId: string, userId: string, decision: 'APPROVE' | 'REJECT') => {
      const asset = assets.find(a => a.id === assetId);
      if (!asset) throw new Error("Asset not found");
      const status = decision === 'APPROVE' ? 'ACTIVE' : 'REJECTED';
      if (WorkflowService.canTransition('ASSET', 'UNDER_REVIEW', status)) {
        asset.status = status;
        AuditService.log(userId, `APPROVAL_${decision}`, `Asset:${assetId}`, `Decision: ${decision}`, true);
        return true;
      }
      return false;
    }
  };

  const FinancialService = {
    calculatePayroll: (employeeId: string, period: string) => {
      const emp = team.find(e => e.id === employeeId);
      if (!emp) throw new Error("Employee not found");
      // Business logic for tax/insurance
      return { baseSalary: emp.salary || 0, tax: (emp.salary || 0) * 0.1 };
    },
    approvePayment: (txnId: string, adminId: string) => {
      const txn = paymentTransactions.find(t => t.id === txnId);
      if (!txn) throw new Error("Transaction not found");
      if (txn.status !== 'PENDING') throw new Error("Transaction already processed");
      if (txn.employeeId === adminId) throw new Error("Cannot approve your own payment");

      txn.status = 'APPROVED';
      txn.approvedBy = adminId;
      AuditService.log(adminId, "FINANCE_PAYMENT_APPROVED", `Payment:${txnId}`, `Payment approved for employee ${txn.employeeId}`, true);
      return txn;
    }
  };

  const authorize = (permission: string) => (req: any, res: any, next: any) => next();

  // --- STABILITY & ERROR HANDLING ---

  const globalErrorHandler = (err: any, req: any, res: any, next: any) => {
    const errorId = `err-${Math.random().toString(36).substr(2, 9)}`;
    Logger.error(`[${errorId}] Unhandled Exception: ${err.message}`, { stack: err.stack, path: req.path });
    AuditService.log('SYSTEM', 'RUNTIME_EXCEPTION', 'SERVER', `ErrorID: ${errorId} | ${err.message}`, true);
    res.status(err.status || 500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: process.env.NODE_ENV === 'production' ? "An unexpected error occurred" : err.message,
      errorId
    });
  };

  Logger.info("Starting Enterprise Ledger Boot Sequence...");
  
  // --- API ROUTES ---

  // Governance: Create New Entity
  app.post("/api/governance/entities", authorize("entities:write"), (req, res) => {
    const { name, type, jurisdiction, registrationId } = req.body;
    
    // Check for duplicates
    if (entities.find(e => (e as any).registrationId === registrationId && e.jurisdiction === jurisdiction)) {
      return res.status(409).json({ error: "DUPLICATE_REGISTRATION", message: "Company with this UEN already exists in this jurisdiction" });
    }

    const newEntity = {
      id: `ent-${Math.random().toString(36).substr(2, 5)}`,
      name, type, jurisdiction, registrationId, status: "Pending_KYC", createdAt: new Date().toISOString()
    };
    
    entities.push(newEntity as any);
    AuditService.log("user-001", "ENTITY_CREATED", `Entity:${newEntity.id}`, `New ${type} onboarded: ${name}`, true);
    res.status(201).json(newEntity);
  });

  // Governance: Add Ownership Link
  app.post("/api/governance/ownership", authorize("entities:write"), (req, res) => {
    const { parent, child, percentage, type } = req.body;
    
    try {
      BusinessRulesService.validateOwnershipAddition(parent, child, percentage);
      
      const newRelation = { parent, child, percentage, type };
      ownership.push(newRelation);
      
      AuditService.log("user-001", "OWNERSHIP_ADDED", `Ownership`, `${parent} now owns ${percentage}% of ${child}`, true);
      res.status(201).json(newRelation);
    } catch (err: any) {
      res.status(400).json({ error: "INTEGRITY_VIOLATION", message: err.message });
    }
  });

  // Assets: Create Asset
  app.post("/api/assets", authorize("asset:write"), (req, res) => {
    const { name, category, value, ownerId, risk } = req.body;

    // Rule: Orphan Prevention
    if (!entities.find(e => e.id === ownerId) && !persons.find(p => p.id === ownerId)) {
      return res.status(400).json({ error: "ORPHAN_PREVENTION", message: "Asset must have a valid owner (Legal Entity or Person)" });
    }

    const newAsset = {
      id: `ast-${Math.random().toString(36).substr(2, 5)}`,
      name, category, value, ownerId, risk: risk || "Medium", status: "DRAFT", version: 1, performance: 0,
      allocation: "Other"
    };

    assets.push(newAsset);
    AuditService.log("user-001", "ASSET_CREATED", `Asset:${newAsset.id}`, `New asset ${name} in category ${category} created. Initial value: ${value}`, true);
    res.status(201).json(newAsset);
  });

  // HR Module: Get Workforce
  app.get("/api/hr/team", authorize("hr:read"), (req, res) => {
    res.json(team);
  });

  // HR Module: Terminate Employee
  app.post("/api/hr/terminate", authorize("hr:write"), (req, res) => {
    const { employeeId } = req.body;
    try {
      HRService.terminateEmployee(employeeId);
      res.json({ message: "Employee terminated and access revoked." });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Assets: Get asset valuation details
  app.get("/api/assets/:id/valuation-details", (req, res) => {
    const asset = assets.find(a => a.id === req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    res.json(asset);
  });

  // Organization Module: Get Structure
  app.get("/api/hr/org-chart", authorize("hr:read"), (req, res) => {
    const chart = departments.map(d => ({
      ...d,
      members: team.filter(t => t.deptId === d.id)
    }));
    res.json(chart);
  });

  // HR Module: Create Employee
  app.post("/api/hr/employees", authorize("hr:write"), (req, res) => {
    const data = req.body;
    try {
      HRService.validateNewEmployee(data);
      
      const newEmp = {
        id: `tm-${Math.random().toString(36).substr(2, 5)}`,
        ...data,
        status: data.kycReady ? "ACTIVE" : "ONBOARDING",
        createdAt: new Date().toISOString()
      };
      
      team.push(newEmp);
      
      // Store documents (mock)
      if (data.documents) {
        data.documents.forEach((doc: any) => {
          employeeDocuments.push({
            employeeId: newEmp.id,
            ...doc,
            encrypted: true,
            uploadedAt: new Date().toISOString()
          });
        });
      }

      AuditService.log("user-001", "EMPLOYEE_CREATED", `Employee:${newEmp.id}`, `New ${data.position} added: ${data.name}`, true);
      res.status(201).json(newEmp);
    } catch (err: any) {
      res.status(400).json({ error: "VALIDATION_FAILED", message: err.message });
    }
  });

  // Financial Module API
  app.get("/api/finance/payments/:employeeId", authorize("finance:read"), (req, res) => {
    const filtered = paymentTransactions.filter(p => p.employeeId === req.params.employeeId);
    res.json(filtered);
  });

  app.get("/api/finance/commissions/:employeeId", authorize("finance:read"), (req, res) => {
    const filtered = commissionRecords.filter(p => p.employeeId === req.params.employeeId);
    res.json(filtered);
  });

  app.get("/api/finance/payroll/:employeeId", authorize("finance:read"), (req, res) => {
    const filtered = payrollRecords.filter(p => p.employeeId === req.params.employeeId);
    res.json(filtered);
  });

  app.post("/api/finance/payments/approve", authorize("finance:write"), (req, res) => {
    const { txnId, adminId } = req.body;
    try {
      const txn = FinancialService.approvePayment(txnId, adminId);
      res.json(txn);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/finance/audit", authorize("finance:read"), (req, res) => {
    const logs = auditLogs.filter(l => l.action.startsWith("FINANCE_") || l.action.startsWith("PAYMENT_"));
    res.json(logs);
  });

  app.get("/api/health", (req, res) => {
    res.json({
      status: "UP",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      modules: { db: "CONNECTED", auth: "READY", workflow: "READY" }
    });
  });

  // Workflow Module: Approval Submission
  app.post("/api/workflow/approve", authorize("approval:write"), async (req, res) => {
    const { assetId, decision } = req.body;
    try {
      const success = await ApprovalService.process(assetId, "user-001", decision);
      if (success) {
        res.json({ message: `Workflow completed: ${decision}` });
      } else {
        res.status(400).json({ error: "Invalid state transition" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Assets Module (with Optimistic Locking & BRE Integration)
  app.post("/api/assets/:id/update", authorize("asset:write"), (req, res) => {
    const { newValue, expectedVersion, reason } = req.body;
    const assetId = req.params.id;
    
    // 1. Find & Lock Logic
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return res.status(404).send("Not found");
    
    try {
      // 2. Business Rule Validation
      BusinessRulesService.validateAssetUpdate(asset, { id: 'user-001' });

      // 3. Optimistic Concurrency Check
      if (asset.version !== expectedVersion) {
        return res.status(409).json({ error: "Conflict: Resource updated by another actor" });
      }

      const oldVal = asset.value;
      asset.value = newValue;
      asset.version += 1;

      // 4. Audit Trail & Domain Event
      AuditService.log("user-001", "ASSET_VALUATION_ADJUSTMENT", `Asset:${assetId}`, `Update from ${oldVal} to ${newValue}. Reason: ${reason}`, true);
      EventService.emit('ASSET_VALUATION_CHANGED', { id: assetId, oldVal, newVal: newValue });

      res.json({ status: "success", version: asset.version });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Audit Module - Fetch logs for Frontend Vault
  app.get("/api/admin/audit", authorize("audit:read"), (req, res) => {
    res.json(auditLogs);
  });

  app.get("/api/vault/overview", (req, res) => {
    res.json({
      folders: vaultFolders,
      recentFiles: vaultFiles,
      status: auditStatus
    });
  });

  app.post("/api/vault/upload", (req, res) => {
    const { name, type } = req.body;
    const newFile = {
      id: `doc-${Math.random().toString(36).substr(2, 5)}`,
      name: name || 'Untitled Document',
      type: type || 'PDF',
      uploadedBy: 'CurrentUser',
      uploadedAt: 'Just now',
      tags: ['New Upload']
    };
    vaultFiles.unshift(newFile);
    AuditService.log('user-001', 'DOCUMENT_UPLOAD', 'Vault', `Uploaded ${newFile.name}`, false);
    res.json(newFile);
  });

  app.get("/api/reports/comprehensive", (req, res) => {
    res.json(reportData);
  });

  app.get("/api/risk/analysis", (req, res) => {
    res.json(riskAnalysisData);
  });

  // Governance: Get all entities
  app.get("/api/governance/entities", (req, res) => {
    res.json(entities);
  });

  // Governance: Get specific entity by ID
  app.get("/api/governance/entities/:id", (req, res) => {
    const entity = entities.find(e => e.id === req.params.id);
    if (!entity) return res.status(404).json({ error: "Entity not found" });
    res.json(entity);
  });

  // Legal Profile: Get person details
  app.get("/api/legal/person/:id", (req, res) => {
    const person = persons.find(p => p.id === req.params.id);
    if (!person) return res.status(404).json({ error: "Person not found" });
    
    const docs = legalDocuments.filter(d => d.ownerId === person.id);
    const associatedEntities = entities.filter(e => person.entities?.includes(e.id));

    res.json({ person, docs, associatedEntities });
  });

  // Assets: Get asset with owner details
  app.get("/api/assets/:id/details", (req, res) => {
    const asset = assets.find(a => a.id === req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    const owner = entities.find(e => e.id === asset.ownerId) || persons.find(p => p.id === asset.ownerId);
    res.json({ asset, owner });
  });

  // Assets Module (with mutation audit)
  app.post("/api/assets/:id/valuation", authorize("asset:write"), (req, res) => {
    const { newValue, reason } = req.body;
    const assetId = req.params.id;
    
    // 1. Update DB (Mock)
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return res.status(404).send("Not found");
    
    const oldVal = asset.value;
    asset.value = newValue;

    // 2. Audit Trail (Mandatory)
    AuditService.log("user-001", "VALUATION_UPDATE", `Asset:${assetId}`, `Changed value from ${oldVal} to ${newValue}. Reason: ${reason}`, true);

    res.json({ status: "success", updatedValue: newValue });
  });
  
  // Entity Structure (Tree view data)
  app.get("/api/governance/structure/:id", (req, res) => {
    const rootId = req.params.id;
    // Recursive resolver would go here
    res.json({
      entity: entities.find(e => e.id === rootId),
      shareholders: ownership.filter(o => o.child === rootId).map(o => ({
        ...o,
        parentName: entities.find(e => e.id === o.parent)?.name
      })),
      subsidiaries: ownership.filter(o => o.parent === rootId).map(o => ({
        ...o,
        childName: entities.find(e => e.id === o.child)?.name
      }))
    });
  });

  // Governance Audit Logs
  app.get("/api/governance/audit", (req, res) => {
    res.json([
      { timestamp: new Date().toISOString(), user: "Admin", action: "VESTING_ACCELERATION", entity: "ent-002", detail: "Authorized by Family Board" },
      { timestamp: new Date().toISOString(), user: "CFO", action: "THRESHOLD_CHANGE", entity: "ent-004", detail: "Increased ops limit to 500k" }
    ]);
  });

  // Assets List with ownership traceability logic hints
  app.get("/api/assets", (req, res) => {
    // In production, we'd include 'audit_id' and 'last_verified_at'
    res.json({
      data: assets,
      meta: {
        total_value: assets.reduce((sum, a) => sum + a.value, 0),
        traceability_score: "98.2%" // Calculation based on document availability in Vault
      }
    });
  });

  // Team performance
  app.get("/api/team", (req, res) => {
    res.json(team);
  });

  // Audit Logs (CRITICAL for traceability)
  app.get("/api/audit-logs", (req, res) => {
    res.json([
      { timestamp: new Date().toISOString(), user: "Huy Nguyễn", action: "VALUATION_UPDATE", entity: "ast-001", detail: "Update value from 1.2M to 1.25M based on Savills report" },
      { timestamp: new Date().toISOString(), user: "Admin", action: "OWNERSHIP_TRANSFER", entity: "ast-002", detail: "Transfer 5% from Pool to ESOP" }
    ]);
  });

  // --- RISK ENGINE API ---

  // Get comprehensive risk matrix for an asset
  app.get("/api/risk/analysis/:assetId", (req, res) => {
    const asset = assets.find(a => a.id === req.params.assetId);
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    const model = (riskModels as any)[asset.category] || { factors: [
      { id: "gen_mkt", name: "Rủi ro thị trường chung", weight: 0.5, category: "Market" },
      { id: "gen_ops", name: "Rủi ro vận hành", weight: 0.5, category: "Operational" }
    ]};

    // Calculate deterministic scores based on asset ID for consistency
    const getScore = (id: string, factorId: string) => {
      const hash = (id + factorId).split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
      return (Math.abs(hash) % 5) + 1; // 1-5 scale
    };

    const analysisFactors = model.factors.map((f: any) => {
      const score = getScore(asset.id, f.id);
      const impact = getScore(f.id, asset.id);
      return { ...f, score, impact };
    });

    const overallScore = analysisFactors.reduce((acc: number, f: any) => acc + (f.score * f.weight), 0);
    const maxImpact = Math.max(...analysisFactors.map((f: any) => f.impact));
    
    // Find relevant events
    const events = riskEvents.filter(e => e.assetId === asset.id);

    res.json({
      asset: { id: asset.id, name: asset.name, category: asset.category },
      overallScore: Number(overallScore.toFixed(2)),
      threshold: overallScore > riskThresholds.high ? "CRITICAL" : overallScore > riskThresholds.medium ? "WARNING" : "STABLE",
      factors: analysisFactors,
      matrix: { probability: Math.round(overallScore), impact: maxImpact },
      events
    });
  });

  // Get historical risk trend (aggregated)
  app.get("/api/risk/trends", (req, res) => {
    const months = ["T1", "T2", "T3", "T4", "T5"];
    const categories = ["Market", "Liquidity", "Compliance", "Governance"];
    
    const trends = months.map((m, i) => {
      const base = { month: m };
      categories.forEach(c => {
        (base as any)[c] = (2 + Math.sin(i + c.length) * 1.5).toFixed(1);
      });
      return base;
    });

    res.json(trends);
  });

  // Get early warning alerts
  app.get("/api/risk/alerts", (req, res) => {
    const alerts = [
      { id: "al-1", assetName: "The Grand Marina Saigon", factor: "Tương quan rủi ro", message: "Độ nhạy cảm thị trường vượt ngưỡng 2.5 SD", level: "CRITICAL" },
      { id: "al-2", assetName: "Global Blue Chip ETF", factor: "Áp lực thanh khoản", message: "Giao dịch Volume giảm 45% trong 48h", level: "WARNING" },
      { id: "al-3", assetName: "V-Energy Solar Farm", factor: "Pháp lý", message: "Thông tư mới về biểu giá điện Feed-in-Tariff", level: "INFO" }
    ];
    res.json(alerts);
  });

  // --- RISK ENGINE API ---
  // ... (existing risk engine api code) ...

  // --- P&L MANAGEMENT API ---

  // Get P&L dashboard summary
  app.get("/api/finance/pnl/summary", authorize("finance:read"), (req, res) => {
    const totalRevenue = pnlLineItems.filter(i => i.category === 'REVENUE').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = pnlLineItems.filter(i => i.category === 'EXPENSE').reduce((sum, i) => sum + i.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    res.json({
      kpis: {
        totalRevenue,
        totalExpenses,
        netProfit,
        grossMargin: Number(margin.toFixed(2)),
        unapprovedPnL: pnlRecords.filter(r => r.status === 'UNDER_REVIEW').length
      },
      pnlRecords: pnlRecords.map(r => ({
        ...r,
        lineItemsCount: pnlLineItems.filter(i => i.pnlId === r.id).length
      }))
    });
  });

  // Get single P&L record with details
  app.get("/api/finance/pnl/:id", authorize("finance:read"), (req, res) => {
    const id = req.params.id;
    const pnl = pnlRecords.find(r => r.id === id);
    if (!pnl) return res.status(404).json({ error: "P&L record not found" });

    const items = pnlLineItems.filter(i => i.pnlId === id);
    const commissions = pnlCommissionRecords.filter(c => c.pnlId === id);
    const audits = pnlAuditLogs.filter(a => a.pnlId === id);

    res.json({ record: pnl, items, commissions, auditTrail: audits });
  });

  // Create new P&L record
  app.post("/api/finance/pnl", authorize("finance:write"), (req, res) => {
    const { assetId, period, currency, items, commissions } = req.body;
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return res.status(400).json({ error: "Linked asset required" });

    const newPnL = {
      id: `pnl-${Math.random().toString(36).substr(2, 5)}`,
      assetId,
      assetName: asset.name,
      period,
      status: "DRAFT",
      currency: currency || "VND",
      grossProfit: 0,
      netProfit: 0,
      ebitda: 0,
      roi: 0,
      cashflowDelta: 0,
      managerId: "tm-001", // Hardcoded for now
      approvedBy: null,
      createdAt: new Date().toISOString()
    };

    // Calculate totals and add line items
    let rev = 0;
    let exp = 0;
    items.forEach((item: any) => {
      const newItem = {
        id: `pli-${Math.random().toString(36).substr(2, 5)}`,
        pnlId: newPnL.id,
        ...item,
        date: item.date || new Date().toISOString()
      };
      pnlLineItems.push(newItem);
      if (item.category === 'REVENUE') rev += item.amount;
      else exp += item.amount;
    });

    newPnL.grossProfit = rev;
    newPnL.netProfit = rev - exp;
    
    pnlRecords.push(newPnL);

    // Initial audit log
    pnlAuditLogs.push({
      id: `pa-${Math.random().toString(36).substr(2, 5)}`,
      pnlId: newPnL.id,
      action: "CREATE",
      user: "user-001",
      timestamp: new Date().toISOString(),
      details: "P&L record initialized as DRAFT"
    });

    res.status(201).json(newPnL);
  });

  // Finalize/Approve P&L (Immutability Logic)
  app.post("/api/finance/pnl/:id/transition", authorize("finance:write"), (req, res) => {
    const { action } = req.body; // 'SUBMIT', 'APPROVE', 'REJECT'
    const id = req.params.id;
    const pnl = pnlRecords.find(r => r.id === id);
    if (!pnl) return res.status(404).json({ error: "P&L record not found" });

    if (pnl.status === 'FINALIZED') {
      return res.status(400).json({ error: "IMMUTABLE_RECORD", message: "Finalized P&L records cannot be modified." });
    }

    if (action === 'APPROVE') {
      pnl.status = 'FINALIZED';
      pnl.approvedBy = "user-finance-01"; // Mock admin
    } else if (action === 'SUBMIT') {
      pnl.status = 'UNDER_REVIEW';
    }

    pnlAuditLogs.push({
      id: `pa-${Math.random().toString(36).substr(2, 5)}`,
      pnlId: pnl.id,
      action,
      user: "user-001",
      timestamp: new Date().toISOString(),
      details: `P&L transition to ${pnl.status}`
    });

    res.json(pnl);
  });

  // Cashflow Trends API
  app.get("/api/finance/cashflow/trends", authorize("finance:read"), (req, res) => {
    const data = [
      { month: "Jan", inflow: 1250, outflow: 840, projection: 1300 },
      { month: "Feb", inflow: 1420, outflow: 910, projection: 1400 },
      { month: "Mar", inflow: 1380, outflow: 1100, projection: 1450 },
      { month: "Apr", inflow: 1650, outflow: 1050, projection: 1600 },
      { month: "May", inflow: 1580, outflow: 1200, projection: 1650 },
    ];
    res.json(data);
  });

  // --- VITE MIDDLEWARE ---
  // Global Error Handler (MUST BE REGISTERED AFTER ALL ROUTES)
  app.use(globalErrorHandler);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    Logger.info(`Elysium Ledger Server running on http://localhost:${PORT}`);
  });

  // --- WEBSOCKET CHAT SERVER ---
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    Logger.info('New internal chat connection');
    
    // Send initial history
    ws.send(JSON.stringify({ type: 'history', data: chatMessages }));

    ws.on('message', (data: string) => {
      try {
        const payload = JSON.parse(data);
        if (payload.type === 'chat') {
          const newMsg = {
            id: `msg-${Math.random().toString(36).substr(2, 9)}`,
            sender: payload.senderId,
            text: payload.text,
            timestamp: new Date().toISOString()
          };
          chatMessages.push(newMsg);
          
          // Broadcast to all clients
          const broadcastPayload = JSON.stringify({ type: 'chat', data: newMsg });
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastPayload);
            }
          });
        }
      } catch (err) {
        Logger.error('WS Message Error', err);
      }
    });
  });

  // --- GRACEFUL SHUTDOWN ---
  const shutdown = (signal: string) => {
    Logger.info(`Received ${signal}. Starting graceful shutdown...`);
    server.close(() => {
      Logger.info("Server closed successfully.");
      process.exit(0);
    });
    
    // Force shutdown if taking too long
    setTimeout(() => {
      Logger.error("Could not close connections in time, forcing shutdown.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer();

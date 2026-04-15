// Mock data for وكل (wkl) - All Arabic content

export const dashboardData = {
  revenue: {
    today: 12450,
    month: 385000,
    trend: 8.5,
  },
  customers: {
    total: 1247,
    new: 38,
    trend: 12.3,
  },
  orders: {
    total: 856,
    pending: 23,
    trend: -3.2,
  },
  conversion: {
    rate: 4.8,
    trend: 1.2,
  },
  aiInsights: [
    {
      id: 1,
      type: 'warning',
      text: 'انخفضت مبيعاتك بنسبة 12% هذا الأسبوع مقارنة بالأسبوع الماضي',
      action: 'نقترح إطلاق حملة خصومات لتحفيز المبيعات',
      priority: 'high',
    },
    {
      id: 2,
      type: 'success',
      text: 'زيادة في التفاعل مع العملاء بنسبة 25% بعد آخر حملة تسويقية',
      action: 'استمر في نفس الاستراتيجية مع زيادة الميزانية',
      priority: 'medium',
    },
    {
      id: 3,
      type: 'info',
      text: 'تم اكتشاف 15 عميل محتمل جديد من خلال واتساب',
      action: 'قم بتعيين موظف مبيعات للتواصل معهم',
      priority: 'medium',
    },
    {
      id: 4,
      type: 'warning',
      text: 'مخزون المنتج الأكثر مبيعاً قارب على النفاد',
      action: 'أعد طلب الشراء فوراً لتجنب فقدان المبيعات',
      priority: 'high',
    },
  ],
  activityFeed: [
    { id: 1, text: 'طلب جديد من محمد أحمد - 2,500 ر.س', time: 'منذ 5 دقائق', type: 'order' },
    { id: 2, text: 'تم إرسال فاتورة #1547 بنجاح', time: 'منذ 15 دقيقة', type: 'invoice' },
    { id: 3, text: 'عميل جديد سجل عبر صفحة الهبوط', time: 'منذ 30 دقيقة', type: 'customer' },
    { id: 4, text: 'حملة "رمضان كريم" حققت 450 نقرة', time: 'منذ ساعة', type: 'campaign' },
    { id: 5, text: 'تحديث حالة الطلب #892 - تم الشحن', time: 'منذ ساعتين', type: 'order' },
    { id: 6, text: 'رد تلقائي أُرسل لـ 12 عميل عبر واتساب', time: 'منذ 3 ساعات', type: 'whatsapp' },
  ],
  salesChart: {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
    data: [65000, 78000, 90000, 81000, 95000, 110000, 125000],
  },
  customersChart: {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
    data: [120, 150, 180, 210, 250, 290, 340],
  },
};

export const sidebarMenu = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: 'dashboard', path: '/app' },
  { id: 'ai-agents', label: 'وكلاء الذكاء الاصطناعي', icon: 'ai', path: '/app/ai-agents' },
  { id: 'communications', label: 'التواصل مع العملاء', icon: 'chat', path: '/app/communications' },
  { id: 'marketing', label: 'التسويق الآلي', icon: 'marketing', path: '/app/marketing' },
  { id: 'invoicing', label: 'الفواتير', icon: 'invoice', path: '/app/invoicing' },
  { id: 'decisions', label: 'محرك القرارات', icon: 'brain', path: '/app/decisions' },
  { id: 'sector', label: 'وحدة القطاع', icon: 'sector', path: '/app/sector' },
  { id: 'notifications', label: 'الإشعارات', icon: 'notifications', path: '/app/notifications' },
  { id: 'billing', label: 'الفوترة والاشتراك', icon: 'billing', path: '/app/billing' },
  { id: 'settings', label: 'الإعدادات', icon: 'settings', path: '/app/settings' },
];

export const adminMenu = [
  { id: 'admin-dashboard', label: 'نظرة عامة', icon: 'dashboard', path: '/admin' },
  { id: 'admin-companies', label: 'الشركات', icon: 'companies', path: '/admin/companies' },
  { id: 'admin-revenue', label: 'الإيرادات', icon: 'revenue', path: '/admin/revenue' },
  { id: 'admin-subscriptions', label: 'الاشتراكات', icon: 'subscriptions', path: '/admin/subscriptions' },
  { id: 'admin-analytics', label: 'التحليلات', icon: 'analytics', path: '/admin/analytics' },
  { id: 'admin-ai', label: 'إدارة الذكاء الاصطناعي', icon: 'ai', path: '/admin/ai-control' },
];

export const pricingPlans = [
  {
    id: 'basic',
    name: 'الأساسية',
    price: 299,
    period: '/شهرياً',
    features: [
      'لوحة تحكم ذكية',
      'تقارير أساسية',
      'دعم واتساب',
      '1 وكيل ذكاء اصطناعي',
      'حتى 100 عميل',
      '5 فواتير شهرياً',
    ],
    popular: false,
    cta: 'ابدأ الآن',
  },
  {
    id: 'pro',
    name: 'الاحترافية',
    price: 799,
    period: '/شهرياً',
    features: [
      'كل مميزات الأساسية',
      'تحليلات متقدمة',
      '3 وكلاء ذكاء اصطناعي',
      'حملات تسويقية آلية',
      'حتى 1000 عميل',
      'فواتير غير محدودة',
      'محرك القرارات الذكي',
    ],
    popular: true,
    cta: 'الأكثر شيوعاً',
  },
  {
    id: 'enterprise',
    name: 'المؤسسات',
    price: 1999,
    period: '/شهرياً',
    features: [
      'كل مميزات الاحترافية',
      'وكلاء ذكاء اصطناعي غير محدودين',
      'تكامل ERP كامل',
      'تحليلات تنبؤية',
      'عملاء غير محدودين',
      'دعم مخصص 24/7',
      'تقارير مخصصة',
      'API مفتوح',
    ],
    popular: false,
    cta: 'تواصل معنا',
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'د. سارة الحربي',
    role: 'مؤسسة عيادة لمسة جمال',
    text: 'وكل غيّر طريقة إدارتنا بالكامل. أصبحت المواعيد تُدار تلقائياً والمرضى يتلقون تذكيرات عبر واتساب. وفّرنا 60% من وقت الإدارة.',
    avatar: '👩‍⚕️',
    sector: 'عيادة',
  },
  {
    id: 2,
    name: 'عبدالله المطيري',
    role: 'مدير مجموعة دار العقار',
    text: 'تتبع العملاء المحتملين والعمولات أصبح سهلاً جداً. الذكاء الاصطناعي يقترح أفضل العقارات لكل عميل تلقائياً.',
    avatar: '🏗️',
    sector: 'عقارات',
  },
  {
    id: 3,
    name: 'فهد القحطاني',
    role: 'صاحب ورشة الخليج للسيارات',
    text: 'تتبع الصيانة وقطع الغيار أصبح منظّماً. العملاء يتلقون تذكيرات بمواعيد الصيانة وهذا زاد ولاءهم بشكل كبير.',
    avatar: '🚗',
    sector: 'ورشة',
  },
];

export const features = [
  {
    id: 1,
    icon: '🤖',
    title: 'ذكاء اصطناعي متقدم',
    description: 'وكلاء ذكاء اصطناعي يحللون بياناتك ويقدمون توصيات عملية لزيادة أرباحك',
  },
  {
    id: 2,
    icon: '💬',
    title: 'تكامل واتساب',
    description: 'ردود تلقائية ذكية وإدارة محادثات العملاء مباشرة من لوحة التحكم',
  },
  {
    id: 3,
    icon: '📊',
    title: 'تحليلات متقدمة',
    description: 'رسوم بيانية تفاعلية وتقارير مفصلة لفهم أداء عملك بعمق',
  },
  {
    id: 4,
    icon: '🧾',
    title: 'فوترة ذكية',
    description: 'إنشاء فواتير متوافقة مع ضريبة القيمة المضافة وتتبع المدفوعات تلقائياً',
  },
  {
    id: 5,
    icon: '📢',
    title: 'تسويق آلي',
    description: 'حملات تسويقية مدعومة بالذكاء الاصطناعي مع نصوص عربية احترافية',
  },
  {
    id: 6,
    icon: '🧠',
    title: 'محرك القرارات',
    description: 'تنبيهات ذكية وتسعير ديناميكي واقتراحات لتحسين أداء عملك',
  },
];

export const aiAgents = [
  {
    id: 'sales',
    name: 'وكيل المبيعات',
    nameEn: 'Sales AI',
    description: 'يحلل بيانات المبيعات ويقترح استراتيجيات لزيادة الإيرادات',
    status: 'active',
    tasks: 24,
    accuracy: 94,
    icon: '💰',
    color: '#34D399',
    insights: [
      'العميل أحمد لديه احتمال 85% للشراء - تواصل معه اليوم',
      'المنتج X يحقق مبيعات أعلى بـ 40% في عطلة نهاية الأسبوع',
      'زيادة السعر بـ 5% لن تؤثر على حجم المبيعات',
    ],
  },
  {
    id: 'marketing',
    name: 'وكيل التسويق',
    nameEn: 'Marketing AI',
    description: 'ينشئ حملات تسويقية ويحلل أداءها ويقترح تحسينات',
    status: 'active',
    tasks: 18,
    accuracy: 91,
    icon: '📢',
    color: '#0A84FF',
    insights: [
      'أفضل وقت للنشر على وسائل التواصل: 8-10 مساءً',
      'حملة "خصم رمضان" حققت ROI بنسبة 340%',
      'جمهورك المستهدف يفضل المحتوى المرئي بنسبة 70%',
    ],
  },
  {
    id: 'support',
    name: 'وكيل الدعم',
    nameEn: 'Support AI',
    description: 'يرد على استفسارات العملاء تلقائياً ويصنف التذاكر',
    status: 'active',
    tasks: 56,
    accuracy: 88,
    icon: '🎧',
    color: '#FBBF24',
    insights: [
      'تم الرد على 89% من الاستفسارات تلقائياً اليوم',
      'أكثر سؤال شائع: "ما هي ساعات العمل؟"',
      'رضا العملاء عن الردود التلقائية: 4.2/5',
    ],
  },
];

export const invoices = [
  { id: 'INV-1547', client: 'شركة الفجر التقنية', amount: 15000, vat: 2250, status: 'paid', date: '2026-04-14' },
  { id: 'INV-1546', client: 'مؤسسة النخبة', amount: 8500, vat: 1275, status: 'pending', date: '2026-04-13' },
  { id: 'INV-1545', client: 'عيادة الشفاء', amount: 3200, vat: 480, status: 'paid', date: '2026-04-12' },
  { id: 'INV-1544', client: 'مكتب دار العقار', amount: 22000, vat: 3300, status: 'overdue', date: '2026-04-10' },
  { id: 'INV-1543', client: 'متجر الأناقة', amount: 6800, vat: 1020, status: 'paid', date: '2026-04-09' },
  { id: 'INV-1542', client: 'ورشة الخليج', amount: 4500, vat: 675, status: 'pending', date: '2026-04-08' },
];

export const notifications = [
  { id: 1, title: 'تنبيه مبيعات', text: 'انخفاض في المبيعات بنسبة 15% مقارنة بأمس', type: 'warning', time: 'منذ 10 دقائق', read: false },
  { id: 2, title: 'عميل جديد', text: 'سجل عميل جديد من حملة واتساب', type: 'success', time: 'منذ 30 دقيقة', read: false },
  { id: 3, title: 'فاتورة مستحقة', text: 'فاتورة #1544 متأخرة 5 أيام', type: 'danger', time: 'منذ ساعة', read: false },
  { id: 4, title: 'حملة مكتملة', text: 'حملة "عروض الربيع" انتهت بنجاح', type: 'info', time: 'منذ 3 ساعات', read: true },
  { id: 5, title: 'تحديث النظام', text: 'تم تحديث وكيل المبيعات بنجاح', type: 'info', time: 'منذ 5 ساعات', read: true },
  { id: 6, title: 'مخزون منخفض', text: '3 منتجات وصلت للحد الأدنى', type: 'warning', time: 'أمس', read: true },
];

export const companies = [
  { id: 1, name: 'عيادة لمسة جمال', sector: 'عيادة', plan: 'احترافية', revenue: 45000, status: 'active', users: 8 },
  { id: 2, name: 'مجموعة دار العقار', sector: 'عقارات', plan: 'مؤسسات', revenue: 120000, status: 'active', users: 25 },
  { id: 3, name: 'ورشة الخليج', sector: 'ورشة', plan: 'أساسية', revenue: 18000, status: 'active', users: 5 },
  { id: 4, name: 'متجر الأناقة', sector: 'متجر إلكتروني', plan: 'احترافية', revenue: 67000, status: 'active', users: 12 },
  { id: 5, name: 'عيادة الشفاء', sector: 'عيادة', plan: 'احترافية', revenue: 38000, status: 'active', users: 10 },
  { id: 6, name: 'مؤسسة النخبة', sector: 'متجر إلكتروني', plan: 'أساسية', revenue: 22000, status: 'suspended', users: 3 },
];

export const clinicData = {
  patients: [
    { id: 1, name: 'نورة العتيبي', phone: '0551234567', lastVisit: '2026-04-10', nextAppt: '2026-04-20', status: 'active' },
    { id: 2, name: 'فاطمة الدوسري', phone: '0559876543', lastVisit: '2026-04-08', nextAppt: '2026-04-18', status: 'active' },
    { id: 3, name: 'مريم الشهري', phone: '0553456789', lastVisit: '2026-03-25', nextAppt: null, status: 'inactive' },
    { id: 4, name: 'سارة المالكي', phone: '0557654321', lastVisit: '2026-04-14', nextAppt: '2026-04-28', status: 'active' },
  ],
  todayAppointments: 8,
  weekAppointments: 42,
  totalPatients: 234,
};

export const realEstateData = {
  properties: [
    { id: 1, title: 'فيلا فاخرة - حي الملقا', type: 'فيلا', price: 2500000, area: 450, bedrooms: 5, status: 'available' },
    { id: 2, title: 'شقة عصرية - حي العليا', type: 'شقة', price: 850000, area: 180, bedrooms: 3, status: 'reserved' },
    { id: 3, title: 'أرض تجارية - طريق الملك', type: 'أرض', price: 5000000, area: 1200, bedrooms: 0, status: 'available' },
    { id: 4, title: 'مكتب تجاري - حي الورود', type: 'مكتب', price: 1200000, area: 250, bedrooms: 0, status: 'sold' },
  ],
  totalListings: 48,
  activeLeads: 67,
  totalCommissions: 185000,
};

export const workshopData = {
  services: [
    { id: 1, car: 'تويوتا كامري 2024', owner: 'خالد العمري', service: 'تغيير زيت + فلتر', status: 'in-progress', date: '2026-04-15' },
    { id: 2, car: 'هيونداي سوناتا 2023', owner: 'سعود الحربي', service: 'فحص شامل', status: 'completed', date: '2026-04-14' },
    { id: 3, car: 'نيسان باترول 2025', owner: 'فيصل المتعب', service: 'إصلاح فرامل', status: 'waiting', date: '2026-04-15' },
    { id: 4, car: 'لكزس ES 2024', owner: 'عبدالرحمن السعيد', service: 'برمجة كمبيوتر', status: 'in-progress', date: '2026-04-15' },
  ],
  todayServices: 12,
  partsLowStock: 5,
  monthRevenue: 78000,
};

export const ecommerceData = {
  products: [
    { id: 1, name: 'عطر فاخر - مسك طيبة', price: 350, stock: 45, sold: 128, category: 'عطور' },
    { id: 2, name: 'حقيبة جلد طبيعي', price: 680, stock: 12, sold: 89, category: 'حقائب' },
    { id: 3, name: 'ثوب رجالي فاخر', price: 450, stock: 67, sold: 210, category: 'ملابس' },
    { id: 4, name: 'ساعة كلاسيكية', price: 1200, stock: 8, sold: 34, category: 'إكسسوارات' },
  ],
  totalOrders: 856,
  pendingOrders: 23,
  monthRevenue: 125000,
};

export const campaigns = [
  { id: 1, name: 'حملة رمضان كريم', status: 'active', reach: 12500, clicks: 890, conversions: 45, budget: 5000 },
  { id: 2, name: 'خصومات نهاية الموسم', status: 'scheduled', reach: 0, clicks: 0, conversions: 0, budget: 8000 },
  { id: 3, name: 'عروض الجمعة البيضاء', status: 'completed', reach: 45000, clicks: 3200, conversions: 180, budget: 15000 },
  { id: 4, name: 'إطلاق منتج جديد', status: 'draft', reach: 0, clicks: 0, conversions: 0, budget: 3000 },
];

export const chatMessages = [
  { id: 1, sender: 'customer', name: 'محمد الحربي', text: 'السلام عليكم، هل الخدمة متاحة اليوم؟', time: '10:30 ص' },
  { id: 2, sender: 'ai', name: 'وكيل الدعم', text: 'وعليكم السلام! نعم، جميع خدماتنا متاحة اليوم من 9 صباحاً حتى 9 مساءً. كيف يمكنني مساعدتك؟', time: '10:30 ص' },
  { id: 3, sender: 'customer', name: 'محمد الحربي', text: 'أريد حجز موعد لغداً الساعة 2 الظهر', time: '10:31 ص' },
  { id: 4, sender: 'ai', name: 'وكيل الدعم', text: 'تم حجز موعدك بنجاح ليوم غد الساعة 2:00 ظهراً ✅ سيتم إرسال تأكيد عبر واتساب.', time: '10:31 ص' },
];

from fastapi import APIRouter
from pydantic import BaseModel
import asyncio
import random

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    agent_id: str = "general"

@router.get("/agents/overview")
async def agents_overview():
    await asyncio.sleep(0.5)
    return {
        "fleet_health": 0.96,
        "total_tasks_today": 128,
        "cross_agent_playbooks": [
            "حملة البريد التسويقي مع متابعة المبيعات",
            "تحليل الشكاوى وتصعيدها فورياً للرد التلقائي",
            "توليد فواتير آلية للطلبات المكتملة"
        ],
        "agents": [
            {
                "id": "sales",
                "status": "active",
                "tasks_today": 34,
                "accuracy": 96,
                "workflows": ["متابعة العملاء المترددين", "توصيات المنتجات المشابهة"]
            },
            {
                "id": "marketing",
                "status": "active",
                "tasks_today": 28,
                "accuracy": 92,
                "workflows": ["النشر الآلي على انستقرام", "تحليل هاشتاقات الترند"]
            },
            {
                "id": "support",
                "status": "active",
                "tasks_today": 66,
                "accuracy": 89,
                "workflows": ["الردود التلقائية لسياسة الاسترجاع", "تصنيف تذاكر الدعم"]
            }
        ]
    }

@router.post("/agents/chat")
async def chat_with_agent(data: ChatMessage):
    """Real-time mock of an intelligent assistant responding"""
    await asyncio.sleep(random.uniform(0.5, 1.2))
    
    msg = data.message.lower()
    
    if "مبيعات" in msg or "مبيعه" in msg:
        reply = "لقد قمت بتحليل أداء المبيعات. إجمالي المبيعات هذا الشهر ارتفع بنسبة 18% مقارنة بالشهر الماضي. أنصحك بالتركيز على تسويق 'المنتجات الصيفية' حالياً."
    elif "تسويق" in msg or "اعلان" in msg or "سوشيال" in msg:
        reply = "حسناً، أقترح إطلاق حملة تسويقية عبر الإنستقرام تستهدف الفئة العمرية 18-35 بخصم 15%. هل تريدني أن أكتب لك المحتوى الإعلاني؟"
    elif "فواتير" in msg or "ميزانية" in msg or "فلوس" in msg:
        reply = "هناك 3 فواتير مستحقة الدفع بقيمة إجمالية 4500 ريال. هل ترغب في إرسال تذكير آلي للعملاء عبر الواتساب؟"
    elif "مشكلة" in msg or "دعم" in msg:
        reply = "أرى بعض التذاكر المتعلقة بتأخير الشحن. قمت بإنشاء رد تلقائي يطمئن العملاء بتحديث حالة الشحنة. هل أرسله الآن؟"
    else:
        responses = [
            f"متواجد دائماً لمساعدتك. كيف يمكنني دعم عملك في قسم {data.agent_id}؟",
            "أهلاً بك! راجعت المهام الأخيرة، وكل شيء يسير كما خُطط له.",
            "هل هناك مسألة معينة تودني تحليل أدائها اليوم؟",
            "أنا جاهز لاستقبال أي تعليمات جديدة تخص سير العمل.",
            "ممتاز، تم حفظ الملاحظة وجاري تحديث خوارزميات العمل المباشرة."
        ]
        reply = random.choice(responses)

    return {
        "reply": reply,
        "agent_id": data.agent_id,
        "status": "success"
    }

@router.get("/insights")
async def get_insights():
    return {
        "insights": [
            {
                "id": 1,
                "type": "warning",
                "text": "انخفضت مبيعاتك بنسبة 12% هذا الأسبوع مقارنة بالأسبوع الماضي",
                "action": "نقترح إطلاق حملة خصومات لتحفيز المبيعات",
                "priority": "high",
                "confidence": 0.92,
            },
            {
                "id": 2,
                "type": "success",
                "text": "زيادة في التفاعل مع العملاء بنسبة 25% بعد آخر حملة تسويقية",
                "action": "استمر في نفس الاستراتيجية",
                "priority": "medium",
                "confidence": 0.88,
            },
        ],
        "agents_status": {
            "sales": {"status": "active", "tasks_today": 24, "accuracy": 94},
            "marketing": {"status": "active", "tasks_today": 18, "accuracy": 91},
            "support": {"status": "active", "tasks_today": 56, "accuracy": 88},
        }
    }

@router.post("/generate-copy")
async def generate_marketing_copy(data: dict):
    product = data.get("description", "منتج")
    ad_type = data.get("ad_type", "social")
    await asyncio.sleep(1)
    copies = {
        "social": f"🌟 عرض حصري لعملائنا! اكتشف {product} الآن واستمتع بخصم 30% لفترة محدودة. لا تفوّت الفرصة! 📱",
        "whatsapp": f"السلام عليكم! 👋 يسعدنا تقديم {product} بعرض خاص حصري لك. تواصل معنا الآن للاستفادة! ✨",
        "email": f"عزيزنا العميل، يسرنا أن نقدم لك {product}. اكتشف المزيد واستفد من عروضنا الحصرية.",
    }
    return {
        "generated_copy": copies.get(ad_type, copies["social"]),
        "suggestions": ["أضف emoji لزيادة التفاعل بنسبة 25%", "أفضل وقت للنشر: 8-10 مساءً"]
    }

@router.get("/pricing-suggestions")
async def get_pricing_suggestions():
    return {
        "suggestions": [
            {"product": "عطر فاخر - مسك طيبة", "current_price": 350, "suggested_price": 380, "reason": "طلب مرتفع", "impact": "+8.6%"},
            {"product": "حقيبة جلد طبيعي", "current_price": 680, "suggested_price": 750, "reason": "منافس رفع السعر", "impact": "+10.3%"},
        ]
    }

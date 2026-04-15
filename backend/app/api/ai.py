from fastapi import APIRouter

router = APIRouter()


@router.get("/insights")
async def get_insights():
    """Get AI-generated business insights"""
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
                "action": "استمر في نفس الاستراتيجية مع زيادة الميزانية",
                "priority": "medium",
                "confidence": 0.88,
            },
            {
                "id": 3,
                "type": "info",
                "text": "تم اكتشاف 15 عميل محتمل جديد من خلال واتساب",
                "action": "قم بتعيين موظف مبيعات للتواصل معهم",
                "priority": "medium",
                "confidence": 0.95,
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
    """Generate AI marketing copy in Arabic"""
    product = data.get("description", "منتج")
    ad_type = data.get("ad_type", "social")

    # Mock AI-generated copy
    copies = {
        "social": f"🌟 عرض حصري لعملائنا! اكتشف {product} الآن واستمتع بخصم 30% لفترة محدودة. لا تفوّت الفرصة! 📱",
        "whatsapp": f"السلام عليكم! 👋 يسعدنا تقديم {product} بعرض خاص حصري لك. تواصل معنا الآن للاستفادة! ✨",
        "email": f"عزيزنا العميل، يسرنا أن نقدم لك {product}. اكتشف المزيد واستفد من عروضنا الحصرية.",
    }

    return {
        "generated_copy": copies.get(ad_type, copies["social"]),
        "suggestions": [
            "أضف emoji لزيادة التفاعل بنسبة 25%",
            "استخدم CTA واضح مثل 'احجز الآن' أو 'تسوق الآن'",
            "أفضل وقت للنشر: 8-10 مساءً",
        ]
    }


@router.get("/pricing-suggestions")
async def get_pricing_suggestions():
    """Get dynamic pricing suggestions"""
    return {
        "suggestions": [
            {"product": "عطر فاخر - مسك طيبة", "current_price": 350, "suggested_price": 380, "reason": "طلب مرتفع + مخزون محدود", "impact": "+8.6%"},
            {"product": "حقيبة جلد طبيعي", "current_price": 680, "suggested_price": 750, "reason": "منافس رفع السعر", "impact": "+10.3%"},
            {"product": "ثوب رجالي فاخر", "current_price": 450, "suggested_price": 420, "reason": "موسم ركود - تحفيز المبيعات", "impact": "-6.7%"},
        ]
    }

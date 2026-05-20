# نظام اللغات المتعددة / Multi-Language System

## ✨ الميزات / Features

تم إضافة نظام تبديل اللغة بين العربية والإنجليزية للموقع مع الميزات التالية:

- 🌐 تبديل فوري بين العربية والإنجليزية
- 🔄 دعم RTL (من اليمين لليسار) للعربية
- 💾 حفظ اللغة المفضلة في المتصفح
- 🎨 خط Cairo للعربية
- ⚡ تحديث تلقائي لجميع النصوص

---

## 🚀 كيفية الاستخدام / How to Use

### للمستخدمين / For Users

1. **في الشاشات الكبيرة**: اضغط على زر اللغة في قائمة التنقل العلوية
2. **في الموبايل**: اضغط على أيقونة اللغات بجانب قائمة الهامبرجر

### للمطورين / For Developers

#### إضافة ترجمات جديدة / Adding New Translations

1. افتح ملف `src/translations/translations.js`
2. أضف النص في كل من `en` و `ar`:

```javascript
export const translations = {
  en: {
    yourSection: {
      yourKey: "Your English Text",
    },
  },
  ar: {
    yourSection: {
      yourKey: "النص بالعربية",
    },
  },
};
```

#### استخدام الترجمات في المكونات / Using Translations in Components

```javascript
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations/translations";

const YourComponent = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <div>
      <h1>{t("yourSection.yourKey")}</h1>
    </div>
  );
};
```

#### الوصول لزر تبديل اللغة / Access to Language Toggle

زر تبديل اللغة متاح في:

- `Navbar` component - موجود في القائمة العلوية
- يمكن إضافته في أي مكون آخر باستخدام `toggleLanguage()` من `useLanguage()`

---

## 📁 الملفات المضافة / Added Files

- `src/context/LanguageContext.jsx` - Context إدارة حالة اللغة
- `src/translations/translations.js` - جميع الترجمات

## 🔧 الملفات المحدثة / Updated Files

- `src/App.jsx` - إضافة LanguageProvider
- `src/components/Navbar.jsx` - إضافة زر تبديل اللغة
- `src/pages/Home.jsx` - استخدام الترجمات
- `src/index.css` - دعم خط Cairo و RTL

---

## 📝 ملاحظات / Notes

- اللغة المحفوظة تبقى حتى بعد إعادة تحميل الصفحة
- يتم تطبيق اتجاه النص (RTL/LTR) تلقائياً
- جميع الصفحات الرئيسية تدعم الترجمة حالياً
- يمكن إضافة المزيد من اللغات بسهولة

---

## 🎯 الخطوات التالية / Next Steps

لإكمال نظام الترجمة، يُنصح بـ:

1. ترجمة باقي الصفحات (Classes, Retreats, Pricing, About, Contact)
2. ترجمة نصوص البيانات في `src/data/mockData.js`
3. ترجمة نصوص نماذج الحجز (Booking Modals)

---

Made with 💚 by Heba Mind & Body

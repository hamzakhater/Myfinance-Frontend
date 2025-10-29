# CAHT Personal Finance Dashboard

**CAHT Dashboard** هو مشروع لوحة تحكم لإدارة المصروفات والدخل الشخصي، مبني باستخدام React.js و React-Bootstrap، مع دعم الرسوم البيانية، التصدير إلى Excel/PDF، ونظام تسجيل دخول مستخدمين مع JWT.

---

## 📌 المميزات

- تسجيل الدخول / تسجيل مستخدم جديد
- استعادة كلمة المرور وإعادة تعيينها
- عرض ملخص الدخل، المصروفات، والرصيد
- إضافة دخل أو مصروف مع تأكيد منبثق (CAHT Confirm)
- تصفية البيانات حسب الشهر
- الرسوم البيانية: مخطط أعمدة ومخطط دائري
- عرض أعلى 3 مصروفات
- تصدير البيانات إلى Excel و PDF
- الوضع الداكن / الفاتح
- تنبيهات ذكية ونصائح لتوفير المال

---

## 🛠️ التقنيات المستخدمة

- [React.js](https://reactjs.org/)
- [React-Bootstrap](https://react-bootstrap.github.io/)
- [Chart.js](https://www.chartjs.org/)
- [Axios](https://axios-http.com/)
- [jspdf + jspdf-autotable](https://github.com/parallax/jsPDF)
- [XLSX](https://github.com/SheetJS/sheetjs)
- JWT للتحقق من هوية المستخدم

---

## ⚡ المتطلبات

- Node.js >= 16
- npm أو yarn
- خادم API جاهز (Backend) يدعم endpoints التالية:

| Endpoint                | Method | بيانات                              |
| ----------------------- | ------ | ----------------------------------- |
| `/auth/login`           | POST   | `{ email, password }`               |
| `/auth/signup`          | POST   | `{ name, email, password }`         |
| `/auth/forgot-password` | POST   | `{ email }`                         |
| `/auth/reset-password`  | POST   | `{ token, password }`               |
| `/income`               | GET    | -                                   |
| `/income/add`           | POST   | `{ MonthlyIncome, comment }`        |
| `/expenses`             | GET    | -                                   |
| `/expenses/add`         | POST   | `{ amount, description, category }` |

---

## 💻 طريقة التشغيل محليًا

1. تثبيت الحزم:

```bash
npm install
# أو
yarn install
```

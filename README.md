# InvoiceForge 🧾

> **Professional GST Invoice Generator** — Create, preview, and download clean invoices in seconds.

![InvoiceForge](https://img.shields.io/badge/InvoiceForge-v1.0.0-4361ee?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ Features

- 🧾 **Live Invoice Preview** — real-time updates as you type
- 📄 **PDF Download** — styled PDF with jsPDF + autoTable
- 🖨️ **Print Support** — browser native print with clean layout
- 📋 **Copy Summary** — formatted invoice text to clipboard
- 🖼️ **Company Logo Upload** — drag & drop, instant preview in PDF
- 💱 **Currency Selector** — INR ₹, USD $, EUR €
- 🌙 **Dark Mode** — persisted across sessions
- 💾 **Auto-save** — localStorage persistence on refresh
- ✅ **Form Validation** — inline error messages
- 📱 **Fully Responsive** — mobile, tablet, desktop

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool |
| Tailwind CSS 3 | Styling |
| jsPDF + autoTable | PDF generation |
| React Hooks | State management |

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Harsha07r/Invoice_Generator.git
cd Invoice_Generator

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder.

## 📁 Project Structure

```
src/
├── App.jsx
├── index.css
├── hooks/         # useInvoice, useLocalStorage, useDarkMode
├── utils/         # calculations, pdfGenerator, clipboard, invoiceNumber
└── components/
    ├── ui/        # Button, InputField, CurrencySelector, Toast
    ├── form/      # SellerInfo, BuyerInfo, InvoiceDetails, LineItems, GSTSection
    └── preview/   # InvoicePreview, PreviewTable
```

## 👤 Author

**Harsha Vardhan**  
📧 harshaalapati1324@gmail.com

[![Digital Heroes](https://img.shields.io/badge/Built%20for-Digital%20Heroes-f97316?style=for-the-badge)](https://digitalheroesco.com)

## 📄 License

MIT © 2024 Harsha Vardhan
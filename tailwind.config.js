export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:'#eff6ff',100:'#dbeafe',500:'#3b82f6',
          600:'#2563eb',700:'#1d4ed8',900:'#1e3a8a',
        },
        ink: { 900:'#111827', 700:'#374151', 500:'#6b7280', 300:'#d1d5db' },
        surface: { 0:'#ffffff', 50:'#f8fafc', 100:'#f1f5f9' },
        state: {
          success:'#16a34a', warning:'#d97706',
          danger:'#dc2626', info:'#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter','system-ui','-apple-system','sans-serif'],
      },
      borderRadius: { md:'8px', lg:'12px' },
      boxShadow: {
        card:'0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        pop:'0 10px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
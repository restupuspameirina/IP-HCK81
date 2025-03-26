/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          "base-100": "#FFF7F1",  // Latar belakang yang hangat dan nyaman
          "primary": "#E8D7D0",   // Warna utama yang soft dan feminin
          "secondary": "#F4C2C2", // Warna sekunder dengan sentuhan pastel pink
          "accent": "#D9886A",    // Warna tombol (button) yang menarik perhatian namun tetap elegan
          "neutral": "#4A403A"    // Warna teks utama yang kontras tetapi tetap lembut
        }
      }
    ]
  }
}

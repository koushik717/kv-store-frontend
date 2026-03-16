/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        leader: "#22c55e",
        follower: "#3b82f6",
        dead: "#ef4444",
        bg: "#0f172a",
        card: "#1e293b",
        border: "#334155",
      }
    }
  },
  plugins: []
}

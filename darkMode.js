import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || (!saved && window.matchMedia("(prefers-color-scheme: light)").matches)) {
      document.documentElement.classList.add("light");
      setIsLight(true);
    } else {
      document.documentElement.classList.remove("light");
      setIsLight(false);
    }
  }, []);

  const toggleLightMode = () => {
    const html = document.documentElement;
    html.classList.toggle("light");
    const dark = html.classList.contains("light");

    setIsLight(!dark);
    localStorage.setItem("theme", dark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleLightMode}
      className="p-2 rounded-full shadow-md hover:scale-110 transition-transform"
      aria-label="Toggle light mode"
    >
      {isLight ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

import { useState, useEffect } from "react";

export function useTimer(initial = 847) {
  const [time, setTime] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => setTime(t => (t > 0 ? t - 1 : 847)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(time / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");
  return `${m}:${s}`;
}

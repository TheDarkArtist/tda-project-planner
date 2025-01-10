import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a a six digit random code
 * i.e.  4kJ23l
 * contains: a-z A-Z 0-9
 * **/
export const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () =>
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[
        Math.floor(Math.random() * 36)
      ],
  ).join("");

  return code;
};

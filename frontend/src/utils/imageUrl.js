const BASE_URL = "http://localhost:3000";

// Agar path already full URL hai (http se shuru), to waisa hi return karo.
// Agar relative path hai (DB se aayi hui, jaise "/uploads/hostels/xxx.jpg"), 
// to base URL prepend karo.
export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};
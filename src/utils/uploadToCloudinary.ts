export const uploadToCloudinary = async (file: File, folder = "codecave/videos") => {
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dk6kyqn2z/video/upload";
  const UPLOAD_PRESET = "CodeCaveVideo"; // твой preset

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Ошибка загрузки в Cloudinary");

  const data = await res.json();
  return data.secure_url; // получаем ссылку на видео
};

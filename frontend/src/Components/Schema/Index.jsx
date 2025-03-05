import * as Yup from "yup";

// const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
export const loginSchema = Yup.object({
  username: Yup.string().required("Kindly enter your Username!!"),
  password: Yup.string().required("Kindly enter your Password!!"),
});

export const signupSchema = Yup.object({
  username: Yup.string().required("Kindly enter your Username!!"),
  email: Yup.string().email().required("Kindly enter valid Email!!"),
  password: Yup.string().required("Kindly enter Password"),
});

export const newSchema = Yup.object({
  title: Yup.string().required("Kindly Add Title"),
  description: Yup.string().max(300).required("Kindly Add Description"),
  image: Yup.mixed()
    .required("Image is required")
    .test("fileType", "Unsupported file format", (value) => {
      return value && ["image/jpeg", "image/png"].includes(value.type);
    })
    .test("fileSize", "File too large (max 5MB)", (value) => {
      return value && value.size <= 5 * 1024 * 1024;
    }),
  price: Yup.number().required("Kindly enter Price!!"),
  country: Yup.string().required("Kindly enter country!!"),
  location: Yup.string().required("Kindly enter Location"),
  category: Yup.string().required("Kindly select a category"),
});

export const editSchema = Yup.object({
  title: Yup.string().required("Kindly Add Title"),
  description: Yup.string().max(300).required("Kindly Add Description"),
  image: Yup.mixed()
    .test(
      "fileType",
      "Unsupported file format. Only JPG and PNG allowed.",
      (value) => {
        if (!value) return true; // Allow empty image field
        return value && ["image/jpeg", "image/png"].includes(value.type);
      }
    )
    .test("fileSize", "File too large (max 5MB)", (value) => {
      if (!value) return true; // Allow empty image field
      return value && value.size <= 5 * 1024 * 1024; // Max 2MB
    }),
  price: Yup.number().required("Kindly enter Price!!"),
  country: Yup.string().required("Kindly enter country!!"),
  location: Yup.string().required("Kindly enter Location"),
});

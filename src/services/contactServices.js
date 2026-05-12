import { apiService } from "./api";

export const contactService = {
  sendContactForm: (data) => apiService.post("/contact", data),
};
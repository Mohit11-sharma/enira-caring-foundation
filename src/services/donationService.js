import { apiService } from './api';

class DonationService {
  async getAll() {
    return await apiService.get('/donations');
  }

  async donate(data) {
    return await apiService.post('/donations', data);
  }

  async uploadCertificate(donationId, file) {
    // Read file as base64
    const toBase64 = file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

    const base64 = await toBase64(file);

    // Send as JSON
    return await apiService.post(`/donations/${donationId}/certificate`, {
      certificate: base64,
      filename: file.name,
      mimetype: file.type
    });
  }
}

export const donationService = new DonationService();
export default donationService;
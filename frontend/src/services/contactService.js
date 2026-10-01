import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const contactService = {
  async getAllContacts() {
    const response = await axios.get(
      `${API_BASE_URL}/contacts`
    );

    return response.data;
  },

  async getContactById(id) {
    const response = await axios.get(
      `${API_BASE_URL}/contacts/${id}`
    );

    return response.data;
  },

  async createContact(contactData) {
    const response = await axios.post(
      `${API_BASE_URL}/contacts`,
      contactData
    );

    return response.data;
  },

  async updateContact(id, contactData) {
    const response = await axios.put(
      `${API_BASE_URL}/contacts/${id}`,
      contactData
    );

    return response.data;
  },

  async deleteContact(id) {
    const response = await axios.delete(
      `${API_BASE_URL}/contacts/${id}`
    );

    return response.data;
  }
};

export default contactService;
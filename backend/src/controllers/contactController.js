import contactService from "../services/contactService.js";

const contactController = {
  async getAllContacts(req, res) {
    try {
      const contacts = await contactService.getAllContacts();

      res.status(200).json({
        success: true,
        count: contacts.length,
        data: contacts
      });
    } catch (error) {
      console.error("Get contacts error:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to fetch emergency contacts"
      });
    }
  },

  async getContactById(req, res) {
    try {
      const { id } = req.params;

      const contact = await contactService.getContactById(id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Emergency contact not found"
        });
      }

      res.status(200).json({
        success: true,
        data: contact
      });
    } catch (error) {
      console.error("Get contact error:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to fetch emergency contact"
      });
    }
  },

  async createContact(req, res) {
    try {
      const { name, phone, relationship } = req.body;

      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          message: "Name and phone are required"
        });
      }

      const contact = await contactService.createContact({
        name,
        phone,
        relationship
      });

      res.status(201).json({
        success: true,
        message: "Emergency contact created successfully",
        data: contact
      });
    } catch (error) {
      console.error("Create contact error:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to create emergency contact"
      });
    }
  },

  async updateContact(req, res) {
    try {
      const { id } = req.params;
      const { name, phone, relationship } = req.body;

      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          message: "Name and phone are required"
        });
      }

      const contact = await contactService.updateContact(id, {
        name,
        phone,
        relationship
      });

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Emergency contact not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Emergency contact updated successfully",
        data: contact
      });
    } catch (error) {
      console.error("Update contact error:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to update emergency contact"
      });
    }
  },

  async deleteContact(req, res) {
    try {
      const { id } = req.params;

      const deleted = await contactService.deleteContact(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Emergency contact not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Emergency contact deleted successfully"
      });
    } catch (error) {
      console.error("Delete contact error:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to delete emergency contact"
      });
    }
  }
};

export default contactController;
import aiService from "../services/aiService.js";

const aiController = {
  async chat(req, res) {
    try {
      const { message, history = [] } = req.body;
      if (!message?.trim()) return res.status(400).json({ success:false, message:"Message is required." });
      const reply = await aiService.reply(message, history);
      res.json({ success:true, data:{ reply } });
    } catch (error) {
      res.status(500).json({ success:false, message:error.message });
    }
  }
};

export default aiController;

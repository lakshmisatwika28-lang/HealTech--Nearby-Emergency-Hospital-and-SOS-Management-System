import api from "./api";

export const sendAIMessage = async (message, history = []) => {
  const { data } = await api.post("/ai/health-buddy", {
    message,
    history
  });

  return data.data.reply;
};
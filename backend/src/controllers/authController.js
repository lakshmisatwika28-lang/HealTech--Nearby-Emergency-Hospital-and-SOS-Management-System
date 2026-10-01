import authService from "../services/authService.js";

const authController = {
  async register(req,res) {
    try { res.status(201).json({success:true,data:{user:await authService.register(req.body)}}); }
    catch(error) { res.status(400).json({success:false,message:error.message}); }
  },
  async login(req,res) {
    try { res.json({success:true,data:await authService.login(req.body)}); }
    catch(error) { res.status(401).json({success:false,message:error.message}); }
  }
};
export default authController;

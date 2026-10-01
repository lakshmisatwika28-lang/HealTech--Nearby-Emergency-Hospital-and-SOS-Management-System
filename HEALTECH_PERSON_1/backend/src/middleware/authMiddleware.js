import jwt from 'jsonwebtoken'
import { ENV } from '../config/env.js'

export const protect = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing' })
  }
  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' })
  }
}

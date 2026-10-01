import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { ENV } from '../config/env.js'

const signToken = (user) =>
  jwt.sign({ userId: user._id, name: user.name, phone: user.phone }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN
  })

export const register = async (req, res, next) => {
  try {
    const { name, phone, email, password } = req.body
    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'name, phone and password are required' })
    }
    const existing = await User.findOne({ phone })
    if (existing) return res.status(409).json({ success: false, message: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, phone, email, password: hashed })
    const token = signToken(user)

    res.status(201).json({
      success: true,
      data: { token, user: { userId: user._id, name: user.name, phone: user.phone } }
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body
    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'phone and password are required' })
    }
    const user = await User.findOne({ phone })
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const token = signToken(user)
    res.json({
      success: true,
      data: { token, user: { userId: user._id, name: user.name, phone: user.phone } }
    })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

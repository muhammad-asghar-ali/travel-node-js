import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../models/user.model.js'
import createError from '../error.js'

export const signUpUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return next(createError(400, 'name or email or password is missing'))
    }
    
    const alreadyExist = await UserModel.findOne({ email })
    if (!alreadyExist) {
      return next(createError(409, 'user already registered'))
    }

    const user = await UserModel.create({
      username,
      email,
      password
    })
    const token = createJwtToken({ userId: user._id })
    res.status(201).json({
      success: true,
      token: token
    })
  } catch (err) {
    let errorMessage = err
    // check  mongoonse validation error
    if (err) {
      errorMessage = errorHandler(err)
    }
    res.status(500).json({ error: errorMessage.message ? errorMessage.message : 'Internal server error' })
  }
}

export const signInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(createError(400, 'name or email or password is missing'))
    }

    const user = await UserModel.findOne({ email })
    if (!user) {
      return next(createError(400, 'user not register'))
    }
    const isCorrectPasswrod = bcrypt.compare(password, user.password)
    if (!isCorrectPasswrod) {
      return next(createError(400, 'name or email or password is wrong'))
    }
    const token = createJwtToken({ userId: user._id })
    res.status(200).json({
      success: true,
      token: token
    })
  } catch (err) {
    let errorMessage = err
    // check  mongoonse validation error
    if (err) {
      errorMessage = errorHandler(err)
    }
    res.status(500).json({ error: errorMessage.message ? errorMessage.message : 'Internal server error' })
  }
}

const errorHandler = (err) => {
  const errorMessage = {}
  if (err.code === 11000) {
    errorMessage.message = 'Email is already exist'
    errorMessage.statusCode = 409
    return errorMessage
  }
  if (err.message.includes('provider validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      if (errorMessage.message) {
        errorMessage.message += ',' + properties.message
      } else {
        errorMessage.message += properties.message
      }
      errorMessage.statusCode = 400
    })
    return errorMessage
  }
}

const createJwtToken = id => {
  const maxAge = 1 * 24 * 60 * 60
  return jwt.sign(id, process.env.JWT, {
    expiresIn: maxAge
  })
}

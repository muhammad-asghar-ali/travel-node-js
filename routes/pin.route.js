import express from "express"
import { createPin, deletePin, getAllPinById, getAllPins, updatePin } from "../controllers/pin.controller"
import auth from '../middlesware/auth.js'
const router = express.Router()

router.post('/', auth, createPin)
router.get('/', auth, getAllPins)
router.get('/:id', auth, getAllPinById)
router.put('/:id', auth, updatePin)
router.delete('/:id', auth, deletePin)


export default router
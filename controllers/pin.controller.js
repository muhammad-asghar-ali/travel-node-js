import PinModel from '../models/pin.model.js'
import createError from '../error.js'

export const createPin = async (req, res, next) => {
    try {
        const { title, desc, rating, lat, long } = req.body
        const { username } = req.user
        if (!title || !desc || !rating || !lat || !long) {
            return next(createError(400, "missing pin requried values"))
        }

        const pinModel = {
            username: username,
            title,
            desc,
            rating,
            lat,
            long
        }

        const pin = await PinModel.create(pinModel)

        res.status(201).json({
            success: true,
            data: pin
        })
    } catch (err) {
        next(err)
    }
}

export const getAllPins = async (req, res, next) => {
    try {
        const pins = await PinModel.find({}).lean()

        if (!pins.length) {
            return next(createError(404, "no pins created"))
        }
        res.status(201).json({
            success: true,
            data: pins
        })
    } catch (err) {
        next(err)
    }
}

export const getAllPinById = async (req, res, next) => {
    try {
        const { id } = req.params

        if (!id) {
            return next(createError(400, "pin id is missing"))
        }
        const pin = await PinModel.findById(id)

        if (!pin) {
            return next(createError(404, "no pin found"))
        }
        res.status(201).json({
            success: true,
            data: pin
        })
    } catch (err) {
        next(err)
    }
}

export const deletePin = async (req, res, next) => {
    try {
        const { id } = req.params

        if (!id) {
            return next(createError(400, "pin id is missing"))
        }
        const pin = await PinModel.findByIdAndDelete(id)

        if (!pin) {
            return next(createError(404, "no pin found to delete"))
        }
        res.status(201).json({
            success: true,
            data: {}
        })
    } catch (err) {
        next(err)
    }
}

export const updatePin = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = req.body
        
        if (!id) {
            return next(createError(400, "pin id is missing"))
        }

        const pin = await PinModel.findByIdAndUpdate(id, data, {
            new: true
        })

        if (!pin) {
            return next(createError(404, "no pin found to delete"))
        }
        res.status(201).json({
            success: true,
            data: pin
        })
    } catch (err) {
        next(err)
    }
}
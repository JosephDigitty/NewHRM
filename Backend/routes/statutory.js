import express from 'express'
import { getAllITFList, getAllNSITFList, getAllPAYEList, getAllPensionList, getITFByPeriod, getNSITFByPeriod, getPAYEByPeriod, getPensionByPeriod } from '../Controllers/StatutoryController.js'
const router = express.Router()


router.get('/pension/all', getAllPensionList)
router.get('/payee/all', getAllPAYEList)
router.get('/itf/all', getAllITFList)
router.get('/nsitf/all', getAllNSITFList)
router.post('/pension/period', getPensionByPeriod)
router.post('/payee/period', getPAYEByPeriod)
router.post('/itf/period', getITFByPeriod)
router.post('/nsitf/period', getNSITFByPeriod)

export default router
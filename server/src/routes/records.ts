import { Router } from 'express'
import {
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  getStats,
  searchRecords,
} from '../controllers/records.js'

const router = Router()

router.get('/stats', getStats)
router.get('/search', searchRecords)
router.get('/', listRecords)
router.get('/:id', getRecord)
router.post('/', createRecord)
router.put('/:id', updateRecord)
router.delete('/:id', deleteRecord)

export default router

import { Router } from 'express';
import { listServices } from '../controllers/searchController.js';
const router = Router();
router.get('/', listServices);
export default router;


import { Router } from 'express';
import { search, suggestions } from '../controllers/searchController.js';
const router = Router();
router.get('/suggestions', suggestions);
router.post('/', search);
export default router;

import { Router } from 'express';
import { getMasterAdvice, getRecoveryAdvice, getCalendar } from '../controllers/ai.controller.js';

const router = Router();

router.post('/master', getMasterAdvice);
router.post('/recovery', getRecoveryAdvice);
router.post('/calendar', getCalendar);

export default router;

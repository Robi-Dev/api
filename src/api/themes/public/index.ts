import express from 'express';
import { getAllPublicThemesHandler } from '../../../controller/theme.controller';

const router = express.Router();

// get all theme public
router.get('/:type', getAllPublicThemesHandler);

export default router;
import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import themes from './themes/public';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/themes/public', themes);

export default router;

import express from 'express'

const router = express.Router()

type EmojiResponse = string[];

router.get<{}, EmojiResponse>('/:slug', (req, res) => {
   res.json(['😀', '😳', '🙄'])
})

export default router
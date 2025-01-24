const express = require('express');

const router = express.Router();

router.use(express.json());

router.get('/', async (req, res) => {
    try {
        res.send('User route called');
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

router.post('/login', async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: req.body,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.toString(),
        });
    }
});

module.exports = router;
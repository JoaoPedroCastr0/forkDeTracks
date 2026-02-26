import express from "express"

export const router = express.Router();

router.get('/Health', (req, res) =>{
	res.status(200).json({
		status:"ok"
	})
} )
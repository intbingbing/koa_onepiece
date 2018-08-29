const jwt = require('jsonwebtoken')
const TOKEN_SECRET = '^&*#$%()@'

function generateToken(userid) {
	let time = Date.now()
	let token = jwt.sign({
		userid,
		time
	  }, TOKEN_SECRET, {
		expiresIn: '30d'
	})
	return token
}

module.exports = { TOKEN_SECRET, generateToken }
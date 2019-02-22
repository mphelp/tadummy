const express = require('express')
const app = express()
const port = process.env.PORT || 8080

app.get('/', (req, res) => {
	res.send('Hello there welcome to TAdummy - Ed, Matt, and Patrick!')
})
app.listen(port, () => console.log(`server running on port ${port}`))

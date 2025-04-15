const path = require('path')
const express = require('express')

const app = express()
const PORT = 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('', (req, res) => {
    res.render('index')
})

app.get('/admin', (req, res) => {
    res.render('admin')
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
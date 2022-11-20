const express = require("express")
const crypto = require("crypto")

let app = express()
app.use(express.json())

let port = 3000
let users = [
    {
        username: 'okboomer',
        role: 'admin',
    },
    {
        username: 'foo',
        role: 'user'
    },
    {
        username: 'bar',
        role: 'user'
    }
]

function mergeObjs(target, source) {
    for (const attr in source) {
        if (
            typeof target[attr] === "object" &&
            typeof source[attr] === "object"
        ) {
            mergeObjs(target[attr], source[attr])
        } else {
            target[attr] = source[attr]
        }
    }
}


app.get('/users', (req, res) => {
    return res.status(200).json(users)
})

app.get('/user/:id', (req, res) => {
    if(req.params.id > (users.length)) {
        return res.status(422).send()
    }
    
    const user = users[Math.max(0, req.params.id-1)]
    
    return res.status(200).json(user)
})

app.put('/user', (req, res) => {    
    const userIdx = req.headers.id-1
    let user = users[userIdx]
     
    if(Object.keys(req.body).includes('role') && user.role !== 'admin') {
        return res.status(403).send()
    }

    mergeObjs(users[userIdx], req.body)        
    //users[userIdx] = {...users[userIdx], ...req.body}
    
    return res.status(200).json(users[userIdx])
})

app.post('/create-token', (req, res) => {
    const user = users[Math.max(0, req.headers.id-1)]
    if(user.role !== 'admin') {
        return res.status(403).send()
    }

    const currentDate = (new Date()).valueOf().toString();
    const random = Math.random().toString();
    const token = crypto.createHash('sha1').update(currentDate + random).digest('hex');

    return res.status(200).json({ token })
})


app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
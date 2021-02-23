const express = require('express')
const router = express.Router()
const { requireToken } = require('../middleware/auth')
const User = require('../models/User')
const Planet = require('../models/Planet')
const Moon = require('../models/Moon')
const Comment = require('../models/Comment')

// Display a planet's comments. Use below URL for Mercury:
// http://localhost:8000/comments/display/6033f85cf487a44600fe84b2 
router.get('/display/:planetId', (req, res) => {
    console.log('🔥', req.user)
    let planet = Planet.find({ id: req.params.planetId })
    let comments = planet.comments
    console.log("🪐 Here is the planet that we found for you ", planet)
    console.log("🪐 Here are that planet's comments ", comments)
    return res.json({ comments })
    // return res.json({ "message":  "We've hit the /comments/display/:planetId page!" })
})

// Add a new comment to /comments/add/planet:id. Below URL is for Mercury:
// http://localhost:8000/comments/add/6033f85cf487a44600fe84b2 
router.post('/add/:planetId',requireToken, (req, res) => {
    // const comment = new Comment({
    //     planet: req.params.planetId,
    //     user: 'Trisha', // TO-DO: UPDATE TO BE USER ID OF USER.
    //     content: req.body.content,
    //     archived: false // TO-DO: ADD LOGIC THAT DETERMINES WHETHER THIS COMMENT IS ARCHIVED OR NOT.
    // })
    console.log('🔥', req.params.planetId)
    Planet.findById(req.params.planetId)
    .then(foundPlanet=>{
        foundPlanet.comments.push({
            user:req.user.id,
            planet:req.params.planetId,
            content:req.body.message
        })
        foundPlanet.save()
        console.log(foundPlanet)
    })

    // We use req.params.id to know which planet this comment belongs to.
    // We create a comment using req.body.title, req.body.content, etc.
    // return res.redirect(`/planets.display/${req.params.planetId}`, comments={newComments})
    // return res.json({ "message":  "We've hit the /comments/add/:planetId page!" })
})

// Edit comment but only if you're the author.
// We need comment id and planet id
router.put('/edit/:planetId/:commentId', requireToken, (req, res) => {
    // Find comment by ID. 
    // Verify that email matches logged in user's email.
//     Planet.find({'comments.id':req.params.commentId})
//     .then(planet=>{
//         let arr=planet.map(plan=>{
//             return  {
//                 name:plan.name,
//                 comments:plan.comments
//             }
//         })
//         // console.log('🤞')
//         // console.log(arr)
//         return res.json( {arr})
// })
    Planet.findByIdAndUpdate(req.params.planetId)
    .then(planet=>{
        let test= planet.comments.id(req.params.commentId)
        console.log("💕")
         console.log(test)
         test['content']=req.body.message
         //test.save()
         planet.save()
    
        // .then(comment=>{
        //     console.log("💕")
        //     console.log(comment)
        // })
        
        // planet.comments.forEach(comment=>{
        //     console.log("💕")
        //     console.log(comment.id)
        //     if(comment.id==req.params.commentId){
        //         comment.content=req.body.message
        //     }
        // })
        //planet.save()
        return res.json( {message:"true"})
})
.catch(err=>{
    console.log(err)
    return res.json({message:'false'})
})
   // return res.json({ "message":  "We've hit the /planets/display/:id page!" })
})

// Delete comment but only if you're the author.
// DELETE to http://localhost:8000/comments/delete/:id
// In Postman, put your token in Headers: key='Authorization', value=`Bearer ${token}`
router.delete('/delete/:id', requireToken, (req, res) => {
    // Find comment by ID
    // Verify that user email matches logged in user email
    return res.json({ "message": "We've hit the delete a comment route."})
}) 

module.exports = router
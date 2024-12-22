import express from express
import db from "./db";

const router = express.Router()

//* Get data from events page 
router.get('ticket/events/:id',async(req,res)=> {
const {id} = req.params;
try {
         const event = await db.Event.findById(id)
         if(!event){
           return res.status(404).send("Event not found")
         }
         res.status(200).json(event)
} catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).send('Error fetching event')
}

})
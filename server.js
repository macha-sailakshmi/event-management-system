const express = require('express');
const dotenv = require('dotenv');
const db=require('./db/db');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static('public'));


// const events=[
//     {id:1, title: 'Tech Conference 2026',location: 'Delhi', date:'2026-07-15'},
//     {id:2, title: 'Music Festival',location: 'Hyderabad', date:'2026-08-20'

//     }
// ]


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.get('/api/events/:id',(req,res)=>{
    const eventId=parseInt(req.params.id);
    const event =events.find(e=>e.id==eventId);
    if(event){
    res.json(event);
    }
    else{
        res.status(404).send('event not found!');
    }
});



app.get('/api/db_events',async(req,res)=>{
    try{
        const[rows]=await db.query(`
            select
                e.event_id,
                e.event_name,
                o.organizer_name,
                s.event_date,
                s.start_time,
                s.end_time,
                count(ep.participant_id) as participant_count
            from events e
            join organizers o on e.organizer_id=o.organizer_id
            left join schedule s on e.event_id = s.event_id
            left join event_participation ep on e.event_id = ep.event_id
            group by e.event_id, e.event_name, o.organizer_name, s.event_date, s.start_time, s.end_time
            order by e.event_id
            `);
            res.json(rows);
    }
    catch(err){
        console.error("DEBUG ERROR:", err);
        res.status(500).json({error:err.message});
    }
    

});

    app.get('/api/db_participants', async (req, res) => {
        try {
            const [rows] = await db.query("SELECT * FROM participants");
            res.json(rows);
        } catch (err) {
            console.error("DEBUG ERROR:", err);
            res.status(500).json({ error: err.message });
        }
    });

app.get('/api/registrations', async (req, res) => {
    try {
        const [rows] = await db.query(`
            select
                ep.event_id,
                ep.participant_id,
                e.event_name,
                p.participant_name,
                o.organizer_name
            from event_participation ep
            join events e on ep.event_id = e.event_id
            join participants p on ep.participant_id = p.participant_id
            join organizers o on e.organizer_id = o.organizer_id
            order by e.event_id, p.participant_id
        `);
        res.json(rows);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/registrations', async (req, res) => {
    const { eventId, participantId } = req.body;

    if (!eventId || !participantId) {
        return res.status(400).json({ error: "Please select both event and participant!" });
    }

    try {
        await db.query(
            "INSERT INTO event_participation (event_id, participant_id) VALUES (?, ?)",
            [eventId, participantId]
        );

        res.status(201).json({ message: "Participant registered for event successfully!" });
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/registrations/:eventId/:participantId', async (req, res) => {
    const { eventId, participantId } = req.params;

    try {
        const [result] = await db.query(
            "DELETE FROM event_participation WHERE event_id = ? AND participant_id = ?",
            [eventId, participantId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Registration not found!" });
        }

        res.json({ message: "Registration removed successfully!" });
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/participants', async (req, res) => {

    const { id, name } = req.body; 


    if (!id || !name) {
        return res.status(400).json({ error: "Please provide both ID and Name!" });
    }

    try {
        
        const [result] = await db.query(
            "INSERT INTO participants (participant_id, participant_name) VALUES (?, ?)", 
            [id, name]
        );
        
        res.status(201).json({ 
            message: "Participant added successfully!",
            participantId: id 
        });
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ error: err.message });
    }
    });


app.put('/api/participants/:id', async(req,res)=>{
    const{id}=req.params;
    const{name}=req.body;

    if(!name){
        return res.status(400).json({ error: "please provide a name !"});

    }
    try{
        const[result]=await db.query(
            "update participants set participant_name =?  where participant_id=?",
            [name,id]
        );

        if(result.affectedRows==0){
            return res.status(404).json({ errror: "participant not found!"});
        }
        res.json({message:"participant updated sucessfully!"});
    }
    catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ error: err.message });
    }
    });
app.delete('/api/participants/:id', async(req,res)=>{
    const{id}=req.params;


    
    try{
        const[result]=await db.query(
            "delete from  participants  where participant_id=?",
            [id]
        );

        if(result.affectedRows==0){
            return res.status(404).json({ errror: "participant not found!"});
        }
        res.json({message:"participant deleted sucessfully!"});
    }
    catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ error: err.message });
    }
    });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});

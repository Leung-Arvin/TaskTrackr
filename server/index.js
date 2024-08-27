require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");

const supabase = require("./supabase");

const bcrypt = require("bcrypt");


const jwt = require("jsonwebtoken");



//serving react files via express
app.use('/', express.static('../client/dist'))

// middleware
app.use(cors());
app.use(express.json());

function authenticateToken(req,res,next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if(token == null) return res.sendStatus(401)

  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })

}

//routes//

app.post("/api/users", async (req,res) => {
  try {
    const salt = await bcrypt.genSalt()
    
    
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    
    const user = {username: req.body.username, password: hashedPassword};
    const {data, error} = await supabase.from('users').insert([
      {
        username: user.username,
        password: user.password,
      }
    ]).select()

    const accessToken = jwt.sign(data[0],process.env.ACCESS_TOKEN_SECRET)
    // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    // refreshTokens.push(refreshToken)
    res.json({accessToken:accessToken})

  } catch (err) {
    console.error(err.message);
  }
});

// login a user
app.post("/api/login", async (req,res) => {
  
  const {data, error} = await supabase.from('users').select().eq('username', req.body.username)
    
  console.log(data);
  if ( data.length === 0 || error) {
    res.sendStatus(400);
  }

    try {
      
      if(await bcrypt.compare(req.body.password, data[0].password)) {
        const accessToken = jwt.sign(data[0],process.env.ACCESS_TOKEN_SECRET)
        
        res.json({accessToken:accessToken})
       
      } else {
        res.send("Not allowed")
      }
    } catch (err) {
      res.status(500).send(err.message)
    }
})

//get a user's info with username
app.get("/api/users/:username", authenticateToken, async (req, res) => {
  try {
    const {username} = req.params;

    const {data, error} = await supabase.from('users').select().eq('username', username)
    
    res.json(data[0]);
  } catch (err) {
    console.error(err.message);
  }
})

//get a user's info with userId
app.get("/api/users/id/:userId", authenticateToken ,async (req, res) => {
  try {
    const {userId} = req.params;

    
    if (req.user.id !== parseInt(userId)) {
      return res.sendStatus(403);
    }

    const {data,error} = await supabase.from('users').select().eq('id', userId);
    res.json(data[0]);
  } catch (err) {
    console.error(err.message);
  }
})


// TODO: create api routes for Board and Task Table

//BOARD ROUTES//

// create a user's board
app.post("/api/board/:id", authenticateToken , async (req,res) => {
  try {
    const {id} = req.params;

    if (req.user.id !== parseInt(id)) {
      return res.sendStatus(403);
    }

    const {boardTitle} = req.body;

    const {data, error} = await supabase.from('Boards').insert([{
      user_id: id,
      board_title: boardTitle
    }]).select()

    res.status(201).json(data[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
})


// get all user's specific board information (for dashboard)
app.get("/api/board/all/:user_id", authenticateToken ,async (req,res) => {
  try {
    const {user_id} = req.params;

    if (req.user.id !== parseInt(user_id)) {
      return res.sendStatus(403);
    }

    const {data, error} = await supabase.from('Boards').select().eq('user_id',user_id);
    
    res.status(201).json(data);
  } catch (err){
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
  
}) 

// get a user's specific board information (board page)
app.get("/api/:user_id/board/:board_id", authenticateToken ,async (req,res) => {
  try {
    const {user_id, board_id} = req.params;

    if (req.user.id !== parseInt(user_id)) {
      return res.sendStatus(403);
    }

    const {data,error} = await supabase.from('Boards').select().eq('id', board_id)


    res.status(201).json(data[0]);
  } catch {
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
}) 

//get all user's favorited boards (favorites tab)
app.get("/api/board/favorites/:user_id", authenticateToken , async (req,res) => {
  try {
    const {user_id} = req.params;

    if (req.user.user_id !== parseInt(user_id)) {
      return res.sendStatus(403);
    }

    const {data, error} = await supabase.from('Boards').select().eq('favorite', true)


    res.status(201).json(data);
  } catch {
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
  
}) 

//update board title
app.post("/api/:userId/board/updateTitle/:board_id", authenticateToken , async (req,res) => {
  try {
    const {userId, board_id} = req.params;
    const {boardTitle} = req.body;
    

    if (req.user.id !== parseInt(userId)) {
      return res.sendStatus(403);
    }
    
    const {data,error} = await supabase.from('Boards').update({board_title:boardTitle}).eq('id', board_id).select()
    
    res.status(201).json("board title has been updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
})


//toggle board favorite 
app.post("/api/:userId/board/updateFavorite/:board_id", authenticateToken , async (req,res) => {
  try {
    const {userId, board_id} = req.params;

    if (req.user.id !== parseInt(userId)) {
      return res.sendStatus(403);
    }

    const {favorite} = req.body;
    const {data, error} = await supabase.from('Boards').update({favorite: favorite}).eq('id', board_id).select()


    res.status(201).json("board favorite has been updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
})


//delete a board
app.delete("/api/:userId/board/delete/:board_id", authenticateToken , async (req,res) => {
  try {
    const {userId, board_id} = req.params;

    if (req.user.id !== parseInt(userId)) {
      return res.sendStatus(403);
    }

   const {error} = await supabase.from('Boards').delete().eq('id',board_id)

    res.status(201).json("board has been deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
})

// create a task
app.post("/api/:userId/createtask/:board_id", authenticateToken , async (req,res) => {
  try {
    const {userId, board_id} = req.params;

    if (req.user.id !== parseInt(userId)) {
      return res.sendStatus(403);
    }

    const task = {
      title: req.body.title, 
      description: req.body.description,
      status: req.body.status
    };

    const {data,error} = await supabase.from('Tasks').insert([{
      title: task.title,
      description: task.description,
      status: task.status,
      board_id: board_id
    }]).select()

    res.status(201).json(data[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
})

// get all tasks
app.get("/api/:userId/task/getall/:board_id", authenticateToken , async (req,res) => {
  try {
    const {userId, board_id} = req.params;

    if (req.user.id !== parseInt(userId)) {
      return res.sendStatus(403);
    }
    
    const {data, error} = await supabase.from('Tasks').select().eq('board_id', board_id)
    
    res.status(201).json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
})


// update task title
app.post("/api/:userId/task/updatetitle/:task_id", authenticateToken , async (req,res) => {
  try {
    const {userId, task_id} = req.params;

    if (req.user.id !== parseInt(userId)) {
      return res.sendStatus(403);
    }

    const {title} = req.body;

    const {data, error} = await supabase.from('Tasks').update({
      title: title
    }).eq('id', task_id)

    res.status(201).json("Updated task title");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
})

// update task description
app.post("/api/:userId/task/updatedescript/:task_id", authenticateToken ,async (req,res) => {
  try {
    const {userId, task_id} = req.params;
    
    if (req.user.id !== parseInt(userId)) {
      return res.sendStatus(403);
    }
    
    const {description} = req.body;

    const {data, error} = await supabase.from('Tasks').update({
      description: description
    }).eq('id', task_id)

    res.status(201).json("Updated task description");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
})

// update task status
app.post("/api/:userId/task/updatestatus/:task_id", authenticateToken , async (req,res) => {
  try {
    const {userId, task_id} = req.params;

    if (req.user.id !== parseInt(userId)) {
      return res.sendStatus(403);
    }
    const {status} = req.body;

    const {data, error} = await supabase.from('Tasks').update({
      status: status
    }).eq('id', task_id)

    res.status(201).json("Updated task status");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
})

// delete a task
app.delete("/api/:userId/task/delete/:task_id", authenticateToken , async (req,res) => {
  try {
    const {userId, task_id} = req.params;

    if (req.user.id !== parseInt(userId)) {
      return res.sendStatus(403);
    }
    
    const {data, error} = await supabase.from('Tasks').delete().eq('id', task_id)

    res.status(201).json("task deleted");
  } catch (err) {
    
    console.error(err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
})

app.listen(5000, () => {
  console.log("server has started on port 5000");
})
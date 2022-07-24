const express = require("express");
const app = express();
const fs = require("fs");
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var validator = require('validator');
const http = require('http').Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET"]
  }
});

var path = require('path');
var public = path.join(__dirname, 'public');

// var connection = mysql.createConnection({
//   host     : '13.235.3.77',
//   user     : 'connect_user',
//   password : 'password',
//   database : 'streamer',
//   port: 51643
// });
 

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'connect_user',
  password : 'password',
  database : 'streamer',
  port: 3306
});
 
connection.connect();

app.use('/image', express.static(path.join(__dirname, '../../video-project/album/')))


console.log(path.join(__dirname, '../../video-project/video/'))





app.use(express.json());




app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({error: true, token: '', message: 'global'});
  }
});



app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Pragma, cache-control, upgrade-insecure-requests"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST"
      );
      next();
    });
    

app.get('/album', function(req, res) {
    res.sendFile(path.join(public, 'index.html'));
});
    
    
isAuthStream = async (req, res, next) => {
let decoded = ''

try {
  decoded = jwt.verify(req.query['token'], 'secret');
  /*
  let stat = await queryFetch(`select * from users where email='${decoded.data.email}'`).then(a => a[0] == undefined).catch(() => true)
  if(stat) {
  throw new Error('intruder detected!')
  }
  */
    stat = await queryFetch(`select email, premium from (select us.email, premium, name, token from users as u cross join user_sessions as us where u.email = us.email)as m where email = '${decoded.data.email}' and m.token = '${req.query['token']}';`).then(a => {
   req.premium = a[0].premium;
  return a[0] == undefined
  
  }).catch(() => true)
  if(stat) {
  throw new Error('intruder detected!')
  }
  
} catch(err) {
  console.log(err.message)
  await queryFetch(`delete from user_sessions where token= '${req.query['token']}';`).catch(err => err)
  return res.status(401).json({error: true, token: '', premium: false});
}


next();
}
    
    
    
isAuth = async (req, res, next) => {
let decoded = ''

try {
  decoded = jwt.verify(req.body['token'], 'secret');
  req.decoded = decoded;
  /*
  let stat = await queryFetch(`select * from users where email='${decoded.data.email}'`).then(a => a[0] == undefined).catch(() => true)
  if(stat) {
   throw new Error('intruder detected!')
  }
  */
  //stat = await queryFetch(`select * from user_sessions where token='${req.body['token']}'`).then(a => a[0] == undefined).catch(() => true)
    stat = await queryFetch(`select email, premium from (select us.email, premium, name, token from users as u cross join user_sessions as us where u.email = us.email)as m where email = '${decoded.data.email}' and m.token = '${req.body['token']}';`).then(a => {
   req.premium = a[0].premium;
  return a[0] == undefined
  
  }).catch(() => true)
  if(stat) {
   throw new Error('intruder detected!')
  }

} catch(err) {
  console.log(err.message)
  await queryFetch(`delete from user_sessions where token= '${req.body['token']}';`).catch(err => err)
  return res.status(401).json({error: true, token: '', premium: false});
}


next();
}




let songsD = []



async function queryFetch(query) {
	return new Promise((res, rej) => {
	connection.query(query, function (error, results, fields) {
	try {
  	if (error) throw error;
  	res(JSON.parse(JSON.stringify(results)));
  	} catch(e) {
  	res(false)
  	}
	});
	})
}


async function songCheck(id, res) {
    	if(isNaN(Number(id))) {
    	res.status(400).json({msg: "We don't have String ids", error: true});
    	return false;
    	}
    	let result = (await queryFetch(`select id from videos where id=${id};`))[0]
    	 if(!result) {
         res.status(404).json({msg: "Not found", error: true});
         return false;
        }
	return result['id'];
}



async function login(res, result) {

if(result) {
let jw = jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: {name: result.name, email: result.email}
}, 'secret');
await queryFetch(`insert into user_sessions values('${result.email}', '${jw}');`)
await new Promise((resolve, rej) => setTimeout(() => resolve('done'), 1000));
res.status(200).json({error: false, token: jw, premium: result.premium});
} else {
res.status(401).json({error: true, token: '', premium: false});
}
}


app.post("/premium", async function (req, res) {
console.log(req.body)
io.emit('premium', JSON.stringify({email: req.body.status.Email, premium: req.body.status.Premium}))
res.status(200).json({error: false, msg: 'success'});
})

app.post("/blockhim", async function (req, res) {
console.log(req.body)
io.emit('blocked', JSON.stringify({email: req.body.email}))
res.status(200).json({error: false, msg: 'success'});
})



app.post("/removesong", async function (req, res) {
console.log(req.body)
io.emit('remove', JSON.stringify({id: req.body.id}))
res.status(200).json({error: false, msg: 'success'});
})



app.get("/email", async function (req, res) {
let stat = await queryFetch(`select * from users where email='${req.query.email}';`).then(a => a[0] == undefined).catch(() => true)
if(!stat) {
res.status(403).json({error: true, token: ''});
} else {
res.status(200).json({error: false, token: ''});
}

})


app.post("/playlist", isAuth, async function (req, res) {
let stat = [];
if(req.premium) {
 stat = await queryFetch(`select premium, title, id, description from (select email, premium, title, p.id, description from playlist as p cross join videos as v where p.id = v.id) as m where email ='${req.decoded.data.email}';`).then(a => a).catch(() => false)
} else {
 stat = await queryFetch(`select premium, title, id, description from (select email, premium, title, p.id, description from playlist as p cross join videos as v where p.id = v.id) as m where email ='${req.decoded.data.email}' and premium = ${req.premium};`).then(a => a).catch(() => false)
}
if(stat) {
res.status(200).json({error: false, songs: stat});
} else {
res.status(200).json({error: true, songs: []});
}

})


app.post("/playlistcheck", isAuth, async function (req, res) {
let stat = await queryFetch(`select * from playlist where email='${req.decoded.data.email}' and id=${req.body.id};`).then(a => a[0] == undefined).catch(() => 'invalid')
if(stat) {
res.status(200).json({error: false, stat: false});
} else {
res.status(200).json({error: false, stat: true});
}

})


app.post("/playlistadd", isAuth, async function (req, res) {
let stat = await queryFetch(`select * from playlist where email='${req.decoded.data.email}' and id=${req.body.id};`).then(a => a[0] == undefined).catch(() => 'invalid')
if(stat) {
await queryFetch(`insert into playlist values('${req.decoded.data.email}', ${req.body.id});`).then(a => a[0] == undefined).catch(() => 'invalid')
res.status(200).json({error: false, stat: true});
} else {
await queryFetch(`delete from playlist where email='${req.decoded.data.email}' and id=${req.body.id};`).then(a => a[0] == undefined).catch(() => 'invalid')
res.status(200).json({error: false, stat: false});
}

})




app.post("/register", async function (req, res) {
if(req.body['email'] && req.body['password'] && req.body['fullname']) {
if(validator.isEmail(req.body['email']) && req.body['password'].length >= 6 && !validator.isEmpty(req.body['fullname'])) {
let stat = await queryFetch(`insert into users values(${new Date().getTime()}, '${req.body['fullname']}', '${req.body.email.toLowerCase()}', '${btoa(req.body.password)}', false);`)
if(stat) {
let result = {name: req.body['fullname'], email: req.body.email.toLowerCase(), premium: false};
await login(res, result)
} else {
res.status(403).json({error: true, token: '', premium: false});
}
} else {
res.status(400).json({error: true, token: '', premium: false});
}
} else {
res.status(400).json({error: true, token: '', premium: false});
}
})



app.post("/login", async function (req, res) {

if(req.body['email'] && req.body['password']) {
let result = (await queryFetch(`select name, email, premium from users where email='${req.body.email.toLowerCase()}' and password='${btoa(req.body.password)}';`))[0]
await login(res, result)
} else {
res.status(401).json({error: true, token: '', premium: false});
}
})





app.post("/songrand", isAuth, async function (req, res) {
console.log(req.premium)
if(req.premium) {
songsD  = await queryFetch(`select id,title, premium from videos;`).then(a => a==undefined? [] : a)
} else {
songsD  = await queryFetch(`select id,title, premium from videos where premium = '${req.premium}';`).then(a => a==undefined? [] : a)
}

ranSongs = []
let slen = 0;
console.log(req.query.slen)
if(req.query.slen == 0) {
slen = songsD.length < 9 ? songsD.length : Number(req.query.slen)+9
for(let i=0; i<slen; i++) {
ranSongs.push(songsD[i]);
}
} else {
slen = Number(req.query.slen)+4
slen = slen > songsD.length ? songsD.length : slen
if(req.query.slen < songsD.length) {
for(let i=req.query.slen; i< slen; i++) {
ranSongs.push(songsD[i]);
}

}

}
ranSongs = ranSongs.sort(() => Math.random() - 0.5);
res.status(200).json({error: false, songs: ranSongs});

})




app.post("/check",isAuth, async function (req, res) {
let fetch = '';
if(!await songCheck(req.query.w, res)){
return;
}
res.status(200).json({error: false});

})



app.post("/songs", isAuth, async function (req, res) {
let fetch = []
if(req.premium) {
fetch  = await queryFetch(`select id,title, premium, description from videos order by RAND() limit 5;`).then(a => a==undefined? [] : a)
} else {
fetch  = await queryFetch(`select id,title, premium, description from videos where premium = '${req.premium}' order by RAND() limit 5;`).then(a => a==undefined? [] : a)
}
let temp = await queryFetch(`select id,title, premium, description from videos where id = ${req.body.w};`).then(a => a[0]==undefined? [] : a[0])
fetch = fetch.sort(() => Math.random() - 0.5);
fetch.push(temp)


fetch = fetch.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)

res.status(200).json({songs: fetch})

})




app.post("/search", isAuth, async function (req, res) {
req.body.search = req.body.search == '' ? 'n*tF@un#' : req.body.search
let fetch = []
if(req.premium) {
fetch  = await queryFetch(`select id,title from videos where title like '${req.body.search}%' limit 4;`).then(a => a==undefined? [] : a)
} else {
fetch  = await queryFetch(`select id,title from videos where title like '${req.body.search}%' and premium = '${req.premium}' limit 4;`).then(a => a==undefined? [] : a)
}
res.status(200).json({songs: fetch, error: false})

})


app.get("/stream", isAuthStream, async function (req, res) {
try {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    } else if(req.query.w) {
	if(!await songCheck(req.query.w, res)) {
	return;
	}
    	const videoName = await songCheck(req.query.w, res)
        const videoPath = `${path.join(__dirname, '../../video-project/video/')}${videoName}`;

    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 9;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
     } else {
    
res.status(400).send("Bad Request");
     }
     
     } catch(e) {
     res.status(400).send("Bad Request");
     
     }

});

http.listen(5000, function () {
    console.log("Listening on port 8000!");
});

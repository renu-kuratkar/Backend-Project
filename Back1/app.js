const express = require("express"); 
const bodyParser = require("body-parser"); 


const cors = require('cors'); // Import the cors package

const app = express(); 
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ 
// 	extended: true
// })); 
app.use(cors());
app.use(express.static("public")); 

// Connecting gfg-students database to our express application 

// mongoose.connect( 
// "mongodb://localhost:27017/gfg-studentss", 
// { useNewUrlParser: true } 
// ); 

// Writing schema for students-data collection 
const studentsSchema = { 
	name: String, 
	marks: Number, 
	rollno: Number 
}; 



var data=[

    {
	id:1,
	name: "Ridhima", 
	marks:98.34 , 
	rollno: 10 },
    {
	id:2,
	name: "Ankita", 
	marks: 78.67, 
	rollno: 11 },
    {
	id:3,	
	name: "Pranav", 
	marks: 89.08, 
	rollno: 12 },
    {
	id:4,
	name: "Krutika", 
	marks: 75.34, 
	rollno: 13 }

]

// Fetching all the students
app.get("/students", (req, res) => { 
    res.send(data) ;
	
}) 

// Posting a new students
app.post("/students", (req, res) => { 
	console.log("Hi.....");
	console.log(req.body);
	const newstudent = { 
		rollno: req.body.rollno,
		name: req.body.name, 
		marks: req.body.marks, 
		
	}; 
	// assign id to this object
	newstudent.id=data[data.length-1].id+1;
	data.push(newstudent);
	res.send(data) ;
	
}) 

// Fetching a specific students
app.get("/students/:name", function(req, res) { 

	var filtered_data=data.filter((e, index)=>e.name==req.params.name);
	console.log(filtered_data.length);
	res.send(filtered_data) ;
}	
)

// Replacing a specific students
app.put("/students/:id", (req, res) => { 
let id=req.params.id;
const modifiedstudent = { 
	rollno: req.body.rollno,
	name: req.body.name, 
	marks: req.body.marks, 
	id:id
}; 
for (let i = 0; i < data.length; i++) {
	if(data[i].id==id)
		{
			data[i]=modifiedstudent;
			break;
		}
	
}//for
res.send(data) ;

	
}) 

// Updating an 

// Updating an 
app.patch("/students/:students_name", function(req, res) { 

	StudentsData.update({ name: req.params.name }, 
	{ $set: req.body }, 
		function(err) { 
			if (!err) { 
				res.send("Successfully updated students's salary."); 
			} else { 
				res.send(err); 
			} 
		} 
	); 
}) 

// Deleting single   student
app.delete("/students/:id", function(req, res) { 

	var filtered_data=data.filter((e, index)=>e.id!=req.params.id);
	console.log(filtered_data.length);
	// res.send(filtered_data) ;

	data=filtered_data;
		res.send(data) ;
	
}); 


app.listen(3000, function() { 
	console.log("Server started on port 3000"); 
});

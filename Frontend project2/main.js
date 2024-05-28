import interactWithServer from "./server.js";
var ele_table = document.getElementById("table-student");
var ele_heading = document.getElementById("heading");crudCreate
var ele_div_content = document.getElementById("div-content");
var ele_btn_add = document.getElementById("btn-add");
var ele_btn_cancel = document.getElementById("btn-cancel");
var ele_div_add = document.getElementById("div-add");
var ele_message = document.getElementById("message");
var ele_actionmessage = document.getElementById("action-message");
var ele_rollno = document.getElementById("rollno");
var ele_name = document.getElementById("name");
var ele_marks = document.getElementById("marks");
var columnNames = ["rollno", "name", "marks"];
var data, filtered_data;
var state = "view"; // "add" "edit"
var selectedId;

console.log("app load");
crudRead();
// Ajax request - GET
function crudRead() {
interactWithServer("get", "http://localhost:3000/students", {}, (d,
err) => {
if (err) {
//error
 } else {
//success
data = JSON.parse(d);
filtered_data = data;
showTable(filtered_data);
 }
 });
}
// Ajax request - POST
function crudCreate(s) {
// var s = { rollno: 9, name: "Sanjay", marks: 58.9 };
console.log("posting..."+s);
let student
interactWithServer("post", "http://localhost:3000/students", s, (d,
err) => {
if (err) {
showActionMessage("Error...Add operation failed!");
 } else {
// success
showActionMessage("Add operation successful!");
crudRead();
 } //else
 });
}
// Ajax request - PUT
function crudUpdate(s, id) {
// var s = { rollno: -1, name: "Unknown", marks: 0.0 };
// var id=1;
interactWithServer(
"put",
"http://localhost:3000/students/" + id,
s,
 (d, err) => {
if (err) {
showActionMessage("Error...Edit operation failed!");
 } else {
// success
showActionMessage("Edit operation successful!");
crudRead();
 } //else
 }
 );
}
// Ajax request - DELETE
function crudDelete(id) {
// var s = { rollno: -1, name: "Unknown", marks: 0.0 }; //post/put
// var id=1;
interactWithServer(
"delete",
// "http://localhost:3000/students/",
"http://localhost:3000/students/" + id,
 {},
 (d, err) => {
if (err) {
//error
 } else {
// success
crudRead();
 } //else
 }
 );
}
// handle click event of "add a student" button
document.getElementById("btn-add-student").addEventListener("click",
() => {
// crudCreate();
state = "add";
ele_btn_add.disabled = true;
ele_btn_add.value = "Add";
ele_rollno.value = "";
ele_name.value = "";
ele_marks.value = "";
ele_div_add.classList.toggle("hide"); //form
ele_div_content.classList.toggle("hide"); //table
});
// handle click event of "add/modify" button
ele_btn_add.addEventListener("click", () => {
var arr = validateInputs();
var [message, obj] = arr;
if (message) {
// form is invalidated
ele_message.innerHTML = message;
window.setTimeout(() => {
ele_message.innerHTML = "";
 }, 2000);
 } else {
// no error, form is validated
if (state == "add") {
crudCreate(obj);
 } else if (state == "edit") {
crudUpdate(obj, selectedId);
 }
ele_div_add.classList.toggle("hide");
ele_div_content.classList.toggle("hide");
 }
});
// Handle click of edit button
function handleEditEvent() {
document.querySelectorAll(".btn-edit").forEach((e) => {
// e is a button
e.addEventListener("click", () => {
state = "edit";
ele_btn_add.value = "Modify";
ele_btn_add.disabled = false;
ele_div_add.classList.toggle("hide");
ele_div_content.classList.toggle("hide");
selectedId = e.id;
// get record having id = selectedId
var obj = getStudentObject(selectedId);
// load data in text components
if (obj) {
ele_rollno.value = obj.rollno;
ele_name.value = obj.name;
ele_marks.value = obj.marks;
 } else {
showActionMessage("Error...");
 }
 });
 });
}
// Handle click of delete button
function handleDeleteEvent() {
document.querySelectorAll(".btn-delete").forEach((e) => {
// e is a button
e.addEventListener("click", () => {
// get record having id = e.id
var obj = getStudentObject(e.id);
var ans = window.confirm("You want to delete data of " +
obj.name);
if (ans) {
// send Ajax put request
crudDelete(e.id);
 } else {
showActionMessage("Delete operation cancelled.");
 }
 });
 });
}
// handle keyup event for all text input fields
document.querySelectorAll(".wrapper_ip input[type='text']").forEach((e) => {
    // Add an event listener for the 'keyup' event
    e.addEventListener("keyup", () => {
        // Enable the button
        ele_btn_add.disabled = false;
    });
})
// get record having id = selectedId
function getStudentObject(selectedId) {
// Get object from the database
console.log("Hello " + selectedId);
for (var i = 0; i < data.length; i++) {
if (data[i].id == selectedId) {
return data[i]; // found record
 } //if
 } //for
return {};
}
// handle click event of "cancel" button
ele_btn_cancel.addEventListener("click", () => {
ele_div_add.classList.toggle("hide");
ele_div_content.classList.toggle("hide");
});
function validateInputs() {
var rollno = ele_rollno.value;
var name = ele_name.value;
var marks = ele_marks.value;
var obj = {};
var message = "";
if (rollno.length == 0) {
message = "Enter Roll number";
ele_rollno.focus();
 } else if (name.length == 0) {
message = "Enter Name";
ele_name.focus();
 } else if (marks.length == 0) {
message = "Enter marks";
ele_marks.focus();
 } else {
obj.rollno = rollno;
obj.name = name;
obj.marks = marks;
 }
return [message, obj];
}
// Show data in table
function showTable(selected_data) {
var html = "<tr>";
for (var i = 0; i < columnNames.length; i++) {
html += "<th>" + columnNames[i] + "</th>";
 }
html += "</tr>";
for (var i = 0; i < selected_data.length; i++) {
html += "<tr>";
for (var j = 0; j < columnNames.length; j++) {
html += "<td>" + selected_data[i][columnNames[j]] + "</td>";
 } //inner for
html += `<td> <input type='button' value='Edit' class='btn-edit'
id='${selected_data[i]["id"]}'/></td>`;
html += `<td> <input type='button' value='Delete' class='btn-delete' id='${selected_data[i]["id"]}'/></td>`;
 } //outer for
ele_table.innerHTML = html;
showHeading(selected_data);
// handle click event of these edit buttons
handleEditEvent();
// handle click event of these delete buttons
handleDeleteEvent();
// [...document.getElementsByClassName("btn-edit")].forEach(()=>
// {
// });
}
// Show heading
function showHeading(selected_data) {
ele_heading.innerHTML = "Student's Data (" + selected_data.length
+ ")";
}
// Show action-message
function showActionMessage(message) {
ele_actionmessage.innerHTML = message;
window.setTimeout(() => {
ele_actionmessage.innerHTML = "";
 }, 2000);
}
// handle keyup event for search textfield
var ele_iptxt = document.getElementById("ip-txt");
ele_iptxt.addEventListener("keyup", function () {
var target = ele_iptxt.value;
var matched_data = filtered_data.filter(
 (data) =>
data.name.toLowerCase().indexOf(target.toLowerCase()) != -1
 );
showTable(matched_data);
});
// handle events of radio buttons
var ele_rbtns = document.querySelectorAll("input[type='radio']");
ele_rbtns.forEach(function (d, index) {
d.addEventListener("change", function () {
if (index == 0) {
//all
filtered_data = data;
 } else if (index == 1) {
// marks>=50
filtered_data = data.filter((value) => value.marks >= 50);
 } else if (index == 2) {
// marks<50
filtered_data = data.filter((value) => value.marks < 50);
 }
showTable(filtered_data);
 });
});


//crud operations with server
export default function interactWithServer(method, url, jsonObject,
callback) {
var xhr = new XMLHttpRequest();
xhr.open(method, url);
xhr.setRequestHeader("Content-Type",
"application/json;charset=UTF-8");
xhr.send(JSON.stringify(jsonObject));
xhr.addEventListener("readystatechange", () => {
if (xhr.readyState == 4 && String(xhr.status).slice(0, 1) == "2")
{
// response is obtained, 200 / 404
callback(xhr.responseText, undefined);
 } else if (xhr.readyState == 4) {
callback(undefined, "Error... fetching data");
 }
 });
}
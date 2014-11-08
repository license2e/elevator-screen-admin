exports.write_json = function(res, code, obj){
  var obf_string = '';
  if(false){
    obj_string = ")]}',\n";
  }
  res.writeHead(code, {"Content-Type": "application/json"});
  res.write(obf_string+JSON.stringify(obj));
  res.end();
}
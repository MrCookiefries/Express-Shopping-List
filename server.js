const {app} = require("./app");

const portNum = 3000;

app.listen(portNum, function(){
  console.log(`Server starting on port ${portNum}`);
});

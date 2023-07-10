const express = require("express");
const app = express();
const PORT = 6969;
const { graphqlHTTP } = require("express-graphql");
const schema = require("./Schemas/index");
const cors = require("cors");

var axios = require("axios");
var postData = { email: 'mrtspeedrunner@gmail.com', password: '3.2vXu;78Nu4HX&' };
let axiosConfig = {
    headers: 
    { 
      'cache-control': 'no-cache, max-age=0',
      'content-type': 'application/json',
    }
};
const corsOptions ={
   origin:'*', 
   credentials:true,          
   optionSuccessStatus:200,
};
app.use(cors(corsOptions));
app.get('/api', async (req, res) => {
    try {
        const response = await axios.post('https://developers.onemap.sg/privateapi/auth/post/getToken', postData, axiosConfig)
        res.json(response.data)
    }
    catch (err) {
        console.log(err)
    }
});
app.use(express.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);


app.listen(PORT, () => {
  console.log("Server running at localhost:6969/graphql");
});

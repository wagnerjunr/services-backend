import { app } from "./app.js";


app.listen({ port: 1912 }).then(() => {
  console.log("Server Running");
});

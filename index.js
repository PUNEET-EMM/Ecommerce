const express = require('express');
const bodyParser = require("body-parser");
const dbConnect = require("./config/dbConnect")
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const blogRouter = require('./routes/blogRoutes');
const brandRouter = require('./routes/brandRoutes');
const prodcategoryRouter = require("./routes/prodcategoryRoutes");
const blogCatRouter = require("./routes/blogCatRoutes");
const {notFound,errorHandler}= require("./middleware/errorHandle");
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
dbConnect();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/user",authRouter);
app.use("/api/product",productRouter);
app.use("/api/blog",blogRouter);
app.use("/api/prodcategory",prodcategoryRouter);
app.use("/api/blogcategory",blogCatRouter);
app.use("/api/brand",brandRouter);



app.use(notFound);
app.use(errorHandler);
app.listen(PORT,()=>{
    console.log("Server is Start");

})

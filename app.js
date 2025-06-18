import createError from "http-errors";
import express from "express";
import path from "path";
import logger from "morgan";
import connectMongoose from "./lib/connectMongoose.js";
import * as homeController from "./controllers/homeController.js";
import * as loginController from "./controllers/loginController.js";
import * as sessionManager from "./lib/sessionManager.js";
import * as productsController from "./controllers/productsController.js";
import * as localeController from "./controllers/localeController.js";
import * as apiProductsController from "./controllers/api/apiProductsController.js";
import * as apiLoginController from "./controllers/api/apiLoginController.js";
import cookieParser from "cookie-parser";
import swaggerMiddleware from "./lib/swaggerMiddleware.js";

import upload from "./lib/uploadConfigure.js";
import i18n from "./lib/i18nConfigure.js";

await connectMongoose();
console.log("Connected to MongoDB.");

var app = express();

// view engine setup
app.set("views", "views");
app.set("view engine", "html");
app.engine("html", (await import("ejs")).__express);

app.locals.appName = "NodePop";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(import.meta.dirname, "public")));

// API routes
app.post("/api/login", apiLoginController.loginJWT);
app.get("/api/products", apiProductsController.list);
app.get("/api/products/:productId", apiProductsController.getOne);
app.post(
  "/api/products",
  upload.single("image"),
  apiProductsController.newProduct
);
app.put(
  "/api/products/:productId",
  upload.single("image"),
  apiProductsController.update
);
app.delete("/api/products/:productId", apiProductsController.deleteProduct);

//  WebApplication routes
app.use(cookieParser());
app.use(sessionManager.middleware);
app.use(sessionManager.useSessionInViews);
app.use(i18n.init);
app.get("/change-locale/:locale", localeController.changeLocale);
app.get("/", homeController.index);
app.get("/login", loginController.index);
app.post("/login", loginController.postLogin);
app.get("/logout", loginController.logout);
app.get("/products/new", sessionManager.guard, productsController.index);
app.post(
  "/products/new",
  sessionManager.guard,
  upload.single("image"),
  productsController.postNew
);
app.get(
  "/products/delete/:productId",
  sessionManager.guard,
  productsController.deleteProduct
);
app.use("/api-doc", swaggerMiddleware);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  // for API errors response must be JSON
  if (req.url.startsWith("/api/")) {
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.render("error");
});

export default app;

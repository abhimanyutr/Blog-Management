const express = require("express");

const blogController = require("../controllers/blogController");
const userController = require("../controllers/userController");
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const multerMiddleware = require("../middlewares/multerMiddleware")

//Create router
const router = express.Router();

router.post('/api/register',userController.registerAuthor)

router.post('/api/login',userController.login)

router.post('/api/addblog',jwtMiddleware,multerMiddleware.single('coverImage'),blogController.addBlog)

router.get("/api/getblogs",blogController.getBlogs);

router.get("/api/admin/blogs",jwtMiddleware,blogController.getAllBlogsAdmin);

router.get("/api/blogs/:slug",blogController.getSingleBlog);

router.get("/api/admin/blog/:id",jwtMiddleware,blogController.getSingleBlogAdmin);

router.delete("/api/admin/blog/:id",jwtMiddleware,blogController.deleteBlog);

router.put("/api/admin/updateblog/:id",jwtMiddleware,multerMiddleware.single("coverImage"),blogController.updateBlog);

module.exports = router

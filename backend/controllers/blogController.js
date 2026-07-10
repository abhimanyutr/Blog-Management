const Blog = require("../models/blogModel");
const slugify = require("slugify");

// Add Blog
exports.addBlog = async (req, res) => {
    console.log("Inside Add Blog");

    try {

        const {
            title,
            description,
            content,
            category,
            tags,
            status
        } = req.body;

        const slug = slugify(title, {lower: true,strict: true});

        const coverImage = req.file ? req.file.filename : "";

        // Check duplicate slug
        const existingBlog = await Blog.findOne({ slug });

        if (existingBlog) {
             console.log("\nMessage: Blog already added");
            console.log("Title :", existingBlog.title);
            console.log("Slug  :", existingBlog.slug);
            console.log("Status:", existingBlog.status);
           

            return res.status(409).json({
                success: false,
                message: "Blog already Added"
            });
        }

        const newBlog = new Blog({
            title,
            slug,
            description,
            content,
            coverImage,
            category,
            tags: tags ? tags.split(",") : [],
            status,
            author: req.userId
        });

        await newBlog.save();
        console.log("\nMessage: Blog added successfully");
        console.log("Title :", newBlog.title);
        console.log("Slug  :", newBlog.slug);
        console.log("Status:", newBlog.status);
       

        res.status(201).json({
            success: true,
            message: "Blog added successfully",
            blog: newBlog
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Failed to add blog",
            error: err.message
        });
    }
};


// Get published Blogs
exports.getBlogs = async (req, res) => {
    console.log("Inside Get All Blogs");

    try {

        const blogs = await Blog.aggregate([
            {
                $match: {
                    status: "published"
                }
            },
            {
                $lookup: {
                    from: "users",    
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $unwind: "$author"
            },
            {
                $project: {
                    title: 1,
                    slug: 1,
                    description: 1,
                    content: 1,
                    coverImage: 1,
                    category: 1,
                    tags: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "author.username": 1,
                    "author.email": 1
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        console.log(`Total Published Blogs : ${blogs.length}`);

        res.status(200).json({
            success: true,
            totalBlogs: blogs.length,
            blogs
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
            error: err.message
        });
    }
};

// GET all blogs for admin
exports.getAllBlogsAdmin = async (req, res) => {

    if (req.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access Denied"
        });
    }

    try {

        const blogs = await Blog.find()
            .populate("author", "username email")
            .sort({ createdAt: -1 });
         console.log(`Total Blogs : ${blogs.length}`);

        res.status(200).json({
            success: true,
            blogs
        });

       

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Get Single Blog by Slug
exports.getSingleBlog = async (req, res) => {
    console.log("Inside Get Single Blog");

    try {

        const { slug } = req.params;

        const blog = await Blog.findOne({
            slug,
            status: "published"
        }).populate("author", "username email");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            blog
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch blog",
            error: err.message
        });

    }
};

// GET Single Blog for Admin
exports.getSingleBlogAdmin = async (req, res) => {
    console.log("Inside Get Single Blog Admin");

    try {

        // Allow only admin
        if (req.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        const { id } = req.params;

        const blog = await Blog.findById(id)
            .populate("author", "username email");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        console.log(`Blog Found: ${blog.title}`);

        res.status(200).json({
            success: true,
            blog
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch blog",
            error: err.message
        });

    }
};

//// Delete Blog by Admin
exports.deleteBlog = async (req, res) => {
    console.log("Inside Delete Blog");

    try {

        // Check admin role
        if (req.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        const { id } = req.params;

        // Find and delete
        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        console.log("\nMessage: Blog deleted successfully");
        console.log("Title :", deletedBlog.title);
        console.log("Slug  :", deletedBlog.slug);
        console.log("Status:", deletedBlog.status);

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Failed to delete blog",
            error: err.message
        });

    }
};

// Update Blog by Admin
exports.updateBlog = async (req, res) => {
    console.log("Inside Update Blog");

    try {
        if (req.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const {
            title,
            description,
            content,
            category,
            tags,
            status
        } = req.body;

        // Update title & slug
        if (title) {
            const newSlug = slugify(title, {
                lower: true,
                strict: true
            });

            const existingBlog = await Blog.findOne({
                slug: newSlug,
                _id: { $ne: id }
            });

            blog.title = title;

            if (existingBlog) {
                blog.slug = `${newSlug}-${Date.now()}`;
            } else {
                blog.slug = newSlug;
            }
        }

        if (description) blog.description = description;

        if (content) blog.content = content;

        if (category) blog.category = category;

        if (tags) blog.tags = tags.split(",");

        if (status) blog.status = status;

        if (req.file) {
            blog.coverImage = req.file.filename;
        }

        await blog.save();

        console.log("\nBlog Updated Successfully");
        console.log("Title :", blog.title);
        console.log("Slug  :", blog.slug);
        console.log("Status:", blog.status);

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Failed to update blog",
            error: err.message
        });

    }
};
const db = require('../util/db')

exports.getPosts = async (req, res, next) => {
    try {
        let result = await db.query('SELECT post_id "postId", title, subtitle, hero_img "heroImg" FROM blog_posts')
        if (result.rows.length <= 0) {
            const error = new Error('No blog post found')
            error.statusCode = 404
            throw error
        }
        res.status(200).json({
            posts: result.rows
        })
    } catch (err) { next(err) }
}

exports.getPost = async (req, res, next) => {
    try {
        const { postId } = req.body
        let text = 'SELECT * from blog_posts where post_id = $1'
        let result = await db.query(text, [postId])
        if (result.rows.length <= 0) {
            const error = new Error('No blog post found')
            error.statusCode = 404
            throw error
        }
        const post = result.rows[0]
        res.status(200).json({
            heroImg: post.hero_img,
            title: post.title,
            subtitle: post.subtitle,
            postContent: post.post_content,
            postToc: post.post_toc
        })
    } catch (err) {
        err.statusCode = err.statusCode || 500
        next(err)
    }
}
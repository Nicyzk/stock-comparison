import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import './BlogIndex.css'
import axios from '../../helpers/axios'
import { APIPath } from '../../helpers/util'

const BlogIndex = () => {
    const [posts, setPosts] = useState([])
    const dispatch = useDispatch()

    useEffect(async () => {
        try {
            const result = await axios.get('/blog/get-posts')
            setPosts(result.data.posts)
        } catch (error) {
            dispatch({ type: 'GET_BLOG_POSTS_FAILURE', payload: { error } }) // trigger error modal
        }
    }, [])

    const renderPosts = () => {
        return posts.map((p, i) => (
            <div className='blog-index-item bg-white' key={i}>
                <Link to={`/blog/post?id=${p.postId}`}>
                    <div className='imgcontainer'><img src={APIPath() + p.heroImg}></img></div>
                    <div className='p-1'>
                        <h3 className='fw-bold text-center py-1'>{p.title}</h3>
                        <p className='fs-14px text-secondary text-center'>{p.subtitle}</p>
                    </div>
                </Link>
            </div>
        ))
    }

    return (
        <div className='bg-lavender min-vh-100'>
            <Layout>
                <div className='px-1 py-125 px-lg-3 px-xl-5'>
                    <div className='fs-3 fw-bold p-1 text-center my-2'><h1>Latest Articles</h1></div>
                    <div className='blog-index-grid'>
                        {renderPosts()}
                    </div>
                </div>
            </Layout>
        </div>
    )
}


export default BlogIndex
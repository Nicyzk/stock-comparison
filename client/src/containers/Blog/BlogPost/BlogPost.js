import React, { useState, useEffect } from 'react'
import axios from '../../../helpers/axios'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Layout from '../../../components/Layout/Layout'
import './BlogPost.css'
import { makeNavLinksSmooth, spyScrolling } from './scrollspy'
import { APIPath } from '../../../helpers/util'

// Post is NOT in redux as it is not client state that must be maintained globally and over refreshes. 

const BlogPost = () => {
    const [post, setPost] = useState({})
    const dispatch = useDispatch()

    let postId = new URLSearchParams(useLocation().search).get('id')

    useEffect(async () => {
        try {
            const result = await axios.post('/blog/get-post', { postId })
            setPost({ ...result.data })
            makeNavLinksSmooth()
            spyScrolling()
        } catch (error) {
            dispatch({ type: 'GET_BLOG_POST_FAILURE', payload: { error } }) // trigger error modal
        }
    }, [])

    if (Object.keys(post) <= 0) return null

    return (
        <Layout>
            <div className='post-hero' style={{ backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, .6), rgba(0, 0, 0, .4)), url(${APIPath() + post.heroImg})` }}>
                <div className='px-1 py-3 px-lg-6 px-xl-10'>
                    <div className='text-white text-center fl fl-col'>
                        <h1 className='fs-1 fw-bold my-2'>{post.title}</h1>
                        <p className='fs-4 my-2'>{post.subtitle}</p>
                    </div>
                </div>
            </div>
            <div className='fl px-1 py-3 px-lg-2 px-xl-10'>
                <div className='layout-post-content' dangerouslySetInnerHTML={{ __html: post.postContent }}></div>
                <div className='layout-post-toc' dangerouslySetInnerHTML={{ __html: post.postToc }}></div>
            </div >

        </Layout >
    )
}

export default BlogPost
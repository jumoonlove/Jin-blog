import axios from "axios";
import { useState, useEffect } from "react";
import Card from "../components/Card";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { bool } from 'prop-types';
import Pagination from "./Pagination";

const BlogList = ({ isAdmin }) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPosts = (page = 1) => {
        axios.get(`http://localhost:3001/posts?_page=${page}&_limit=5&_sort=createdAt&_order=desc`).then((res) => {
            setPosts(res.data);
            setLoading(false);
        })
    }

    const deleteBlog = (event, id) => {
        event.stopPropagation();
        axios.delete(`http://localhost:3001/posts/${id}`).then(() => {
            setPosts(prevPosts => prevPosts.filter(post => post.id !== id))
        })
    }

    useEffect(() => {
        getPosts();
    }, [])

    if (loading) {
        return (
            <LoadingSpinner />
        )
    }

    if (posts.length === 0) {
        return (<div>No blog posts found</div>)
    }
    const renderBlogList = () => {
        return posts.filter(post => {
            return isAdmin || post.publish
        }
        ).map(post => {
            return (
                <Card key={post.id}
                    title={post.title}
                    onClick={() => navigate(`/blogs/${post.id}`)}
                >
                    {isAdmin ? (<div>
                        <button className="btn btn-danger btn-sm"
                            onClick={(event) => deleteBlog(event, post.id)}
                        >Delete
                        </button>
                    </div>) : null}
                </Card>
            );
        })
    }
    return (
        <div>
            {renderBlogList()}
            <Pagination />
        </div>
    )
};

BlogList.propTypes = {
    isAdmin: bool
}

BlogList.defaultProps = {
    isAdmin: false
}

export default BlogList;
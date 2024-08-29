import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import Card from "../components/Card";
import { useNavigate } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { bool } from 'prop-types';
import Pagination from "./Pagination";
import { useLocation } from 'react-router-dom';

const BlogList = ({ isAdmin }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search); // to get page number from URL
    const pageParam = params.get('page');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const limit = 1; // how many list to display

    useEffect(() => {
        setNumberOfPages(Math.ceil(numberOfPosts / limit));
    }, [numberOfPosts]);

    const onClickPageButton = (page) => {
        navigate(`${location.pathname}?page=${page}`)
    }

    const getPosts = useCallback((page = 1) => {
        let params = {
            _page: page,
            _limit: limit,
            _sort: 'createdAt',
            _order: 'desc',
        }

        if (!isAdmin) {
            params = { ...params, publish: true };
        }
        axios.get(`http://localhost:3001/posts`, {
            params
        }).then((res) => {
            setNumberOfPosts(res.headers['x-total-count']); // to get number of elements in database that meets the condition
            setPosts(res.data);
            setLoading(false);
        })
    }, [isAdmin])

    useEffect(() => {
        setCurrentPage(parseInt(pageParam) || 1);
        getPosts(parseInt(pageParam) || 1);
    }, [pageParam, getPosts]);

    const deleteBlog = (event, id) => {
        event.stopPropagation();
        axios.delete(`http://localhost:3001/posts/${id}`).then(() => {
            setPosts(prevPosts => prevPosts.filter(post => post.id !== id))
        });
    };

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    if (posts.length === 0) {
        return (<div>No blog posts found</div>)
    }
    const renderBlogList = () => {
        return posts.map(post => {
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
            {numberOfPages > 1 && <Pagination
                currentPage={currentPage}
                numberOfPages={numberOfPages}
                onClick={onClickPageButton}
            />}
        </div>
    );
};

BlogList.propTypes = {
    isAdmin: bool
}

BlogList.defaultProps = {
    isAdmin: false
}

export default BlogList;
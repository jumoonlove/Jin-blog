import { useParams } from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

const ShowPage = () => {
    const { id } = useParams(); // url id imported from routes.js
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const getPost = (id) => {
        axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
            setPost(res.data)
            setLoading(false);
        })
    };

    useEffect(() => {
        getPost(id)
    }, [id])

    const printDate = (timeStamp) => {
        return new Date(timeStamp).toLocaleString();
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className="d-flex">
                <h1 className="flex-grow-1">{post.title}</h1>
                <div>
                    <Link className="btn btn-primary"
                        to={`/blogs/${id}/edit`}
                    >
                        Edit
                    </Link>
                </div>
            </div>
            <small className="text-muted">
                Created At: {printDate(post.createdAt)}
            </small>
            <hr />
            <p>{post.body}</p>
        </div>
    )
}

export default ShowPage;
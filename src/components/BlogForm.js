import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { bool } from "prop-types";

const BlogForm = ({ editing }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [originalTitle, setOriginalTitle] = useState('');
    const [originalBody, setOriginalBody] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [publish, setPublish] = useState(false);
    const [originalPublish, setOriginalPublish] = useState(false);

    useEffect(() => {
        if (editing) {
            axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
                setTitle(res.data.title);
                setBody(res.data.body);
                setPublish(res.data.publish)
                setOriginalTitle(res.data.title);
                setOriginalBody(res.data.body);
                setOriginalPublish(res.data.publish)
            })
        }
    }, [id, editing]);

    const isEdited = () => { // return boolean value to check if it's edited or not
        return title !== originalTitle || body !== originalBody || publish !== originalPublish;
    }

    const goBack = () => {
        if (editing) {
        navigate(`/blogs/${id}`)
        }
        else {
            navigate('/blogs')
        }
    }

    const onSubmit = () => {
        if (editing) {
            axios.patch(`http://localhost:3001/posts/${id}`, {
                title,
                body,
                publish,
            }).then(res => {
                navigate(`/blogs/${id}`)
            })
        }
        else {
            axios.post('http://localhost:3001/posts', {
                title,
                body,
                publish,
                createdAt: Date.now()
            }).then(() => {
                navigate('/Admin')
            })
        }
    };

    const onChangePublish = (event) => {
        setPublish(event.target.checked);
    }

    return (
        <div>
            <h1>{editing ? 'Edit' : 'Create'} a blog post</h1>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control"
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }} />
            </div>
            <div className="mb-3">
                <label className="form-label">Body</label>
                <textarea className="form-control"
                    value={body}
                    rows="10"
                    onChange={(event) => {
                        setBody(event.target.value)
                    }} />
            </div>
            <div className="form-check mb-3">
                    <input
                    className="form-check-input"
                    type="checkbox"
                    checked = {publish}
                    onChange={onChangePublish}
                    />
                    <label className="form-check-label">
                        publish
                    </label>
            </div>
            <button
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={editing && !isEdited()}
            >
                {editing ? 'Edit' : 'Post'}
            </button>
            <button
                className="btn btn-danger ms-2"
                onClick={goBack}
            >
                Cancel
            </button>
        </div>
    )
};

BlogForm.propTypes = {
    editing: bool
}

BlogForm.defaultProps = {
    editing: false
}

export default BlogForm
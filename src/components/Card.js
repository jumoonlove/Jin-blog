import PropTypes from 'prop-types';

const Card = ({ title, onClick, children }) => {
    return (
        <div 
        className="card mb-3 cursor-pointer"
        onClick={onClick}>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <div>{title}</div>
                    {children && <div>{children}</div>} {/*if there is children, return children*/}
                </div>
            </div>
        </div>
    )
};

Card.propTypes = { // can't create onClick on component, so inherit prop function from parent component
    title: PropTypes.string.isRequired,
    children: PropTypes.element,
    onClick: PropTypes.func,
}

Card.defaultProps = {
    children: null,
    onClick: () => {},
}

export default Card;
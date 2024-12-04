import { Link } from 'react-router-dom'

function FeaturedBlogItem({ blog: { blogTitle, imageData, _id, author } }) {
  const { imageUrls } = imageData ?? []

  return (
    <>
      <Link to={`/public-blog/${_id}`}>
        <div className="featured-blog-div">
          <span className="featured-tag">featured</span>
          <img className="feat-img" src={imageUrls[0]?.url} alt="" />
          <div className="feat-info">
            <h3>
              <span className="feat-title">{blogTitle}</span>
            </h3>
          </div>

          <h4 className="feat-authour">
            <span> by {author}</span>
          </h4>
        </div>
      </Link>
    </>
  )
}

export default FeaturedBlogItem

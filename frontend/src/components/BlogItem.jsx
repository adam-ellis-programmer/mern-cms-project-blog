import { Link } from 'react-router-dom'

function BlogItem({ blog }) {
  const {
    imageData: { imageUrls },
  } = blog

  return (
    <Link className="blog-row-link" to={`/user-blog/${blog._id}`}>
      <div className="blog-row-card">
        <img className="blog-row-card-img" src={imageUrls[0]?.url} alt="" />

        <div className="blog-item-info-container">
          <div className="blog-item-sub-header">date</div>
          <div> {new Date(blog.createdAt).toLocaleString('en-GB')}</div>
        </div>

        <div className="blog-item-info-container">
          <div className="blog-item-sub-header">last edited</div>
          <div> {blog.lastEdited}</div>
        </div>

        <div className="blog-item-info-container">
          <div className="blog-item-sub-header">views</div>
          <div> {blog.views}</div>
        </div>

        <div className="blog-item-info-container">
          <div className="blog-item-sub-header">country</div>
          <div>{blog.country}</div>
        </div>

        <div className="blog-item-info-container">
          <div className="blog-item-sub-header">blog title</div>
          <div>{blog.blogTitle}</div>
        </div>

        <div className="blog-status-div">
          <span className={`status status-${blog.status}`}>{blog.status}</span>
        </div>
      </div>
    </Link>
  )
}

export default BlogItem

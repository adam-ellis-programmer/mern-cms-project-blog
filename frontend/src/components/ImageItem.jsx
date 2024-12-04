import React, { useRef } from 'react'

const ImageItem = ({ item, handleDeleteImg, handleUpdateImg }) => {
  const fileInputRef = useRef(null)

  const handleUpdateClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      handleUpdateImg(item.id, file)
    }
  }

  return (
    <div className="img-management-item-wrap">
      <img className="img-management-item" src={item.url} alt="" />
      <div className="img-management-btn-container">
        <button onClick={handleUpdateClick} className="img-management-btn">
          Update
        </button>
        <button onClick={() => handleDeleteImg(item.id)} className="img-management-btn">
          Delete
        </button>
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

export default ImageItem

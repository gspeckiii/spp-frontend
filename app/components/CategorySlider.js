import React, { useContext } from "react"
import { Link } from "react-router-dom"
import StateContext from "../StateContext"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"

function CategorySlider() {
  const { categories } = useContext(StateContext)

  if (!categories.list || !Array.isArray(categories.list) || categories.list.length === 0) {
    console.log("No categories available in categories.list")
    return <div style={{ textAlign: "center", padding: "20px" }}>No categories available</div>
  }

  const categoriesWithImages = categories.list.filter(cat => cat.cat_img_path)

  if (categoriesWithImages.length === 0) {
    console.log("No categories with images in categories.list")
    return <div style={{ textAlign: "center", padding: "20px" }}>No category images available</div>
  }

  console.log(
    "Categories with images:",
    categoriesWithImages.map(cat => ({
      cat_id: cat.cat_id,
      cat_name: cat.cat_name,
      cat_img_path: cat.cat_img_path,
      cat_desc: cat.cat_desc,
      cat_vid: cat.cat_vid
    }))
  )

  return (
    <div className="category-slider" style={{ padding: "20px 10px" }}>
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        style={{ maxWidth: "100%" }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 25 }
        }}
      >
        {categoriesWithImages.map(category => (
          <SwiperSlide key={category.cat_id}>
            <div className="category-slide__card">
              {category.cat_vid && (
                <a href={category.cat_vid} target="_blank" rel="noopener noreferrer" className="category-slide__youtube">
                  <img src="/assets/images/icons/youtube.svg" alt="Watch on YouTube" className="category-slide__youtube-icon" />
                </a>
              )}
              <Link to={`/category/${category.cat_id}`} className="category-slide__link">
                <img
                  src={`http://localhost:8080/${category.cat_img_path}`}
                  alt={`Category ${category.cat_name || "image"}`}
                  className="category-slide__image"
                  onError={e => {
                    e.target.style.display = "none"
                    console.log("Slider image load failed:", category.cat_img_path)
                  }}
                />
                <h3 className="category-slide__title">{category.cat_name || "Unknown"}</h3>
                {category.cat_desc && <p className="category-slide__subtitle">{category.cat_desc}</p>}
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default CategorySlider

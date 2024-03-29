import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogItem from "~/components/blog-item";
import Footer from "~/components/footer";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PageTitle from "~/components/page-title";
import { firebase_store } from "~/config/firebase-config";
import { AppContext } from "~/context-api/app-provider";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper";
const Blog = () => {
  const param = useParams();
  const [data, setData] = useState();
  const { posts } = useContext(AppContext);
  const getBlog = async () => {
    const arr = [];
    const docRef = doc(firebase_store, "blogs", `blog${param.blogID}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      setData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getBlog();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-[500px]">
        {data == null ? (
          <div className="max-w-container mx-auto">
            <Loading />
          </div>
        ) : (
          <>
            <PageTitle title={data.title} />
            <div className="lg:max-w-container lg:mx-auto max-w-full px-4 lg:px-0">
              <div className="min-h-[600px] py-10 text-textColor">
                <h2 className="text-3.5xl font-semibold">{data.title}</h2>
                <p className="py-4 text-sm font-medium opacity-90 mb-4">
                  Đăng bởi: {data.author}{" "}
                  <span className="ml-4">Ngày: {data.date}</span>
                </p>
                <div>
                  <img
                    src={data.img[0]}
                    alt="img"
                    className="block mb-5 mx-auto"
                  />
                  {data.content.map((item, index) => {
                    if (index < data.content.length - 1) {
                      return (
                        <p
                          key={index}
                          className="text-sm text-textColor my-4 leading-[1.7]"
                        >
                          {item}
                        </p>
                      );
                    }
                  })}
                  <img src={data.img[1]} alt="img" className="mx-auto" />
                  <p className="text-sm text-textColor pt-3 pb-10">
                    {data.content[data.content.length - 1]}
                  </p>
                  <div className="pt-5 border-t-[1px] border-t-solid border-t-[#ebebeb]">
                    <h3 className="text-2xl font-semibold text-textColor">
                      Bài viết liên quan:
                    </h3>
                    <RelatedBlog data={posts} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

const RelatedBlog = ({ data }) => {
  return (
    <div>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        // pagination={{
        //   clickable: true,
        // }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {data.map((blog) => {
          if (blog.id < 5) {
            return (
              <SwiperSlide key={blog.id}>
                <BlogItem data={blog} />
              </SwiperSlide>
            );
          }
        })}
      </Swiper>
    </div>
  );
};

export default Blog;

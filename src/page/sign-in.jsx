import { faFacebookF, faGooglePlusG } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "~/components/footer";
import Header from "~/components/header";
import PageTitle from "~/components/page-title";
import { firebase_auth, firebase_store } from "~/config/firebase-config";
import routes from "~/config/routes";

const SignIn = () => {
  return (
    <div>
      <Header />
      <PageTitle title="Đăng nhập tài khoản" />
      <SigninForm />
      <Footer />
    </div>
  );
};

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const nav = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(firebase_auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        const docRef = doc(firebase_store, "users", email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
          localStorage.setItem("user", JSON.stringify(docSnap.data()));
          if (
            docSnap.data().email == "admin@gmail.com" &&
            docSnap.data().password === password
          ) {
            localStorage.setItem("admin", "true");
          } else {
            localStorage.setItem("admin", "false");
          }
          nav("/");
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const SignInWithGoogle = async () => {
    const res = await signInWithPopup(firebase_auth, googleProvider);
    const check = getAdditionalUserInfo(res);
    const { displayName, email, uid, photoURL } = res.user;
    if (check.isNewUser == true) {
      await setDoc(doc(firebase_store, "users", uid), {
        displayName,
        photoURL,
        uid,
        email,
        timestamp: serverTimestamp(),
      });
    }

    nav("/");
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
  };

  const SignInWithFacebook = async () => {
    const res = await signInWithPopup(firebase_auth, facebookProvider);
    const check = getAdditionalUserInfo(res);
    const { displayName, email, uid, photoURL } = res.user;
    if (check.isNewUser == true) {
      await setDoc(doc(firebase_store, "users", uid), {
        displayName,
        photoURL,
        uid,
        email,
        timestamp: serverTimestamp(),
      });
    }

    nav("/");
  };

  return (
    <div className="max-w-container mx-auto text-center text-textColor">
      <form
        className="block my-5"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <h2 className="text-2xl font-semibold mb-5">Đăng nhập</h2>
        <p>
          Nếu bạn chưa có tài khoản,{" "}
          <Link
            to={routes.signup}
            className="inline-block decoration-solid decoration-[#444] decoration-1 transition-all duration-150 hover:text-sky-500 text-textColor"
            onClick={() => window.scrollTo({top: 0, left: 0, behavior: 'smooth'})}
          >
            đăng ký tại đây!
          </Link>
        </p>
        <input
          type="text"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-100 px-5 py-2 my-4 border-solid border-[1px] border-[#ccc] outline-none rounded-sm mx-auto"
        />
        <input
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-100 px-5 py-2 my-4 border-solid border-[1px] border-[#ccc] outline-none rounded-sm mx-auto"
        />
        <button
          type="submit"
          className="w-100 py-2 text-white bg-sky-500 font-normal uppercase text-sm mb-4 h-10 relative z-10 group"
        >
          Đăng nhập
          <span className="absolute top-0 left-0 right-0 bottom-0 bg-sky-400 z-[-1] w-0 transition-all duration-500 group-hover:w-full"></span>
        </button>
        <Link to="/" className="block text-center text-textColor text-sm">
          Quên mật khẩu
        </Link>
        <div className="text-center my-8 text-sm">
          <p>Hoặc đăng nhập bằng</p>
          <div className="flex items-center justify-center pb-5">
            <div
              className="flex items-center bg-[#3b5998] text-white my-2 cursor-pointer mx-2 select-none"
              onClick={() => SignInWithFacebook()}
            >
              <span className="py-2 px-4 border-solid border-r-[1px] border-[#244488] text-base">
                <FontAwesomeIcon icon={faFacebookF} />
              </span>
              <p className="py-2 px-2 text-sm">Facebook</p>
            </div>
            <div
              className="flex items-center bg-[#e14b33] text-white my-2 cursor-pointer mx-2 select-none"
              onClick={() => SignInWithGoogle()}
            >
              <span className="py-2 px-3 border-solid border-r-[1px] border-[#c2412d] text-base">
                <FontAwesomeIcon icon={faGooglePlusG} />
              </span>
              <p className="py-2 px-2 text-sm">Google</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;

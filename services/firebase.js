const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} = require("firebase/storage");
const dotenv = require("dotenv");
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MESSAGING_SENDER_ID,
};

initializeApp(firebaseConfig);

const storage = getStorage();
const metadata = {
  contentType: "image/jpg",
};

exports.uploadImage = (imageFile) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(
      storage,
      "images/" + Date.now() + "." + imageFile.originalname.split(".").pop()
    );
    const uploadTask = uploadBytesResumable(
      storageRef,
      imageFile.buffer,
      metadata
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

exports.deleteImage = (imageUrl) => {
  let fileRef = ref(storage, imageUrl);
  deleteObject(fileRef).then(() => {
    console.log("success");
  }).catch((err) => {
    console.log("Fail");
  })
}
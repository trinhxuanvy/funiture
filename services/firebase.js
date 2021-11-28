const { initializeApp } = require("firebase/app");
const {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyDMO3WSxFOdzzGJEdPv2N-K2wGUWZkxv3I",
    authDomain: "funiture-service.firebaseapp.com",
    projectId: "funiture-service",
    storageBucket: "funiture-service.appspot.com",
    messagingSenderId: "909086405697",
    appId: "1:909086405697:web:41f42eecf469ea95efc2c0",
    measurementId: "G-RN6XQ3QJ0Z",
};

initializeApp(firebaseConfig);

const storage = getStorage();
const metadata = {
    contentType: "image/jpg",
};

exports.uploadImage = (imageFile) => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, "images/" + Date.now() + "." + imageFile.originalname.split(".").pop());
        const uploadTask = uploadBytesResumable(
            storageRef,
            imageFile.buffer,
            metadata
        );
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload" + imageFile.originalname + " is " + progress + "% done");
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
                });;
            }
        );
    });
}
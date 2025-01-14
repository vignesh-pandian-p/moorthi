// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
authDomain: "pkchitfund.firebaseapp.com",
apiKey: "AIzaSyBo3bA0lEqSo5GuZaH4-TpNOXPZiS7Sp5I",
projectId: "pkchitfund",
storageBucket: "pkchitfund.firebasestorage.app",
messagingSenderId: "497277008790",
appId: "1:497277008790:web:a95186731775637230bbb7",
measurementId: "G-PMJ7CFFYXN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Form submission
document.getElementById("saveButton").addEventListener("click", async () => {
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();

    if (!name || !phone) {
        alert("Please fill in all fields.");
        return;
    }

    // Save data to Firestore
    try {
        await addDoc(collection(db, "customers"), { name, phone });
        document.getElementById("message").innerText = "Customer details saved successfully!";
        document.getElementById("customerForm").reset();
    } catch (error) {
        console.error("Error saving customer details:", error);
        document.getElementById("message").innerText = "Error saving customer details.";
    }
});
// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

// DOM Elements
const customerTableBody = document.querySelector("#customerTable tbody");
const historyModal = document.querySelector("#historyModal");
const modalContent = document.querySelector("#modalContent");
const closeModalBtn = document.querySelector("#closeModal");

// Fetch Customer Data
async function fetchCustomers() {
  const querySnapshot = await getDocs(collection(db, "customers"));
  querySnapshot.forEach((doc) => {
    const customer = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${customer.name}</td>
      <td>${customer.phone}</td>
      <td>
        <button class="deleteBtn" data-id="${doc.id}">Delete</button>
        <button class="historyBtn" data-name="${customer.name}">History</button>
      </td>
    `;
    customerTableBody.appendChild(row);
  });

  // Attach event listeners for dynamically created buttons
  document.querySelectorAll('.deleteBtn').forEach(button => {
    button.addEventListener('click', function() {
      const customerId = this.getAttribute('data-id');
      deleteCustomer(customerId);
    });
  });

  document.querySelectorAll('.historyBtn').forEach(button => {
    button.addEventListener('click', function() {
      const customerName = this.getAttribute('data-name');
      fetchHistory(customerName);
    });
  });
}

// Delete Customer
async function deleteCustomer(customerId) {
  if (confirm("Are you sure you want to delete this customer?")) {
    await deleteDoc(doc(db, "customers", customerId));
    alert("Customer deleted successfully.");
    customerTableBody.innerHTML = ""; // Clear table
    fetchCustomers(); // Reload customer data
  }
}

// Fetch History by Customer Name
async function fetchHistory(customerName) {
  const q = query(collection(db, "payments"), where("customerName", "==", customerName));
  const querySnapshot = await getDocs(q);
  modalContent.innerHTML = ""; // Clear previous content

  if (querySnapshot.empty) {
    modalContent.innerHTML = "<p>No payment history found for this customer.</p>";
  } else {
    const historyList = document.createElement("ul");
    querySnapshot.forEach((doc) => {
      const payment = doc.data();
      const listItem = document.createElement("li");
      listItem.textContent = `Date: ${payment.paymentDate} \n Amount: ${payment.amount}`;
      historyList.appendChild(listItem);
    });
    modalContent.appendChild(historyList);
  }

  // Show the modal
  historyModal.style.display = "block";
}

// Close History Modal
closeModalBtn.addEventListener("click", () => {
  historyModal.style.display = "none";
});

// Load Customers on Page Load
window.addEventListener("load", fetchCustomers);

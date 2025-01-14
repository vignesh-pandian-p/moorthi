  // Firebase Configuration
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
  import { getFirestore,query , getDocs, collection } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";



  const firebaseConfig = {
    authDomain: "pkchitfund.firebaseapp.com",
    apiKey: "AIzaSyBo3bA0lEqSo5GuZaH4-TpNOXPZiS7Sp5I",
    projectId: "pkchitfund",
    storageBucket: "pkchitfund.firebasestorage.app",
    messagingSenderId: "497277008790",
    appId: "1:497277008790:web:a95186731775637230bbb7",
    measurementId: "G-PMJ7CFFYXN"
    };

  const customerNameInput = document.getElementById("customerName");
  const suggestionsList = document.getElementById("suggestions");
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Load Customers for Search
  const customerSuggestions = document.getElementById("customerSuggestions");

  async function loadCustomers() {
      const querySnapshot = await getDocs(collection(db, "customers"));
      querySnapshot.forEach((doc) => {
          const option = document.createElement("option");
          option.value = doc.data().name;
          customerSuggestions.appendChild(option);
      });
  }
  loadCustomers();

  // Function to Generate Payment Number
async function generatePaymentNumber() {
    const docRef = doc(db, "config", "paymentNumber"); // Use a specific document to store the current series
    const docSnap = await getDoc(docRef);

    let paymentNumber = "PK000001"; // Default starting value
    if (docSnap.exists()) {
        const currentNumber = parseInt(docSnap.data().number.replace("PK", ""), 10);
        const nextNumber = currentNumber + 1;
        paymentNumber = `PK${String(nextNumber).padStart(3, "0")}`;
    }

    // Update Firebase with the new number
    await setDoc(docRef, { number: paymentNumber });

    return paymentNumber;
}

  // Fetch all customers from Firestore
  async function fetchCustomers() {
    const customerRef = collection(db, "customers");
    const customerSnapshot = await getDocs(customerRef);
    const customers = [];
    customerSnapshot.forEach(doc => {
        customers.push(doc.data().name); // Assuming each customer document has a 'name' field
    });
    return customers;
}

// Filter suggestions based on input
async function suggestCustomers() {
    const query = customerNameInput.value.toLowerCase();
    const customers = await fetchCustomers();
    const filtered = customers.filter(name =>
        name.toLowerCase().includes(query)
    );
    displaySuggestions(filtered);
}

// Display suggestions in the dropdown
function displaySuggestions(suggestions) {
    suggestionsList.innerHTML = "";
    if (suggestions.length === 0) {
        const noResults = document.createElement("li");
        noResults.textContent = "No results found";
        suggestionsList.appendChild(noResults);
        return;
    }
    suggestions.forEach(name => {
        const suggestionItem = document.createElement("li");
        suggestionItem.textContent = name;
        suggestionItem.addEventListener("click", () => {
            customerNameInput.value = name; // Fill input with selected suggestion
            suggestionsList.innerHTML = ""; // Clear suggestions
        });
        suggestionsList.appendChild(suggestionItem);
    });
}

// Add input listener for dynamic suggestions
customerNameInput.addEventListener("input", suggestCustomers);

// Convert Number to Words
function numberToWords(number) {

  const words = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

if (number === 0) return "Zero Rupees only";
if (number <= 20) return `${words[number]} Rupees only`;
if (number < 100)
    return `${words[Math.floor(number / 10) + 18]}${number % 10 !== 0 ? " " + words[number % 10] : ""} Rupees only`;
if (number < 1000)
    return `${words[Math.floor(number / 100)]} Hundred${number % 100 !== 0 ? " and " + numberToWords(number % 100).replace("Rupees only", "") : ""} Rupees only`;
if (number < 100000)
    return `${numberToWords(Math.floor(number / 1000)).replace("Rupees only", "")} Thousand${number % 1000 !== 0 ? " " + numberToWords(number % 1000).replace("Rupees only", "") : ""} Rupees only`;

return "Number too large";
}

// Update Amount in Words Automatically
document.getElementById("amount").addEventListener("input", (event) => {
const amount = parseInt(event.target.value);
const amountInWords = numberToWords(amount);
document.getElementById("amountInWords").value = amountInWords;
});
  // Generate Invoice as PDF
//   document.getElementById("generateInvoice").addEventListener("click", () => {
//       const customerName = document.getElementById("customerName").value;
//       const amount = document.getElementById("amount").value;
//       const amountInWords = document.getElementById("amountInWords").value;
//       const paymentMode = document.getElementById("paymentMode").value;

//       if (!customerName || !amount || !amountInWords || !paymentMode) {
//           alert("Please fill in all fields.");
//           return;
//       }

//       // Generate PDF
//       const { jsPDF } = window.jspdf;
//       const doc = new jsPDF();

//       doc.setFontSize(18);
//       doc.text("Invoice", 105, 20, { align: "center" });

//       doc.setFontSize(12);
//       doc.text(`Customer Name: ${customerName}`, 20, 40);
//       doc.text(`Amount: ₹${amount}`, 20, 50);
//       doc.text(`Amount in Words: ${amountInWords}`, 20, 60);
//       doc.text(`Payment Mode: ${paymentMode}`, 20, 70);

//       doc.setFontSize(10);
//       doc.text("Generated by PK Chits and Finance", 105, 280, { align: "center" });

//       doc.save(`Invoice_${customerName}.pdf`);
//   });

document.getElementById("generateInvoice").addEventListener("click",async () => {
    const customerName = document.getElementById("customerName").value;
    const amount = document.getElementById("amount").value;
    const amountInWords = document.getElementById("amountInWords").value;
    const paymentMode = document.getElementById("paymentMode").value;
    const paymentDate = document.getElementById("paymentDate").value;
    const paymentNumber = document.getElementById("paymentNumber").value;

    if (!customerName || !amount || !amountInWords || !paymentMode || !paymentDate || !paymentNumber) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        // Save data to Firebase
        const paymentRef = doc(db, "payments", paymentNumber);
        await setDoc(paymentRef, {
            customerName,
            amount,
            amountInWords,
            paymentMode,
            paymentDate,
            paymentNumber,
            timestamp: new Date().toISOString(), // Add a timestamp
        });

        // Store data in localStorage
        localStorage.setItem("customerName", customerName);
        localStorage.setItem("amount", amount);
        localStorage.setItem("amountInWords", amountInWords);
        localStorage.setItem("paymentMode", paymentMode);
        localStorage.setItem("paymentDate", paymentDate);
        localStorage.setItem("paymentNumber", paymentNumber);

        // Redirect to invoice page
        window.location.href = "invoice/index.html";
    } catch (error) {
        console.error("Error saving payment data: ", error);
        alert("Failed to save payment data. Please try again.");
    }
});

// Set Payment Number on Page Load
window.addEventListener("load", async () => {
    const paymentNumberField = document.getElementById("paymentNumber");
    const paymentNumber = await generatePaymentNumber();
    paymentNumberField.value = paymentNumber;
});
let paymentCounter = 1;

function generatePaymentNumber(){
    const prefix = "CF"; // CF
    const number = paymentCounter.toString().padStart(6,"0"); // 000000
    paymentCounter++;
    return prefix+number; // CF000000
}

function renderInvoice(customerName, amount, amountInWords, paymentMode,paymentNumber, paymentDate) {
    // Fill content dynamically
    document.getElementById("customerName").textContent = customerName;
    document.getElementById("amount").textContent = amount;
    document.getElementById("amountInWords").textContent = amountInWords;
    document.getElementById("paymentMode").textContent = paymentMode;
    document.getElementById("paymentNumber").textContent = paymentNumber;
    document.getElementById("paymentDate").textContent = paymentDate;
}

function generateInvoiceAsPDF() {
    const { jsPDF } = window.jspdf;

    // Get the content to render
    const invoiceHTML = document.getElementById("invoiceContent");

    // Use html2canvas to render the content
    html2canvas(invoiceHTML, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Handle cross-origin images
    }).then((canvas) => {
        const pdf = new jsPDF("p", "mm", "a4"); // Create PDF instance (portrait, millimeters, A4)
        const imgData = canvas.toDataURL("image/png"); // Convert canvas to image
        const pdfWidth = pdf.internal.pageSize.getWidth(); // Get PDF width
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Calculate height maintaining aspect ratio

        // Add image to PDF and scale it properly
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("Invoice.pdf"); // Save the PDF
    });
}

// document.addEventListener('DOMContentLoaded', function () {

//     const customerDetails = localStorage.getItem("customerDetails");
//     console.log(customerDetails);

//     renderInvoice(
//         "John Doe",
//         "₹1000",
//         "One Thousand Rupees Only",
//         "UPI",
//         generatePaymentNumber(),
//         new Date().toLocaleDateString()
//     );

//     // Generate PDF on button click
//     document.getElementById("generateInvoice").addEventListener("click", generateInvoiceAsPDF);
// });

document.addEventListener("DOMContentLoaded", ()=>{
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));

    if(customerDetails){
        renderInvoice(
            customerDetails.customerName,
            customerDetails.amount,
            customerDetails.amountInWords,
            customerDetails.paymentMode,
            customerDetails.paymentNumber,
            customerDetails.paymentDate,
            customerDetails.timestamp
        );
    }
    else{
        console.log("No customer details present in the local storage")
    }

    document.getElementById("generateInvoice").addEventListener("click",generateInvoiceAsPDF);
})
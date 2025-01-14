function renderInvoice(customerName, amount, amountInWords, paymentMode, paymentNumber, paymentDate) {
        // Fill content dynamically
        document.getElementById("customerName").textContent = customerName;
        document.getElementById("amount").textContent = amount;
        document.getElementById("amountInWords").textContent = amountInWords;
        document.getElementById("paymentMode").textContent = paymentMode;
        document.getElementById("paymentNumber").textContent = paymentNumber;
        document.getElementById("paymentDate").textContent = paymentDate;
    }

    // This function will be used to generate the PDF from the HTML content
    // function generateInvoiceAsPDF() {
    //     const { jsPDF } = window.jspdf;
    //     const doc = new jsPDF("p", "mm", "a4");

    //     // Fetch the content from the HTML container
    //     const invoiceHTML = document.getElementById("invoiceContent");

    //     // Use jsPDF to create the PDF from the HTML content
    //     doc.html(invoiceHTML, {
    //         callback: function (doc) {
    //             doc.save("Invoice.pdf");
    //         },
    //         margin: [10, 10, 10, 10], // Adjust margins if needed
    //         html2canvas: { scale: 0.4 } // Adjust scaling for the content
    //     });
    // }

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
    

    // Render the invoice on page load or based on your form submission
    renderInvoice(
        "John Doe",
        "₹1000",
        "One Thousand Rupees Only",
        "UPI",
        "12345",
        new Date().toLocaleDateString()
    );
    // Generate PDF on button click
    document.getElementById("generateInvoice").addEventListener("click", generateInvoiceAsPDF);

const pdfInput = document.getElementById("PdfImages");
const pdfpreview = document.getElementById("pdf-preview");
const convertPdfBtn = document.getElementById("convert-pdf");
const pdfMessage = document.getElementById("pdf-message");

let pdfFiles = [];

pdfInput.addEventListener("change", function () {

    pdfFiles = Array.from(this.files);
    pdfpreview.innerHTML = "";

    if (pdfFiles.length === 0) {
        pdfpreview.innerHTML = '<p class="empty-message">Your images will appear here</p>';
        return;
    }

    const validFiles = pdfFiles.filter(file =>
        file.type.startsWith("image/")
    );

    if (validFiles.length !== pdfFiles.length) {
        pdfMessage.textContent = "Please select image files only";
        pdfMessage.style.color = "red";
        pdfFiles = validFiles;
    } else {
        pdfMessage.textContent = "";
    }

    pdfFiles.forEach(file => {

        const imageURL = URL.createObjectURL(file);

        const img = document.createElement("img");
        img.src = imageURL;
        img.alt = file.name;

        pdfpreview.appendChild(img);
    });

});


convertPdfBtn.addEventListener("click", async function () {

    if (pdfFiles.length === 0) {
        pdfMessage.textContent = "Please upload images first!";
        pdfMessage.style.color = "red";
        return;
    }

    if (!window.jspdf) {
        pdfMessage.textContent = "PDF library is not loaded";
        pdfMessage.style.color = "red";
        return;
    }

    try {

        pdfMessage.textContent = "Creating your PDF...";
        pdfMessage.style.color = "#0F766E";

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = 210;
        const pageHeight = 297;

        for (let i = 0; i < pdfFiles.length; i++) {

            const file = pdfFiles[i];

            const imageURL = URL.createObjectURL(file);

            const img = new Image();

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageURL;
            });

            const canvas = document.createElement("canvas");

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const context = canvas.getContext("2d");

            context.drawImage(img, 0, 0);

            const imageData = canvas.toDataURL("image/jpeg", 0.95);

            const ratio = Math.min(
                pageWidth / img.naturalWidth,
                pageHeight / img.naturalHeight
            );

            const width = img.naturalWidth * ratio;
            const height = img.naturalHeight * ratio;

            const x = (pageWidth - width) / 2;
            const y = (pageHeight - height) / 2;

            if (i > 0) {
                pdf.addPage();
            }

            pdf.addImage(
                imageData,
                "JPEG",
                x,
                y,
                width,
                height
            );

            URL.revokeObjectURL(imageURL);
        }

        pdf.save("ImgFlow-Images.pdf");

        pdfMessage.textContent = "Your PDF has been downloaded successfully!";
        pdfMessage.style.color = "#0F766E";

    } catch (error) {

        pdfMessage.textContent = "Something went wrong. Please try again.";
        pdfMessage.style.color = "red";

        console.error(error);
    }

});



const linkInput = document.getElementById("linkImage");
const linkPreview = document.getElementById("link-preview");
const downloadBtn = document.getElementById("download-image");
const generateBtn = document.getElementById("generate-link");
const copyBtn = document.getElementById("copy-link");
const linkOutput = document.getElementById("image-link");
const linkMessage = document.getElementById("link-message");

let selectedImage = null;
let imageURL = null;

// Image Upload
linkInput.addEventListener("change", function () {

    const file = this.files[0];

    linkPreview.innerHTML = "";
    linkOutput.value = "";
    linkMessage.textContent = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        linkMessage.textContent = "Please select an image file only!";
        linkMessage.style.color = "red";
        this.value = "";
        selectedImage = null;
        return;
    }

    selectedImage = file;

    if (imageURL) {
        URL.revokeObjectURL(imageURL);
    }

    imageURL = URL.createObjectURL(file);

    const img = document.createElement("img");
    img.src = imageURL;
    img.alt = file.name;

    linkPreview.appendChild(img);

    linkMessage.textContent = "Image uploaded successfully!";
    linkMessage.style.color = "#0F766E";

});

// Generate Image Link
generateBtn.addEventListener("click", function () {

    if (!selectedImage) {
        linkMessage.textContent = "Please upload an image first!";
        linkMessage.style.color = "red";
        return;
    }

    linkOutput.value = imageURL;

    linkMessage.textContent = "Image link generated successfully!";
    linkMessage.style.color = "#0F766E";

});

// Copy Link
copyBtn.addEventListener("click", async function () {

    if (!linkOutput.value) {
        linkMessage.textContent = "Please generate an image link first!";
        linkMessage.style.color = "red";
        return;
    }

    try {
        await navigator.clipboard.writeText(linkOutput.value);

        linkMessage.textContent = "Image link copied successfully!";
        linkMessage.style.color = "#0F766E";

    } catch (error) {
        linkOutput.select();
        document.execCommand("copy");

        linkMessage.textContent = "Image link copied!";
        linkMessage.style.color = "#0F766E";
    }

});

// Download Image
downloadBtn.addEventListener("click", function () {

    if (!selectedImage) {
        linkMessage.textContent = "Please upload an image first!";
        linkMessage.style.color = "red";
        return;
    }

    const downloadLink = document.createElement("a");

    downloadLink.href = imageURL;
    downloadLink.download = selectedImage.name;

    downloadLink.click();

    linkMessage.textContent = "Image downloaded successfully!";
    linkMessage.style.color = "#0F766E";

});

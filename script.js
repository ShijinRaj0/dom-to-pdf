$(document).ready(function() {
    var inpText = $('#inputText');
    var content = $('#content');
    inpText.on('change paste keyup', () => {
        content.html(inpText.val());
    });
});



function getCanvasOptions(element) {
    var HTML_Width = element.width();
    var HTML_Height = element.height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2.5);
    //var PDF_Height = ;
    var PDF_Height = (PDF_Width * 1.8) + (top_left_margin * 2.5);
    //var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    return {
        HTML_Width: HTML_Width,
        HTML_Height: HTML_Height,
        top_left_margin: top_left_margin,
        PDF_Width: PDF_Width,
        PDF_Height: PDF_Height,
        canvas_image_width: HTML_Width,
        canvas_image_height: HTML_Height * 1.5,
        totalPDFPages: 1
    };

}

function producePDF() {
    var element = $("#content");
    // element.append("<div class='pdf-clearance'>PDF Clearance Area</div>");
    //element.prepend("<div class='pdf-clearance'>PDF Clearance Area</div>");
    var canvasOptions = getCanvasOptions(element);

    var total_pdf_height = canvasOptions.PDF_Height;
    var total_pdf_width = canvasOptions.PDF_Width;

    var pdf = new jsPDF('p', 'pt', [total_pdf_width, total_pdf_height]);
    generatePDF({
        pdf: pdf,
        pdfOptions: {
            PDF_Height: total_pdf_height,
            PDF_Width: total_pdf_width
        },
        arr_elements: [element]
    }, (pdf) => {
        pdf.save("test.pdf")

    });
}

function generatePDF(config, callback) {
    var pdf = config.pdf;
    var arr_elements = config.arr_elements;

    getCanvas(pdf, arr_elements[0], ([canvas, pdf]) => {
        addToPDF([pdf, config.pdfOptions], [canvas, getCanvasOptions(arr_elements[0])], (pdf) => {
            callback(pdf);
        })
    });


}

function addToPDF([pdf, pdfOptions], [canvas, canvasOptions], callback) {
    canvas.getContext('2d');
    console.log(canvas.height + "  " + canvas.width);
    var imgData = canvas.toDataURL("image/png", 1.0);
    pdf.addImage(imgData, 'PNG', canvasOptions.top_left_margin, canvasOptions.top_left_margin, canvasOptions.canvas_image_width, canvasOptions.canvas_image_height);
    console.log(canvasOptions);
    console.log(pdfOptions);

    //pdf.addPage(pdfOptions.PDF_Width, pdfOptions.PDF_Height);
    pdf.addImage(imgData, 'PNG', canvasOptions.top_left_margin, -(pdfOptions.PDF_Height * 1) + (canvasOptions.top_left_margin * 4), canvasOptions.canvas_image_width, canvasOptions.canvas_image_height);

    // for (var i = 1; i <= canvasOptions.totalPDFPages; i++) {
    //     pdf.addPage(canvasOptions.PDF_Width, canvasOptions.PDF_Height);
    //     pdf.addImage(imgData, 'JPG', canvasOptions.top_left_margin, -(canvasOptions.PDF_Height * i) + (canvasOptions.top_left_margin * 4), canvasOptions.canvas_image_width, canvasOptions.canvas_image_height);
    // }
    //console.log(pdf);
    callback(pdf);
}
/* 
1. Take element
2. Get canvas options of the element.
3. Sum PDF Height,No.of pages.
4. Create pdf object with above resolutions.
5. Get Canvas for each element;
5. Add pages for each element's canvas.
6. Finally save total PDF.
*/
function btnSave() {
    producePDF();
}



function getCanvas(pdf, element, callback) {
    console.log("elemhereent");
    console.log(element);
    html2canvas(element, {
        background: "#FFFFFF",
        scale: 2
    }).then(canvas => {
        $('#checkDiv').append(canvas);;
        callback([canvas, pdf]);
        //renderPDF(params);
    });
}
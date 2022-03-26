import wasmInit from "./pkg/mandelbrot.js";
// let canvasImageData;
// let imageDataArray;
// let canvasContext;


const runWasm = async () => {
    const rustWasm = await wasmInit("./pkg/mandelbrot_bg.wasm");
    const image_size = 1000;

    rustWasm.generate_mandelbrot(0,0,image_size);
    drawMandelbrotToCanvas();

    function drawMandelbrotToCanvas() {

        const wasmByteMemoryArray = new Uint8Array(rustWasm.memory.buffer);

        const canvasElement = document.getElementById("drawing_area");

        const canvasContext = canvasElement.getContext("2d");
        const canvasImageData = canvasContext.createImageData(
            canvasElement.width,
            canvasElement.height
        );



        canvasContext.clearRect(0,0,canvasElement.width, canvasElement.height);

        const outputPointer = rustWasm.get_image_ptr();
        const imageDataArray = wasmByteMemoryArray.slice(
            outputPointer,
            outputPointer + image_size * image_size * 4
        );

        canvasImageData.data.set(imageDataArray);
        canvasContext.clearRect(0,0,canvasElement.width, canvasElement.height);
        canvasContext.putImageData(canvasImageData, 0, 0);
    }


// runWasm();

let x = 50, y = 50;


function redrawRect() {
    // canvasImageData.data.set(imageDataArray);
    // canvasContext.clearRect(0,0,canvasElement.width, canvasElement.height);
    // canvasContext.putImageData(canvasImageData, 0, 0);
    drawMandelbrotToCanvas();


    let canvas = $("#drawing_area");
    // let x = $("#heightChooser").val();
    // let y = $("#widthChooser").val();
    let size = $("#scaleChooser").val();

    canvas.drawRect({
        // fillStyle: 'none',
        strokeStyle: 'blue',
        strokeWidth: 4,
        x: x, y: y,
        fromCenter: false,
        width: size,
        height: size
      });

}




// $("#heightChooser").change(() => {
//     let val = $("#heightChooser").val();
//     $("#currentHeight").text(val);
//     redrawRect();
// });

// $("#widthChooser").change(() => {
//     let val = $("#widthChooser").val();
//     $("#currentWidth").text(val);
//     redrawRect();
// });

$("#scaleChooser").change(() => {
    let val = $("#scaleChooser").val();
    $("#currentScale").text(val);
    redrawRect();
});

let prevX = 0, prevY = 0, prevSize = 1000;

function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

$("#recalculate").click(() => {
    // let x = $("#heightChooser").val();
    // let y = $("#widthChooser").val();
    let size = $("#scaleChooser").val();

    let scaledX = scale(x, 0, image_size, prevX, prevX + prevSize);
    let scaledY = scale(y, 0, image_size, prevY, prevY + prevSize);
    let scaledSize = scale(size, 0, image_size, 0, prevSize);
    
    console.log(x + " " + scaledX);
    console.log(y + " " + scaledY);
    console.log(size + " " + scaledSize);
    console.log("--------------");

    prevX = scaledX;
    prevY = scaledY;
    prevSize = scaledSize;

    rustWasm.generate_mandelbrot(scaledX,scaledX,scaledSize);
    drawMandelbrotToCanvas();
    redrawRect();
});

$("#reset").click(() => {
    rustWasm.generate_mandelbrot(0,0,image_size);
    drawMandelbrotToCanvas();
    redrawRect();
    prevX = 0;
    prevY = 0;
    prevSize = 1000;
});

$("#drawing_area").click((event) => {
    event.preventDefault();
    event.stopPropagation();
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    let scale = $("#drawing_area").css("height");
    scale = scale.slice(0, scale.length - 2);
    scale = image_size / scale;

    mouseX *= scale;
    mouseY *= scale;

    x = mouseX;
    y = mouseY;

    redrawRect();

    console.log(mouseX + " " + mouseY + " ");
});


redrawRect();

};

runWasm();
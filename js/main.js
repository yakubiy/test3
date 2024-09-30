let canvas = document.querySelector("canvas"),
    toolsBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    brushSize = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvasBtn = document.querySelector(".clear-canvas")
saveImgBtn = document.querySelector(".save-img")



let ctx = canvas.getContext("2d"),
    isDrawing = false,
    brushWidth = 5,
    selectedTool = "brush",
    prevMouseX,
    prevMouseY,
    snapshot,
    selectedColor = "#000"

const setCanvasBg = () => {
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = selectedColor
}


window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBg()
})

const startDraw = (e) => {
    isDrawing = true
    ctx.lineWidth = brushWidth
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath()
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const drawRectangle = e => {
    fillColor.checked
        ? ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
        : ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)

}

const drawCircle = (e) => {
    ctx.beginPath()
    const radius = Math.sqrt((prevMouseX - e.offsetX) ** 2 + (prevMouseY - e.offsetY) ** 2)
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    fillColor.checked
        ? ctx.fill()
        : ctx.stroke()
}

const drawTriangle = (e) => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
    ctx.closePath()
    ctx.stroke()
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const drawing = (e) => {
    if (!isDrawing) return
    ctx.putImageData(snapshot, 0, 0)
    switch (selectedTool) {
        case "brush":
            canvas.style.cursor = `url("../svgtopng/brush.png"), auto;`
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
           
            break;
        case "rectangle":
            canvas.style.cursor = `url("../svgtopng/brush.png"), auto;`
            drawRectangle(e)
            canvas.style.cursor = 'url("../svgtopng/brush.png"), auto;'
            break;
        case "circle":
            canvas.style.cursor = `url("../svgtopng/brush.png"), auto;`
            drawCircle(e)
            break;
        case "triangle":
            drawTriangle(e)
            break;
        case "eraser":
            ctx.strokeStyle = "#fff"
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            break;
        default:
            break;
    }
}

brushSize.addEventListener("change", () => brushWidth = brushSize.value)

toolsBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active")
        btn.classList.add("active")
        selectedTool = btn.id
        console.log(selectedTool)
    })
})

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected")
        btn.classList.add("selected")
        const bgColor = window.getComputedStyle(btn).getPropertyValue("background-color")
        selectedColor = bgColor
    })
})

colorPicker.addEventListener("change", () => {
    selectedColor = colorPicker.value
    colorPicker.parentElement.style.backgroundColor = colorPicker.value
})

clearCanvasBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCanvasBg()
})

saveImgBtn.addEventListener("click", () => {
    const link = document.createElement("a")
    link.download = `rasm-${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
})

const stopDraw = () => {
    isDrawing = false
}


canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", stopDraw)
canvas.addEventListener("mouseleave", () => {
    isDrawing = false
})


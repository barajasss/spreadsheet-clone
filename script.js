const spreadSheetContainer = document.querySelector("#spreadsheet-container")
const exportBtn = document.querySelector("#export-btn")
const ROWS = 10
const COLS = 10
const spreadsheet = []
const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
]
class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        this.isHeader = isHeader
        this.disabled = disabled
        this.data = data
        this.row = row
        this.rowName = rowName
        this.column = column
        this.columnName = columnName
        this.active = active
    }
}

exportBtn.onclick = function (e) {
    let csv = ""
    for (let i = 0; i < spreadsheet.length; i++) {
        csv +=
            spreadsheet[i]
                .filter((item) => !item.isHeader)
                .map((item) => item.data)
                .join(",") + "\r\n"
    }

    const csvObj = new Blob([csv])
    const csvUrl = URL.createObjectURL(csvObj)
    console.log("csv", csvUrl)

    const a = document.createElement("a")
    a.href = csvUrl
    a.download = "Exported Spreadsheet.csv"
    a.click()
}

initSpreadsheet()

function initSpreadsheet() {
    for (let i = 0; i < COLS; i++) {
        let spreadsheetRow = []
        for (let j = 0; j < COLS; j++) {
            let cellData = ""
            let isHeader = false
            let disabled = false
            if (j === 0) {
                cellData = i
                isHeader = true
                disabled = true
            }

            if (i === 0) {
                isHeader = true
                disabled = true
                cellData = alphabets[j - 1]
            }

            if (!cellData) {
                cellData = ""
            }
            const rowName = i
            const columnName = alphabets[j - 1]
            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false)
            spreadsheetRow.push(cell)
        }
        spreadsheet.push(spreadsheetRow)
    }
    console.log("spreadsheet", spreadsheet)
    drawSheet()
}

function drawSheet() {
    spreadSheetContainer.innerHTML = ""
    for (let i = 0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement("div")
        rowContainerEl.className = "cell-row"

        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j]
            rowContainerEl.append(createCellEl(cell))
        }
        spreadSheetContainer.append(rowContainerEl)
    }
}

function createCellEl(cell) {
    const cellEl = document.createElement("input")
    cellEl.className = "cell"
    cellEl.id = "cell_" + cell.row + cell.column
    cellEl.value = cell.data
    cellEl.disabled = cell.disabled

    if (cell.isHeader) {
        cellEl.classList.add("header")
    }

    cellEl.onclick = () => handleCellClick(cell)
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell)
    return cellEl
}

function handleCellClick(cell) {
    clearHeaderActiveStates()
    const columnHeader = spreadsheet[0][cell.column]
    const rowHeader = spreadsheet[cell.row][0]
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column)
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column)
    columnHeaderEl.classList.add("active")
    rowHeaderEl.classList.add("active")
    document.querySelector("#cell-status").innerHTML = cell.columnName + "" + cell.rowName
    // console.log("clicked cell", cell, "columnHeaderEl", columnHeaderEl, "rowHeaderEl", rowHeaderEl)
}

function handleOnChange(data, cell) {
    cell.data = data
}

function clearHeaderActiveStates() {
    for (let i = 0; i < spreadsheet.length; i++) {
        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j]
            if (cell.isHeader) {
                let cellEl = getElFromRowCol(cell.row, cell.column)
                cellEl.classList.remove("active")
            }
        }
    }
}

function getElFromRowCol(row, col) {
    return document.querySelector("#cell_" + row + col)
}

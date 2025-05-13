const timetableGrid = document.getElementById("timetable-grid");
const legendContainer = document.getElementById("legend-container");
const themeToggleButton = document.getElementById("theme-toggle-button");
const bodyElement = document.body;

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// You can extend this to Saturday or Sunday if needed
// const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeSlots = [
    "09:00 - 09:50", "09:55 - 10:45", "10:55 - 11:45", "11:50 - 12:45",
    "12:45 - 01:40", // Lunch
    "01:45 - 02:35", "02:40 - 03:30", "03:40 - 04:30", "04:35 - 05:30"
];

let legend = {}; // To store subject { name, color, shortForm }
let currentSelectedSubject = null; // To store the last added/selected subject for populating grid

function generateTimetable() {
    timetableGrid.innerHTML = ""; // Clear previous grid

    // Adjust grid columns based on screen size for better responsiveness
    const dayHeaderWidth = window.innerWidth < 768 ? "80px" : "120px"; // Smaller day header on mobile
    timetableGrid.style.gridTemplateColumns = `${dayHeaderWidth} repeat(${timeSlots.length}, 1fr)`;

    // Add empty top-left corner
    const cornerDiv = document.createElement("div");
    timetableGrid.appendChild(cornerDiv);

    // Add time slot headers
    timeSlots.forEach(slot => {
        const timeDiv = document.createElement("div");
        timeDiv.className = "time-slot";
        timeDiv.textContent = slot.replace(" - ", "\n"); // Break time into two lines
        timetableGrid.appendChild(timeDiv);
    });

    // Add days and editable cells
    days.forEach(day => {
        const dayDiv = document.createElement("div");
        dayDiv.className = "day";
        dayDiv.textContent = day;
        timetableGrid.appendChild(dayDiv);

        timeSlots.forEach(slot => {
            const cell = document.createElement("div");
            if (slot === "12:45 - 01:40") { // Specific check for lunch
                cell.className = "lunch";
                cell.textContent = "Lunch Break";
            } else {
                cell.className = "editable";
                cell.dataset.day = day; // Store day and slot for potential future use (saving/loading)
                cell.dataset.slot = slot;
                cell.addEventListener("click", () => populateCell(cell));
            }
            timetableGrid.appendChild(cell);
        });
    });
    updateLegendUI(); // Update legend in case it was pre-populated
}

function addSubject() {
    const name = document.getElementById("subject-name").value.trim();
    const short = document.getElementById("subject-short").value.trim().toUpperCase();
    const color = document.getElementById("subject-color").value;

    if (!name || !short) {
        alert("Please enter both subject name and short form.");
        return;
    }
    if (short.length > 5) {
        alert("Short form should be 5 characters or less.");
        return;
    }
    if (legend[short]) {
        alert(`Subject with short form "${short}" already exists. Choose a different short form.`);
        return;
    }

    legend[short] = { name, color };
    currentSelectedSubject = { short, name, color }; // Set the newly added subject as current

    updateLegendUI();

    // Clear input fields
    document.getElementById("subject-name").value = "";
    document.getElementById("subject-short").value = "";
    // Optionally reset color or keep it for next subject:
    // document.getElementById("subject-color").value = "#4CAF50";

    // Give focus to the first input for faster next entry
    document.getElementById("subject-name").focus();
}

function populateCell(cell) {
    if (currentSelectedSubject) {
        cell.style.backgroundColor = currentSelectedSubject.color;
        cell.textContent = currentSelectedSubject.short;
        cell.dataset.subjectShort = currentSelectedSubject.short; // Store which subject is in cell
    } else {
        alert("Please add a subject first or select one from the legend.");
    }
}

function updateLegendUI() {
    legendContainer.innerHTML = ""; // Clear existing legend items
    if (Object.keys(legend).length === 0) {
        legendContainer.innerHTML = "<p>No subjects added yet. Add subjects using the form above.</p>";
        return;
    }

    for (const [short, { name, color }] of Object.entries(legend)) {
        const legendItem = document.createElement("div");
        legendItem.className = "legend-item"; // For styling
        legendItem.title = `Click to select: ${name} (${short})`; // Tooltip

        const colorBox = document.createElement("div");
        colorBox.className = "legend-color-box";
        colorBox.style.backgroundColor = color;

        const text = document.createElement("span");
        text.textContent = `${short}: ${name}`;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(text);

        // Allow clicking on legend item to set it as the current subject for populating cells
        legendItem.addEventListener("click", () => {
            currentSelectedSubject = { short, name, color };
            // Optional: Add a visual cue for selected legend item
            document.querySelectorAll('.legend-item.selected').forEach(item => item.classList.remove('selected'));
            legendItem.classList.add('selected');
            alert(`Selected: ${name}. Now click on the timetable to assign it.`);
        });
        legendContainer.appendChild(legendItem);
    }
}


function printAsPDF() {
    // Optional: Add Course Name and Semester to the top of the printed page
    const courseName = document.getElementById('course-name').value;
    const semester = document.getElementById('semester').value;
    let printHeader = '';

    if (courseName || semester) {
        printHeader = `<div style="text-align: center; margin-bottom: 15px; font-size: 14pt;">`;
        if (courseName) printHeader += `<h2>${courseName}</h2>`;
        if (semester) printHeader += `<h3>${semester}</h3>`;
        printHeader += `</div>`;
    }

    // Temporarily add this header for printing
    const tempPrintTitleDiv = document.createElement('div');
    tempPrintTitleDiv.innerHTML = printHeader;
    if (printHeader) {
      document.body.insertBefore(tempPrintTitleDiv, document.querySelector('.container'));
    }
    
    // Apply a class to body to ensure PDF footer has correct theme (if needed)
    // For PDF, we generally want light theme for readability and ink saving.
    const isDark = bodyElement.classList.contains('dark-theme');
    if (isDark) {
        bodyElement.classList.remove('dark-theme');
        bodyElement.classList.add('light-theme'); // Force light for PDF
    }

    window.print();

    // Clean up
    if (printHeader) {
      tempPrintTitleDiv.remove();
    }
    if (isDark) { // Revert theme if it was changed
        bodyElement.classList.add('dark-theme');
        bodyElement.classList.remove('light-theme');
    }
}

function printAsPNG() {
    const timetableWrapper = document.getElementById('timetable-export-wrapper');
    const courseName = document.getElementById('course-name').value;
    const semester = document.getElementById('semester').value;

    // Temporarily add Course Name and Semester above the grid inside the wrapper for PNG
    const tempPngHeader = document.createElement('div');
    tempPngHeader.style.textAlign = 'center';
    tempPngHeader.style.marginBottom = '15px'; // Space between header and grid
    tempPngHeader.style.paddingTop = '10px'; // Ensure it's within the 1cm margin
    
    let headerContent = '';
    if (courseName) headerContent += `<h2 style="margin: 5px 0; font-size: 20px;">${courseName}</h2>`;
    if (semester) headerContent += `<h3 style="margin: 5px 0; font-size: 16px;">${semester}</h3>`;
    tempPngHeader.innerHTML = headerContent;

    if (courseName || semester) {
        timetableWrapper.insertBefore(tempPngHeader, timetableWrapper.firstChild);
    }
    
    // Ensure the wrapper background is set correctly based on the current theme for the PNG
    const currentThemeBgColor = window.getComputedStyle(bodyElement).backgroundColor;
    timetableWrapper.style.backgroundColor = currentThemeBgColor; // Use body bg for wrapper during capture

    html2canvas(timetableWrapper, { // Capture the wrapper which has padding
        useCORS: true,
        scale: window.devicePixelRatio || 2, // Higher resolution
        backgroundColor: currentThemeBgColor, // Explicitly set background
        onclone: (documentClone) => {
            // If you have any dynamic elements or SVGs that don't render well,
            // you might need to handle them here in the cloned document.
            // For example, ensure styles are fully applied.
            const clonedWrapper = documentClone.getElementById('timetable-export-wrapper');
            if (clonedWrapper) {
                 clonedWrapper.style.backgroundColor = currentThemeBgColor;
                 // Ensure child elements also have appropriate background if transparent
                 documentClone.querySelectorAll('#timetable-grid, #timetable-grid div').forEach(el => {
                    if(window.getComputedStyle(el).backgroundColor === 'rgba(0, 0, 0, 0)' || window.getComputedStyle(el).backgroundColor === 'transparent'){
                        // If transparent, maybe inherit from parent or set explicitly
                    }
                 });
            }
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'timetable.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Clean up: remove the temporary header
        if (courseName || semester) {
            tempPngHeader.remove();
        }
        // Reset wrapper background if changed
        timetableWrapper.style.backgroundColor = '';


    }).catch(err => {
        console.error("Error generating PNG:", err);
        alert("Could not generate PNG. See console for details.");
        // Clean up in case of error too
        if (courseName || semester) {
            tempPngHeader.remove();
        }
        timetableWrapper.style.backgroundColor = '';
    });
}

// Theme Toggler Logic
themeToggleButton.addEventListener("click", () => {
    bodyElement.classList.toggle("dark-theme");
    bodyElement.classList.toggle("light-theme");

    const isDarkMode = bodyElement.classList.contains("dark-theme");
    themeToggleButton.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    // Store preference in localStorage (optional)
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

// Function to apply stored theme on load (optional)
function applyStoredTheme() {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
        bodyElement.classList.add("dark-theme");
        bodyElement.classList.remove("light-theme");
        themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    } else { // Default to light
        bodyElement.classList.add("light-theme");
        bodyElement.classList.remove("dark-theme");
        themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Initial setup
window.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme(); // Apply theme first
    generateTimetable(); // Then generate grid
});

// Regenerate timetable on window resize to adjust column widths (optional, can be performance intensive)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // generateTimetable(); // Uncomment if you want the grid to fully re-render on resize
    }, 250); // Debounce resize event
});

# **Timetable Generator**

A responsive and interactive web application for creating, editing, and exporting timetables. This project allows users to add their custom timetable, print it as a PDF or PNG, and includes a watermark image as the background. It’s designed with user-friendly features and supports modern web standards.

---

## **Features**
- **Interactive Timetable Grid:** Editable cells for easy customization.
- **Watermark Background:** Subtle background image to personalize timetables.
- **Export Options:** Save the timetable as:
  - PDF
  - PNG
- **Responsive Design:** Works seamlessly across devices.
- **Lightweight and Fast:** Minimal dependencies for quick loading.
- **Print-Optimized:** Includes print-friendly styles.
- **Custom Footer:** Personal branding with credits and titles.

---

## **Technologies Used**
- **HTML**: Structure of the web application.
- **CSS**: Styling, including responsive layout and watermark integration.
- **JavaScript**: Interactive functionality for editing and exporting.
- **html2canvas Library**: Capturing the timetable for PNG export.

---

## **How It Works**
1. **Create a Timetable:**
   - Enter subjects, classes, or events into the editable grid cells.
   - Customize rows and columns as needed.

2. **Add a Watermark:**
   - A background image is subtly added behind the timetable. Adjust its opacity in the `CSS` for customization.

3. **Export Your Timetable:**
   - Click on the **Print as PDF** or **Print as PNG** buttons to download your timetable.

4. **Print Directly:**
   - Use the browser’s print feature to directly print the timetable.

---

## **Setup Instructions**
### **1. Clone the Repository**
```bash
git clone https://github.com/Vai838/timetable-generator.git
cd timetable-generator
```

### **2. Add Your Watermark**
- Place your image file on a hosting platform or in the project directory.
- Update the CSS:
```css
#timetable-grid::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('<your-image-path>'); /* Use a hosted URL for CORS compliance */
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.1;
  pointer-events: none;
}
```

### **3. Open the Project**
- Open the `index.html` file in any browser.

### **4. Export Timetables**
- Use the provided buttons to download timetables as PNG or PDF.

---

## **Project Structure**
```
timetable-generator/
├── index.html      # Main HTML file
├── styles.css      # CSS for styling the project
├── script.js       # JavaScript for interactive functionality
├── elfenix.png     # Example watermark image
└── README.md       # Project documentation
```

---

## **Known Issues**
1. **Watermark Not Visible in PNG Export:**
   - Ensure the watermark is hosted on a server (for CORS compliance).
2. **Browser Compatibility:**
   - Export features work best on modern browsers like Chrome and Firefox.

---

## **Contributing**
Contributions are welcome! If you'd like to improve this project:
1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Submit a pull request with your changes.

---

## **License**
This project is licensed under the [GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007](GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007).

---

## **Credits**
- Developed by @Vai838 
- Project inspired by the need for personalized timetables for academic use.  
- Branding: **El Fénix**

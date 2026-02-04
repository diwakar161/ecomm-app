🚀 Live Demo
https://img.shields.io/badge/Live-Demo-green?style=for-the-badge&logo=github

📋 Project Overview
A modern, responsive ecommerce web application built with Next.js 14.0.3. This app provides a complete online shopping experience with product browsing, cart management, and checkout functionality.

✨ Features
🛍️ Core Features
Product Catalog: Browse products with images, prices, and descriptions

Shopping Cart: Add/remove items, update quantities, view total

Checkout System: Complete checkout process with form validation

Responsive Design: Works on desktop, tablet, and mobile devices

Country Selection: Multiple countries supported including:

United States (US)

Canada (CA)

Czech Republic (CZ)

🎨 User Experience
Clean, modern UI with intuitive navigation

Real-time cart updates

Form validation with user feedback

Loading states and animations

Error handling and messages

🛠️ Technologies Used
Frontend: Next.js

Icons: Font Awesome

Fonts: Google Fonts (Open Sans)

Version Control: Git & GitHub

Deployment: GitHub Pages

📁 Project Structure
text
ecommerce-app/
├── index.html              # Main homepage
├── products.html           # Product listing page
├── cart.html              # Shopping cart page
├── checkout.html          # Checkout page (with country select)
├── style.css              # Main stylesheet
├── script.js              # Main JavaScript file
├── cart.js                # Cart functionality
├── checkout.js            # Checkout validation
├── assets/
│   ├── images/           # Product images
│   ├── icons/            # SVG icons
│   └── fonts/            # Custom fonts (if any)
└── README.md             # This file
🚀 Getting Started
Option 1: Use the Live Demo
Simply visit the GitHub Pages link above to use the deployed version.

Option 2: Run Locally
Clone the repository:

bash
git clone https://https://github.com/diwakar161/ecomm-app.git
Navigate to project folder:

bash
cd ecommerce-app
Open in browser:

Double-click index.html OR

Use Live Server extension in VS Code OR

Run local server: python -m http.server 8000

🔧 Setup & Installation
For Development:
Fork or clone this repository

Open in your favorite code editor (VS Code recommended)

Install Live Server extension for VS Code

Start editing - changes will auto-reload

File Structure Explanation:
index.html: Homepage with featured products

products.html: All products grid view

cart.html: Shopping cart with items and totals

checkout.html: Address form, payment, and country selection

style.css: All styling (responsive design, animations)

script.js: Core functionality and event listeners

🌍 Country Support
The app currently supports the following countries in checkout:

United States (Code: US)

Canada (Code: CA)

Czech Republic (Code: CZ)

To add more countries, edit the <select> element in checkout.html:

html
<option value="CODE">Country Name</option>
📱 Responsive Breakpoints
Mobile: < 768px

Tablet: 768px - 1024px

Desktop: > 1024px

🎯 Future Enhancements
Planned Features:
User authentication (login/register)

Product search and filtering

Product reviews and ratings

Payment gateway integration

Order history page

Admin dashboard

Dark mode toggle

Multi-language support

Technical Improvements:
Convert to React/Vue.js

Add backend API (Node.js/Python)

Database integration (MongoDB/PostgreSQL)

Add unit tests

Implement PWA features

🤝 Contributing
Contributions are welcome! Here's how:

Fork the repository

Create a feature branch: git checkout -b feature-name

Commit changes: git commit -m 'Add feature'

Push to branch: git push origin feature-name

Open a Pull Request

Guidelines:
Follow existing code style

Add comments for complex logic

Update documentation as needed

Test changes thoroughly

🐛 Troubleshooting
Issue	Solution
Page not loading	Check browser console for errors
Images not showing	Verify image paths in assets folder
Form not submitting	Check JavaScript console for validation errors
Cart not updating	Clear browser cache and localStorage
GitHub Pages 404	Ensure index.html is in root and Pages is enabled
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👥 Author
Diwakar Kumar Jha

GitHub: @yourusername

Portfolio: yourportfolio.com

Email: your.email@example.com

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const closeSidebarBtn = document.querySelector('.close-sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mainContent = document.querySelector('.main-content');
    const profileBtn = document.querySelector('.profile-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    // Chart Elements
    const websiteViewsChart = document.getElementById('websiteViewsChart');
    const dailySalesChart = document.getElementById('dailySalesChart');
    const tasksChart = document.getElementById('tasksChart');

    // Stats Elements
    const noOfBillsElement = document.getElementById('noOfBills');
    const totalBillPaidElement = document.getElementById('totalBillPaid');
    const noOfSuppliersElement = document.getElementById('noOfSuppliers');
    const totalExpenditureElement = document.getElementById('totalExpenditure');

    // Modal Elements
    const passwordModal = document.getElementById('passwordModal');
    const passwordForm = document.getElementById('passwordForm');
    const closeModalBtn = document.querySelector('.close-modal');

    // Toast Element
    const successToast = document.getElementById('successToast');

    // Mobile Navigation Toggle
    function toggleSidebar() {
        sidebar.classList.toggle('sidebar-active');
        document.body.classList.toggle('no-scroll');
        mobileNavToggle.setAttribute('aria-expanded', 
            mobileNavToggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
        );
    }

    mobileNavToggle?.addEventListener('click', toggleSidebar);
    closeSidebarBtn?.addEventListener('click', toggleSidebar);

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Update page title
            const pageTitle = document.querySelector('.page-title');
            pageTitle.textContent = link.querySelector('span').textContent;

            // Close sidebar on mobile after navigation
            if (window.innerWidth < 768) {
                toggleSidebar();
            }

            // Handle section display
            const section = link.dataset.section;
            handleSectionDisplay(section);
        });
    });

    // Section Display Handler
    function handleSectionDisplay(section) {
        // Hide all sections first
        const sections = document.querySelectorAll('.dashboard-content > div');
        sections.forEach(s => s.style.display = 'none');

        // Show requested section
        if (section === 'dashboard') {
            document.querySelector('.stats-grid').style.display = 'grid';
            document.querySelector('.charts-grid').style.display = 'grid';
            document.querySelector('.activity-grid').style.display = 'grid';
            updateDashboardStats();
        } else {
            // Show other sections as needed
            const targetSection = document.querySelector(`.${section}-section`);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        }
    }

    // Profile Dropdown Toggle
    profileBtn?.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileBtn?.contains(e.target)) {
            dropdownMenu?.classList.remove('show');
        }
    });

    // Password Modal Handlers
    function showModal() {
        passwordModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        passwordModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    document.querySelector('[data-action="change-password"]')?.addEventListener('click', showModal);
    closeModalBtn?.addEventListener('click', hideModal);

    // Password Form Handler
    passwordForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add password change logic here
        hideModal();
        showToast('Password updated successfully');
    });

    // Toast Handler
    function showToast(message) {
        const toast = successToast;
        toast.querySelector('.toast-message').textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Dashboard Stats Update
    function updateDashboardStats() {
        // Fetch data from localStorage
        const bills = JSON.parse(localStorage.getItem('bills')) || [];
        const suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
        
        // Update stats
        noOfBillsElement.textContent = bills.length;
        noOfSuppliersElement.textContent = suppliers.length;
        
        const totalPaid = bills.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
        totalBillPaidElement.textContent = totalPaid.toFixed(2);
        totalExpenditureElement.textContent = totalPaid.toFixed(2);
        
        // Update charts
        updateCharts();
    }

    // Chart Updates
    function updateCharts() {
        // Sample data - Replace with actual data
        const websiteData = [
            { month: 'Jan', views: 1000 },
            { month: 'Feb', views: 1500 },
            { month: 'Mar', views: 1200 },
            // Add more data points
        ];

        const salesData = [
            { day: 'Mon', sales: 500 },
            { day: 'Tue', sales: 700 },
            { day: 'Wed', sales: 600 },
            // Add more data points
        ];

        const tasksData = [
            { week: 'W1', completed: 20 },
            { week: 'W2', completed: 25 },
            { week: 'W3', completed: 18 },
            // Add more data points
        ];

        // Implement chart updates using your preferred charting library
        // Example using a simple canvas or SVG-based visualization
    }

    // Search Functionality
    searchInput?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Implement search functionality
    });

    searchBtn?.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        // Implement search trigger
    });

    // Data Management Functions
    function getBills() {
        return JSON.parse(localStorage.getItem('bills')) || [];
    }

    function getSuppliers() {
        return JSON.parse(localStorage.getItem('suppliers')) || [];
    }

    function saveBill(billData) {
        const bills = getBills();
        bills.push(billData);
        localStorage.setItem('bills', JSON.stringify(bills));
        updateDashboardStats();
    }

    function saveSupplier(supplierData) {
        const suppliers = getSuppliers();
        suppliers.push(supplierData);
        localStorage.setItem('suppliers', JSON.stringify(suppliers));
        updateDashboardStats();
    }

    // Error Handler
    function handleError(error, context) {
        console.error(`Error in ${context}:`, error);
        showToast(`An error occurred while ${context}. Please try again.`);
    }

    // Initialization
    function initialize() {
        try {
            // Set initial active section
            handleSectionDisplay('dashboard');
            
            // Update dashboard stats
            updateDashboardStats();
            
            // Add responsive handlers
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    sidebar?.classList.remove('sidebar-active');
                    document.body.classList.remove('no-scroll');
                }
            });

        } catch (error) {
            handleError(error, 'initializing dashboard');
        }
    }

    // Call initialize
    initialize();
});
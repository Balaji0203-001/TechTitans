document.addEventListener('DOMContentLoaded', () => {
    // Variable Declarations
    const viewBillsLink = document.getElementById('viewBills');
    const searchBillsLink = document.getElementById('searchBills');
    const addSupplierLink = document.getElementById('addSupplier');
    const viewSuppliersLink = document.getElementById('viewSuppliers');
    const showTotalsLink = document.getElementById('showTotals');
    const addBillButtonLink = document.getElementById('addBillButton');
    const logoutButton = document.getElementById('logoutButton');
    const dashboardLink = document.getElementById('dashboardLink');

    const billSection = document.getElementById('billSection');
    const totalsSection = document.getElementById('totalsSection');
    const searchSection = document.getElementById('searchSection');
    const addBillSection = document.getElementById('addBillSection');
    const addSupplierSection = document.getElementById('addSupplierSection');
    const supplierSection = document.getElementById('supplierSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const sections = [billSection, totalsSection, searchSection, addBillSection, addSupplierSection, supplierSection, dashboardSection];

    // Form and Input Elements
    const addBillForm = document.getElementById('addBillForm');
    const addSupplierForm = document.getElementById('addSupplierForm');
    const addMoreItemsButton = document.getElementById('addMoreItemsButton');
    const itemsSection = document.getElementById('itemsSection');
    const amountInput = document.getElementById('amount');
    const billImage = document.getElementById('billImage');
    const imagePreview = document.getElementById('imagePreview');
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');

    // Table Body Elements
    const billsTableBody = document.getElementById('billsTableBody');
    const suppliersTableBody = document.getElementById('suppliersTableBody');
    const searchResultsTableBody = document.getElementById('searchResults');

    // Loading Spinners
    const loadingSpinnerBill = document.getElementById('loadingSpinnerBill');
    const loadingSpinnerSupplier = document.getElementById('loadingSpinnerSupplier');

    // Dashboard Elements
    const noOfBillsElement = document.getElementById('noOfBills');
    const noOfSuppliersElement = document.getElementById('noOfSuppliers');
    const totalBillPaidElement = document.getElementById('totalBillPaid');
    const totalExpenditureElement = document.getElementById('totalExpenditure');
    const remainingBalanceElement = document.getElementById('remainingBalance');
    const totalAmountDisplay = document.getElementById('totalAmount');

    const userInfo = document.getElementById('user-info-toggle');
    const dropdown = document.getElementById('user-dropdown');
    const profileLink = document.getElementById('profile-link');
    const passwordLink = document.getElementById('password-link');
    const logoutLink = document.getElementById('logout-link');
    const toast = document.getElementById('toast');
    const toastContent = document.getElementById('toast-content');

    // User Info and Dropdown Functionality
    if (userInfo && dropdown && profileLink && passwordLink && logoutLink && toast && toastContent) {
        userInfo.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });

        window.addEventListener('click', (event) => {
            if (!userInfo.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });

        function showToast(message) {
            toastContent.innerHTML = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            showToast("<div><h2>Profile</h2><p>User details go here...</p></div>");
        });

        passwordLink.addEventListener('click', (event) => {
            event.preventDefault();
            showToast(`<div><h2>Change Password</h2>
            <input type="password" placeholder="Old Password">
            <input type="password" placeholder="New Password">
            <input type="password" placeholder="Confirm Password">
            <button>Change Password</button>
            </div>`);
        });

        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = "index.html";
        });
    }

    // Modal for Items
    const modalHTML = `
    <div id="itemsModal" class="modal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);">
        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 600px; border-radius: 8px;">
            <span class="close" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
            <h2>Bill Items</h2>
            <div id="itemsList"></div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Styles for New Buttons
    const style = document.createElement('style');
    style.textContent = `
        .view-items-button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
        }
        .view-items-button:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(style);

    // Helper Functions
    function showSection(sectionToShow) {
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('animate__animated', 'animate__fadeIn');
        });
        sectionToShow.style.display = 'block';
        sectionToShow.classList.add('animate__animated', 'animate__fadeIn');
        sectionToShow.addEventListener('animationend', () => {
            sectionToShow.classList.remove('animate__animated', 'animate__fadeIn');
        }, { once: true });
    }

    function setActiveLink(activeLink) {
        const sidebarLinks = document.querySelectorAll('.sidebar a');
        sidebarLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    function calculateTotal() {
        let total = 0;
        const itemRows = itemsSection.querySelectorAll('.item-row');
        itemRows.forEach(row => {
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            total += quantity * price;
        });
        amountInput.value = total.toFixed(2);
    }

    // Display Functions
    function showItems(items) {
        const modal = document.getElementById('itemsModal');
        const itemsList = document.getElementById('itemsList');

        let itemsHTML = `
            <table class="items-table" style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item Name</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Quantity</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Price</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>`;

        items.forEach(item => {
            const total = parseFloat(item.quantity) * parseFloat(item.price);
            itemsHTML += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.quantity}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${parseFloat(item.price).toFixed(2)}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${total.toFixed(2)}</td>
                </tr>`;
        });

        itemsHTML += '</tbody></table>';
        itemsList.innerHTML = itemsHTML;
        modal.style.display = 'block';
    }

    function displayBills() {
        billsTableBody.innerHTML = '';
        const bills = JSON.parse(localStorage.getItem('bills')) || [];
        bills.forEach((bill, index) => {
            const row = billsTableBody.insertRow();
            const shopCell = row.insertCell();
            const paidByCell = row.insertCell();
            const returnPaidByCell = row.insertCell();
            const amountCell = row.insertCell();
            const dateCell = row.insertCell();
            const actionsCell = row.insertCell();

            shopCell.textContent = bill.shopName;
            paidByCell.textContent = bill.paidBy;
            returnPaidByCell.textContent = bill.returnPaidBy || "-";
            amountCell.textContent = `₹${parseFloat(bill.amount).toFixed(2)}`;
            dateCell.textContent = bill.billDate;

            actionsCell.innerHTML = `
                <button class="view-items-button" data-index="${index}">
                    <i class="fas fa-eye"></i> View Items
                </button>
                <button class="delete-button" data-index="${index}">
                    <i class="fas fa-trash"></i> Delete
                </button>`;
        });

        attachBillDeleteListeners();
        attachViewItemsListeners();
    }

    function displaySuppliers() {
        suppliersTableBody.innerHTML = '';
        const suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
        suppliers.forEach((supplier, index) => {
            const row = suppliersTableBody.insertRow();
            const nameCell = row.insertCell();
            const contactCell = row.insertCell();
            const shopCell = row.insertCell();
            const addressCell = row.insertCell();
            const actionsCell = row.insertCell();

            nameCell.textContent = supplier.supplierName;
            contactCell.textContent = supplier.supplierContact;
            shopCell.textContent = supplier.supplierShop;
            addressCell.innerHTML = supplier.supplierAddress ?
                `<a href="${supplier.supplierAddress}" target="_blank" class="map-link">
                    <i class="fas fa-map-marker-alt"></i> View on Map
                </a>` : "-";
            actionsCell.innerHTML = `
                <button class="delete-button" data-index="${index}">
                    <i class="fas fa-trash"></i> Delete
                </button>`;
        });

        attachSupplierDeleteListeners();
    }

    function searchBillsFunction() {
        const searchTerm = searchInput.value.toLowerCase(); // Text entered by the user
        const filterValue = filterSelect.value; // Number of days selected in the filter
        const bills = JSON.parse(localStorage.getItem('bills')) || []; // Fetch stored bills
    
        // Filter the bills based on search term and date condition
        const filteredBills = bills.filter(bill => {
            let dateFilterCondition = true;
    
            // Apply the date filter only if filterValue is not 'all'
            if (filterValue !== 'all') {
                const billDate = new Date(bill.billDate); // Convert bill date to Date object
                const today = new Date(); // Get today's date
                const diffTime = today - billDate; // Difference in milliseconds
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
    
                // Check if the bill date is within the selected number of days
                dateFilterCondition = diffDays <= parseInt(filterValue) && diffTime >= 0;
            }
    
            // Search by shop name or amount, and apply the date filter
            return (
                (bill.shopName.toLowerCase().includes(searchTerm) ||
                    bill.amount.toString().includes(searchTerm)) &&
                dateFilterCondition
            );
        });
    
        displaySearchResults(filteredBills); // Display the filtered bills
    }
    
    function displaySearchResults(bills) {
        searchResultsTableBody.innerHTML = ""; // Clear previous results
    
        // Populate the table with filtered bills
        bills.forEach(bill => {
            const row = searchResultsTableBody.insertRow();
            const shopCell = row.insertCell();
            const amountCell = row.insertCell();
            const dateCell = row.insertCell();
    
            shopCell.textContent = bill.shopName;
            amountCell.textContent = `₹${parseFloat(bill.amount).toFixed(2)}`;
            dateCell.textContent = bill.billDate;
        });
    }
    

    function updateDashboardValues() {
        const bills = JSON.parse(localStorage.getItem('bills')) || [];
        const suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
        const totalExpenditure = bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
        const totalBillPaid = bills.length;
        const remainingBalance = 60000 - totalExpenditure; // Assuming budget is 60000

        noOfBillsElement.textContent = bills.length;
        noOfSuppliersElement.textContent = suppliers.length;
        totalBillPaidElement.textContent = totalBillPaid;
        totalExpenditureElement.textContent = `₹${totalExpenditure.toFixed(2)}`;
        remainingBalanceElement.textContent = `₹${remainingBalance.toFixed(2)}`;
    }

    function showTotalsFunction() {
        const bills = JSON.parse(localStorage.getItem('bills')) || [];
        const totalAmount = bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
        totalAmountDisplay.textContent = `Total Amount: ₹${totalAmount.toFixed(2)}`;
    }

    // Event Listener Attachment Functions
    function attachBillDeleteListeners() {
        const deleteButtons = document.querySelectorAll('#billsTableBody .delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this bill?')) {
                    const index = parseInt(button.dataset.index);
                    let bills = JSON.parse(localStorage.getItem('bills')) || [];
                    bills.splice(index, 1);
                    localStorage.setItem('bills', JSON.stringify(bills));
                    displayBills();
                    updateDashboardValues();
                }
            });
        });
    }

    function attachViewItemsListeners() {
        const viewButtons = document.querySelectorAll('.view-items-button');
        const modal = document.getElementById('itemsModal');
        const closeBtn = document.querySelector('.close');

        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                const bills = JSON.parse(localStorage.getItem('bills')) || [];
                const bill = bills[index];
                if (bill.items && bill.items.length > 0) {
                    showItems(bill.items);
                } else {
                    showItems([{ name: 'No items found', quantity: '-', price: '-' }]);
                }
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    function attachSupplierDeleteListeners() {
        const deleteButtons = document.querySelectorAll('#suppliersTableBody .delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this supplier?')) {
                    const index = parseInt(button.dataset.index);
                    let suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
                    suppliers.splice(index, 1);
                    localStorage.setItem('suppliers', JSON.stringify(suppliers));
                    displaySuppliers();
                    updateDashboardValues();
                }
            });
        });
    }

    // Event Listeners for Adding Items
    addMoreItemsButton.addEventListener('click', () => {
        const newItemRow = document.createElement('div');
        newItemRow.classList.add('item-row');
        newItemRow.innerHTML = `
            <input type="text" class="item-name" placeholder="Item Name" required>
            <input type="number" class="item-quantity" placeholder="No of Quantity" required>
            <input type="number" class="item-price" placeholder="Price per item" required>
            <button type="button" class="remove-item-button">
                <i class="fas fa-times"></i>
            </button>
        `;
        itemsSection.appendChild(newItemRow);

        const quantityInput = newItemRow.querySelector('.item-quantity');
        const priceInput = newItemRow.querySelector('.item-price');
        quantityInput.addEventListener('input', calculateTotal);
        priceInput.addEventListener('input', calculateTotal);

        const removeButton = newItemRow.querySelector('.remove-item-button');
        removeButton.addEventListener('click', () => {
            newItemRow.remove();
            calculateTotal();
        });

        calculateTotal();
    });

    // Image Preview Functionality
    billImage.addEventListener('change', () => {
        const file = billImage.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Bill Preview">`;
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    });

    // Form Submission Handlers
    addBillForm.addEventListener('submit', (event) => {
        event.preventDefault();
        loadingSpinnerBill.style.display = 'block';

        setTimeout(() => {
            const billData = {
                shopName: document.getElementById('shopName').value,
                paidBy: document.getElementById('paidBy').value,
                returnPaidBy: document.getElementById('returnPaidBy').value,
                billDate: document.getElementById('billDate').value,
                amount: document.getElementById('amount').value,
                items: Array.from(itemsSection.querySelectorAll('.item-row')).map(row => ({
                    name: row.querySelector('.item-name').value,
                    quantity: row.querySelector('.item-quantity').value,
                    price: row.querySelector('.item-price').value
                }))
            };

            let bills = JSON.parse(localStorage.getItem('bills')) || [];
            bills.push(billData);
            localStorage.setItem('bills', JSON.stringify(bills));

            addBillForm.reset();
            itemsSection.innerHTML = '';
            imagePreview.innerHTML = '';
            calculateTotal();
            loadingSpinnerBill.style.display = 'none';
            updateDashboardValues();
            displayBills();

            alert('Bill added successfully!');
            showSection(dashboardSection);
            setActiveLink(dashboardLink);
        }, 1000);
    });

    addSupplierForm.addEventListener('submit', (event) => {
        event.preventDefault();
        loadingSpinnerSupplier.style.display = 'block';

        setTimeout(() => {
            const supplierData = {
                supplierName: document.getElementById('supplierName').value,
                supplierContact: document.getElementById('supplierContact').value,
                supplierShop: document.getElementById('supplierShop').value,
                supplierAddress: document.getElementById('supplierAddress').value
            };

            let suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
            suppliers.push(supplierData);
            localStorage.setItem('suppliers', JSON.stringify(suppliers));

            addSupplierForm.reset();
            loadingSpinnerSupplier.style.display = 'none';
            updateDashboardValues();
            displaySuppliers();

            alert('Supplier added successfully!');
            showSection(dashboardSection);
            setActiveLink(dashboardLink);
        }, 1000);
    });

    // Navigation Event Listeners
    viewBillsLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(billSection);
        setActiveLink(viewBillsLink);
        displayBills();
    });

    searchBillsLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(searchSection);
        setActiveLink(searchBillsLink);
        searchBillsFunction();
    });

    addSupplierLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(addSupplierSection);
        setActiveLink(addSupplierLink);
    });

    viewSuppliersLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(supplierSection);
        setActiveLink(viewSuppliersLink);
        displaySuppliers();
    });

    showTotalsLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(totalsSection);
        setActiveLink(showTotalsLink);
        showTotalsFunction();
    });

    addBillButtonLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(addBillSection);
        setActiveLink(addBillButtonLink);
    });

    dashboardLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(dashboardSection);
        setActiveLink(dashboardLink);
        updateDashboardValues();
    });

    logoutButton.addEventListener('click', () => {
        logoutButton.disabled = true;
        const originalText = logoutButton.textContent;
        logoutButton.textContent = "Logging Out...";

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    });

    // Search and Filter Event Listeners
    filterSelect.addEventListener('change', searchBillsFunction);
    searchInput.addEventListener('input', searchBillsFunction);

    // Items Section Event Listener for Calculating Total
    itemsSection.addEventListener('input', (event) => {
        if (event.target.classList.contains('item-quantity') ||
            event.target.classList.contains('item-price')) {
            calculateTotal();
        }
    });

    // Export Functionality
    function exportData() {
        const bills = JSON.parse(localStorage.getItem('bills')) || [];
        const suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];

        const data = {
            bills: bills,
            suppliers: suppliers,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `billwise_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Import Functionality
    async function importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (data.bills && Array.isArray(data.bills)) {
                localStorage.setItem('bills', JSON.stringify(data.bills));
            }

            if (data.suppliers && Array.isArray(data.suppliers)) {
                localStorage.setItem('suppliers', JSON.stringify(data.suppliers));
            }

            updateDashboardValues();
            displayBills();
            displaySuppliers();
            alert('Data imported successfully!');
        } catch (error) {
            alert('Error importing data. Please make sure the file is valid.');
            console.error('Import error:', error);
        }
    }

    // Add Event Listener for File Import
    const importInput = document.getElementById('importInput');
    if (importInput) {
        importInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                importData(file);
            }
        });
    }

    // Add Event Listener for Export
    const exportButton = document.getElementById('exportButton');
    if (exportButton) {
        exportButton.addEventListener('click', exportData);
    }

    // Error Handling Function
    function handleError(error, context) {
        console.error(`Error in ${context}:`, error);
        alert(`An error occurred while ${context}. Please try again.`);
    }

    // Data Validation Functions
    function validateBillData(billData) {
        return billData.shopName &&
            billData.amount &&
            !isNaN(parseFloat(billData.amount)) &&
            billData.billDate;
    }

    function validateSupplierData(supplierData) {
        return supplierData.supplierName &&
            supplierData.supplierContact &&
            supplierData.supplierShop;
    }

    // Initialize Tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseover', (e) => {
            const tip = document.createElement('div');
            tip.className = 'tooltip';
            tip.textContent = e.target.dataset.tooltip;
            document.body.appendChild(tip);

            const rect = e.target.getBoundingClientRect();
            tip.style.top = rect.bottom + 'px';
            tip.style.left = rect.left + 'px';
        });

        tooltip.addEventListener('mouseout', () => {
            const tips = document.querySelectorAll('.tooltip');
            tips.forEach(tip => tip.remove());
        });
    });

    // Initial Setup
    function initialize() {
        try {
            updateDashboardValues();
            displayBills();
            displaySuppliers();
            showSection(dashboardSection);
            setActiveLink(dashboardLink);

            // Set default date to today for new bills
            const billDateInput = document.getElementById('billDate');
            if (billDateInput) {
                billDateInput.valueAsDate = new Date();
            }
        } catch (error) {
            handleError(error, 'initializing application');
        }
    }

    // Call Initialize Function When the Page Loads
    initialize();
});

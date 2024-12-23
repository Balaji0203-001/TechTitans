// Google Apps Script deployment URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzbae-6qiXdJmNt_G5IjMZQ55UgclzLxEq1wVbFQ2-6VyT3pymBkMY4adrMOsWXS_IA/exec';

// Form switching
document.getElementById('show-signin').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('signin-container').style.display = 'block';
});

document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signin-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
});

// Sign Up Form Handler
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const signupButton = document.getElementById('signup-btn');
    signupButton.classList.add('loading');
    signupButton.disabled = true;

    // Get form values
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const retypePassword = document.getElementById('signup-retype-password').value;

    // Reset error states
    document.getElementById('signup-error').style.display = 'none';
    document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));

    // Validate passwords match
    if (password !== retypePassword) {
        document.getElementById('signup-password').classList.add('error-input');
        document.getElementById('signup-retype-password').classList.add('error-input');
        document.getElementById('signup-error').style.display = 'block';
        document.getElementById('signup-error').textContent = 'Passwords do not match';
        signupButton.classList.remove('loading');
        signupButton.disabled = false;
        return;
    }

    // Validate password strength (minimum 8 characters, at least one number)
    if (password.length < 8 || !/\d/.test(password)) {
        document.getElementById('signup-password').classList.add('error-input');
        document.getElementById('signup-error').style.display = 'block';
        document.getElementById('signup-error').textContent = 'Password must be at least 8 characters long and contain at least one number';
        signupButton.classList.remove('loading');
        signupButton.disabled = false;
        return;
    }

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        });

        document.getElementById('signup-error').style.display = 'block';
        document.getElementById('signup-error').style.color = '#4CAF50';
        document.getElementById('signup-error').textContent = 'Sign up successful!';
        
        // Clear form
        document.getElementById('signup-form').reset();
    } catch (error) {
        document.getElementById('signup-error').style.display = 'block';
        document.getElementById('signup-error').style.color = '#ff4444';
        document.getElementById('signup-error').textContent = 'Error signing up. Please try again.';
    }

    signupButton.classList.remove('loading');
    signupButton.disabled = false;
});

// Sign In Form Handler
document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const signinButton = document.getElementById('signin-btn');
    signinButton.classList.add('loading');
    signinButton.disabled = true;
    
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;

    try {
        const response = await fetch(`${SCRIPT_URL}?action=verify`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        });

        document.getElementById('signin-error').style.display = 'block';
        document.getElementById('signin-error').style.color = '#4CAF50';
        document.getElementById('signin-error').textContent = 'Sign in successful!';

        // Redirect to a new page
        window.location.href = 'dashboard.html'; // Replace 'dashboard.html' with your desired file
    } catch (error) {
        document.getElementById('signin-error').style.display = 'block';
        document.getElementById('signin-error').style.color = '#ff4444';
        document.getElementById('signin-error').textContent = 'Invalid username or password.';
    }

    signinButton.classList.remove('loading');
    signinButton.disabled = false;
});
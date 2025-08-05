document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding form
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tab}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Form validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function validateSignupPassword(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers;
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        input.classList.add('error');
        errorMessage.textContent = message;
        errorMessage.classList.add('active');
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        input.classList.remove('error');
        errorMessage.classList.remove('active');
    }

    // API functions
    async function loginUser(email, password) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (error) {
            throw error;
        }
    }

    async function signupUser(name, email, password) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Form submission handling
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        let isValid = true;

        // Clear previous errors
        clearError(email);
        clearError(password);

        // Validate email
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!validatePassword(password.value)) {
            showError(password, 'Password must be at least 6 characters long');
            isValid = false;
        }

        if (isValid) {
            try {
                // Show loading state
                const submitBtn = loginForm.querySelector('.auth-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

                // Attempt login
                await loginUser(email.value, password.value);
                
                // Redirect to dashboard
                window.location.href = 'index.html';
            } catch (error) {
                // Show error message
                showError(password, error.message);
                // Reset button
                const submitBtn = loginForm.querySelector('.auth-btn');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Login';
            }
        }
    });

    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName');
        const email = document.getElementById('signupEmail');
        const password = document.getElementById('signupPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        let isValid = true;

        // Clear previous errors
        clearError(name);
        clearError(email);
        clearError(password);
        clearError(confirmPassword);

        // Validate name
        if (name.value.trim().length < 2) {
            showError(name, 'Please enter your full name');
            isValid = false;
        }

        // Validate email
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!validateSignupPassword(password.value)) {
            showError(password, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
            isValid = false;
        }

        // Validate password confirmation
        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        if (isValid) {
            try {
                // Show loading state
                const submitBtn = signupForm.querySelector('.auth-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

                // Attempt signup
                await signupUser(name.value, email.value, password.value);
                
                // Redirect to dashboard
                window.location.href = 'index.html';
            } catch (error) {
                // Show error message
                showError(email, error.message);
                // Reset button
                const submitBtn = signupForm.querySelector('.auth-btn');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Sign Up';
            }
        }
    });

    // Google Sign-in handling
    const googleButtons = document.querySelectorAll('.google-btn');
    
    googleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Show loading state
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting to Google...';

            // For now, just show an error message
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google"> Google';
                alert('Google Sign-in is not implemented yet');
            }, 1500);
        });
    });

    // Real-time validation
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearError(this);
            
            if (this.type === 'email' && !validateEmail(this.value)) {
                showError(this, 'Please enter a valid email address');
            }
            
            if (this.id === 'loginPassword' && !validatePassword(this.value)) {
                showError(this, 'Password must be at least 6 characters long');
            }
            
            if (this.id === 'signupPassword' && !validateSignupPassword(this.value)) {
                showError(this, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
            }
            
            if (this.id === 'confirmPassword' && this.value !== document.getElementById('signupPassword').value) {
                showError(this, 'Passwords do not match');
            }
        });
    });
}); 
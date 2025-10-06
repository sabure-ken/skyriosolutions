// =========================
// Form Handling & Validation
// =========================

class FormHandler {
    constructor(formId, options = {}) {
        this.form = document.getElementById(formId);
        this.options = {
            successMessage: options.successMessage || 'Message sent successfully! We will get back to you soon.',
            errorMessage: options.errorMessage || 'Please check the form and try again.',
            showToast: options.showToast !== false,
            ...options
        };
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.fields = this.getFormFields();
        this.setupValidation();
        this.setupSubmission();
    }

    getFormFields() {
        const fields = {};
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.name) {
                fields[input.name] = {
                    element: input,
                    rules: this.getValidationRules(input),
                    isValid: true
                };
            }
        });
        
        return fields;
    }

    getValidationRules(input) {
        const rules = [];
        
        if (input.required) {
            rules.push({
                type: 'required',
                message: 'This field is required'
            });
        }
        
        if (input.type === 'email') {
            rules.push({
                type: 'email',
                message: 'Please enter a valid email address'
            });
        }
        
        if (input.type === 'tel') {
            rules.push({
                type: 'phone',
                message: 'Please enter a valid phone number'
            });
        }
        
        if (input.minLength) {
            rules.push({
                type: 'minLength',
                value: input.minLength,
                message: `Must be at least ${input.minLength} characters`
            });
        }
        
        return rules;
    }

    setupValidation() {
        Object.values(this.fields).forEach(field => {
            field.element.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.element.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });
    }

    setupSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    validateField(field) {
        const value = field.element.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        for (const rule of field.rules) {
            switch (rule.type) {
                case 'required':
                    if (!value) {
                        isValid = false;
                        errorMessage = rule.message;
                    }
                    break;
                    
                case 'email':
                    if (value && !this.isValidEmail(value)) {
                        isValid = false;
                        errorMessage = rule.message;
                    }
                    break;
                    
                case 'phone':
                    if (value && !this.isValidPhone(value)) {
                        isValid = false;
                        errorMessage = rule.message;
                    }
                    break;
                    
                case 'minLength':
                    if (value && value.length < rule.value) {
                        isValid = false;
                        errorMessage = rule.message;
                    }
                    break;
            }
            
            if (!isValid) break;
        }
        
        field.isValid = isValid;
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }

    validateAllFields() {
        let allValid = true;
        
        Object.values(this.fields).forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        return allValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.element.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'form-feedback error';
        errorElement.textContent = message;
        
        field.element.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.element.classList.remove('error');
        
        const existingError = field.element.parentNode.querySelector('.form-feedback.error');
        if (existingError) {
            existingError.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    async handleSubmit() {
        // Validate all fields
        if (!this.validateAllFields()) {
            this.showToast(this.options.errorMessage, 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Prepare form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send to your backend
            // For now, we'll simulate an API call
            await this.sendToBackend(data);
            
            // Success
            this.showSuccess();
            
        } catch (error) {
            // Error handling
            this.showError(error.message || 'An error occurred while sending your message.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async sendToBackend(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, we'll randomly fail 10% of the time
        if (Math.random() < 0.1) {
            throw new Error('Network error. Please try again.');
        }
        
        // In a real application, you would send to your backend:
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        
        return response.json();
        */
        
        return { success: true };
    }

    showSuccess() {
        // Reset form
        this.form.reset();
        
        // Show success message
        this.showToast(this.options.successMessage, 'success');
        
        // Clear all field errors
        Object.values(this.fields).forEach(field => {
            this.clearFieldError(field);
        });
        
        // Trigger success event
        this.form.dispatchEvent(new CustomEvent('form:success', {
            bubbles: true,
            detail: { form: this.form }
        }));
    }

    showError(message) {
        this.showToast(message, 'error');
        
        // Trigger error event
        this.form.dispatchEvent(new CustomEvent('form:error', {
            bubbles: true,
            detail: { form: this.form, message }
        }));
    }

    showToast(message, type = 'info') {
        if (!this.options.showToast) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add styles if toast doesn't exist
        if (!document.querySelector('.toast')) {
            this.addToastStyles();
        }
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }

    addToastStyles() {
        const styles = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                transform: translateX(100%);
                transition: transform 0.3s ease;
                z-index: 10000;
                max-width: 400px;
            }
            
            .toast.show {
                transform: translateX(0);
            }
            
            .toast-success {
                background: #10b981;
            }
            
            .toast-error {
                background: #ef4444;
            }
            
            .toast-info {
                background: #3b82f6;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setLoadingState(loading) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        
        if (submitButton) {
            if (loading) {
                submitButton.classList.add('form-loading');
                submitButton.disabled = true;
                submitButton.setAttribute('aria-busy', 'true');
            } else {
                submitButton.classList.remove('form-loading');
                submitButton.disabled = false;
                submitButton.removeAttribute('aria-busy');
            }
        }
        
        this.form.classList.toggle('form-loading', loading);
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        new FormHandler('contactForm', {
            successMessage: 'Message sent successfully! We will get back to you within 24 hours.',
            errorMessage: 'Please check the form and try again.',
            showToast: true
        });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandler;
}
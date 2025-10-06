// =========================
// Modal Management
// =========================

class Modal {
    constructor(modalId, options = {}) {
        this.modal = document.getElementById(modalId);
        this.options = {
            closeOnBackdrop: options.closeOnBackdrop !== false,
            closeOnEsc: options.closeOnEsc !== false,
            animate: options.animate !== false,
            ...options
        };
        
        if (this.modal) {
            this.init();
        }
    }

    init() {
        this.backdrop = this.modal.querySelector('.modal-backdrop');
        this.content = this.modal.querySelector('.modal-content');
        this.closeBtn = this.modal.querySelector('.modal-close');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close on backdrop click
        if (this.options.closeOnBackdrop && this.backdrop) {
            this.backdrop.addEventListener('click', (e) => {
                if (e.target === this.backdrop) {
                    this.close();
                }
            });
        }
        
        // Close on button click
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Close on ESC key
        if (this.options.closeOnEsc) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen()) {
                    this.close();
                }
            });
        }
    }

    open() {
        if (this.isOpen()) return;
        
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Trigger animation
        if (this.options.animate) {
            setTimeout(() => {
                this.modal.classList.add('active');
                if (this.content) {
                    this.content.classList.add('active');
                }
            }, 10);
        }
        
        // Dispatch open event
        this.modal.dispatchEvent(new CustomEvent('modal:open', {
            bubbles: true
        }));
    }

    close() {
        if (!this.isOpen()) return;
        
        // Trigger close animation
        if (this.options.animate) {
            this.modal.classList.remove('active');
            if (this.content) {
                this.content.classList.remove('active');
            }
            
            setTimeout(() => {
                this.modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        } else {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        // Dispatch close event
        this.modal.dispatchEvent(new CustomEvent('modal:close', {
            bubbles: true
        }));
    }

    isOpen() {
        return this.modal.style.display === 'flex';
    }

    setContent(content) {
        if (this.content) {
            this.content.innerHTML = content;
        }
    }
}

// Modal Manager to handle multiple modals
class ModalManager {
    constructor() {
        this.modals = new Map();
        this.init();
    }

    init() {
        // Initialize all modals on the page
        const modalElements = document.querySelectorAll('.modal-backdrop');
        modalElements.forEach(modal => {
            const modalId = modal.id;
            if (modalId) {
                this.register(modalId);
            }
        });
        
        // Add global click handler for modal triggers
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-modal]');
            if (trigger) {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                this.open(modalId);
            }
        });
    }

    register(modalId, options = {}) {
        if (!this.modals.has(modalId)) {
            const modal = new Modal(modalId, options);
            this.modals.set(modalId, modal);
            return modal;
        }
        return this.modals.get(modalId);
    }

    open(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.open();
        }
    }

    close(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.close();
        }
    }

    closeAll() {
        this.modals.forEach(modal => {
            if (modal.isOpen()) {
                modal.close();
            }
        });
    }
}

// Global modal manager instance
const modalManager = new ModalManager();

// Utility functions for modal content
const ModalContent = {
    privacy: `
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">×</button>
            <h2>Privacy Policy</h2>
            <div class="modal-body">
                <p class="muted">Last updated: August 2025</p>
                
                <h3>Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you contact us through our website:</p>
                <ul>
                    <li>Name and contact information (email, phone number)</li>
                    <li>Company information</li>
                    <li>Project details and requirements</li>
                    <li>Any other information you choose to provide</li>
                </ul>
                
                <h3>How We Use Your Information</h3>
                <p>We use the information we collect to:</p>
                <ul>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Send you proposals and project estimates</li>
                    <li>Communicate with you about our services</li>
                    <li>Improve our website and services</li>
                </ul>
                
                <h3>Data Security</h3>
                <p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
                
                <h3>Contact Us</h3>
                <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@skyriosolutions.com">hello@skyriosolutions.com</a>.</p>
            </div>
        </div>
    `,
    
    terms: `
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">×</button>
            <h2>Terms of Service</h2>
            <div class="modal-body">
                <p class="muted">Last updated: August 2025</p>
                
                <h3>Agreement to Terms</h3>
                <p>By accessing our website and using our services, you agree to be bound by these Terms of Service.</p>
                
                <h3>Services</h3>
                <p>SkyrioSolutions provides web development, mobile app development, digital marketing, and related services as described on our website.</p>
                
                <h3>Payment Terms</h3>
                <p>Unless otherwise agreed in writing:</p>
                <ul>
                    <li>50% deposit required before project commencement</li>
                    <li>Remaining balance due upon project completion</li>
                    <li>Recurring services billed monthly in advance</li>
                </ul>
                
                <h3>Intellectual Property</h3>
                <p>Upon full payment, clients receive ownership of the delivered work. We retain the right to display the work in our portfolio unless otherwise agreed.</p>
                
                <h3>Limitation of Liability</h3>
                <p>To the maximum extent permitted by law, SkyrioSolutions shall not be liable for any indirect, incidental, or consequential damages.</p>
                
                <h3>Changes to Terms</h3>
                <p>We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of the modified terms.</p>
            </div>
        </div>
    `
};

// Function to open modal with specific content
function openModal(type) {
    const modalId = 'genericModal';
    
    // Create generic modal if it doesn't exist
    if (!document.getElementById(modalId)) {
        const modalHTML = `
            <div id="${modalId}" class="modal-backdrop">
                <div class="modal"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Register the modal
        modalManager.register(modalId, {
            closeOnBackdrop: true,
            closeOnEsc: true,
            animate: true
        });
    }
    
    // Set content and open
    const modal = modalManager.modals.get(modalId);
    if (modal && ModalContent[type]) {
        modal.setContent(ModalContent[type]);
        modal.open();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const modalStyles = `
            <style>
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    padding: 20px;
                }
                
                .modal-backdrop.active {
                    background: rgba(0, 0, 0, 0.6);
                }
                
                .modal {
                    background: white;
                    border-radius: 12px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 80vh;
                    overflow: auto;
                    transform: scale(0.7);
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                
                .modal.active {
                    transform: scale(1);
                    opacity: 1;
                }
                
                .modal-content {
                    padding: 2rem;
                    position: relative;
                }
                
                .modal-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #6b7280;
                    padding: 0.5rem;
                }
                
                .modal-close:hover {
                    color: #374151;
                }
                
                .modal h2 {
                    margin-bottom: 1rem;
                    color: #1f2937;
                }
                
                .modal h3 {
                    margin: 1.5rem 0 0.5rem;
                    color: #374151;
                }
                
                .modal-body {
                    line-height: 1.6;
                }
                
                .modal-body ul {
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                }
                
                .modal-body li {
                    margin-bottom: 0.5rem;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', modalStyles);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Modal,
        ModalManager,
        modalManager,
        openModal
    };
}
// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        const productGrid = document.getElementById('productGrid');
        
        data.products.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const keyFeatures = product.description.keyFeatures.slice(0, 3).map(f => `<li>${f}</li>`).join('');
    const benefits = product.description.benefits.slice(0, 2).map(b => `<li>${b}</li>`).join('');
    
    card.innerHTML = `
        <span class="category-badge">${product.category.replace('_', ' ')}</span>
        <h3>${product.name}</h3>
        <p><strong>Purpose:</strong> ${product.description.purpose}</p>
        <div class="features-list">
            <strong>Key Features:</strong>
            <ul>${keyFeatures}</ul>
        </div>
        <div class="features-list">
            <strong>Benefits:</strong>
            <ul>${benefits}</ul>
        </div>
        <p><small><strong>Coverage:</strong> ${product.specifications.coverage}</small></p>
    `;
    
    return card;
}

// Load services from JSON
async function loadServices() {
    try {
        const response = await fetch('services.json');
        const data = await response.json();
        const servicesGrid = document.getElementById('servicesGrid');
        
        data.services.forEach(service => {
            const serviceCard = createServiceCard(service);
            servicesGrid.appendChild(serviceCard);
        });
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    
    const benefits = service.details.benefits.slice(0, 3).map(b => `<li>${b}</li>`).join('');
    
    card.innerHTML = `
        <h3>${service.name}</h3>
        <p><strong>Category:</strong> ${service.category.replace('_', ' ')}</p>
        <p>${service.description}</p>
        <div class="service-benefits">
            <strong>Benefits:</strong>
            <ul>${benefits}</ul>
        </div>
    `;
    
    return card;
}

// Load procedures from JSON
async function loadProcedures() {
    try {
        const response = await fetch('procedures.json');
        const data = await response.json();
        const proceduresList = document.getElementById('proceduresList');
        
        data.procedures.forEach(procedure => {
            const procedureItem = createProcedureItem(procedure);
            proceduresList.appendChild(procedureItem);
        });
    } catch (error) {
        console.error('Error loading procedures:', error);
    }
}

function createProcedureItem(procedure) {
    const item = document.createElement('div');
    item.className = 'procedure-item';
    
    const header = document.createElement('div');
    header.className = 'procedure-header';
    header.innerHTML = `
        <h3>${procedure.title}</h3>
        <span>+</span>
    `;
    
    const content = document.createElement('div');
    content.className = 'procedure-content';
    
    let stepsHTML = '';
    procedure.steps.forEach(step => {
        const details = step.details.map(d => `<li>${d}</li>`).join('');
        stepsHTML += `
            <div class="step">
                <h4>Step ${step.stepNumber}: ${step.title}</h4>
                <p>${step.description}</p>
                <div class="step-details">
                    <ul>${details}</ul>
                </div>
            </div>
        `;
    });
    
    const safety = procedure.safetyPrecautions.map(s => `<li>${s}</li>`).join('');
    const checks = procedure.qualityChecklist.map(c => `<li>${c}</li>`).join('');
    
    content.innerHTML = `
        ${stepsHTML}
        <div class="step" style="border-left-color: #ff6b6b;">
            <h4>Safety Precautions</h4>
            <div class="step-details">
                <ul>${safety}</ul>
            </div>
        </div>
        <div class="step" style="border-left-color: #4caf50;">
            <h4>Quality Checklist</h4>
            <div class="step-details">
                <ul>${checks}</ul>
            </div>
        </div>
    `;
    
    header.addEventListener('click', () => {
        content.classList.toggle('active');
        header.style.background = content.classList.contains('active') ? '#2a5298' : '#1e3c72';
    });
    
    item.appendChild(header);
    item.appendChild(content);
    
    return item;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadServices();
    loadProcedures();
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you shortly.');
            contactForm.reset();
        });
    }
});
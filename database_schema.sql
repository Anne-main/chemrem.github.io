-- Database Schema for Construction Chemicals Website

-- Products Table
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description_purpose TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product Features Table
CREATE TABLE product_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    feature_type ENUM('keyFeature', 'benefit') NOT NULL,
    feature_text TEXT NOT NULL,
    display_order INT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product Specifications Table
CREATE TABLE product_specifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL UNIQUE,
    coverage VARCHAR(100),
    drying_time VARCHAR(100),
    full_cure_time VARCHAR(100),
    temperature_range VARCHAR(100),
    shelf_life VARCHAR(100),
    other_specs JSON,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product Applications Table
CREATE TABLE product_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    application_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Procedures Table
CREATE TABLE procedures (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Procedure Steps Table
CREATE TABLE procedure_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    procedure_id VARCHAR(50) NOT NULL,
    step_number INT NOT NULL,
    step_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    display_order INT,
    FOREIGN KEY (procedure_id) REFERENCES procedures(id) ON DELETE CASCADE
);

-- Procedure Step Details Table
CREATE TABLE procedure_step_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    step_id INT NOT NULL,
    detail_text TEXT NOT NULL,
    detail_order INT,
    FOREIGN KEY (step_id) REFERENCES procedure_steps(id) ON DELETE CASCADE
);

-- Procedure Tools Table
CREATE TABLE procedure_tools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    step_id INT NOT NULL,
    tool_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (step_id) REFERENCES procedure_steps(id) ON DELETE CASCADE
);

-- Safety Precautions Table
CREATE TABLE safety_precautions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    procedure_id VARCHAR(50) NOT NULL,
    precaution_text TEXT NOT NULL,
    precaution_order INT,
    FOREIGN KEY (procedure_id) REFERENCES procedures(id) ON DELETE CASCADE
);

-- Quality Checklist Table
CREATE TABLE quality_checklist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    procedure_id VARCHAR(50) NOT NULL,
    check_item TEXT NOT NULL,
    check_order INT,
    FOREIGN KEY (procedure_id) REFERENCES procedures(id) ON DELETE CASCADE
);

-- Services Table
CREATE TABLE services (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Service Details Table
CREATE TABLE service_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id VARCHAR(50) NOT NULL,
    overview TEXT,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Service Scope Table
CREATE TABLE service_scope (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id VARCHAR(50) NOT NULL,
    scope_item TEXT NOT NULL,
    scope_order INT,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Service Benefits Table
CREATE TABLE service_benefits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id VARCHAR(50) NOT NULL,
    benefit_text TEXT NOT NULL,
    benefit_order INT,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Service Sub-categories Table
CREATE TABLE service_subcategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id VARCHAR(50) NOT NULL,
    subcategory_name VARCHAR(255) NOT NULL,
    subcategory_description TEXT,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Service Sub-category Items Table
CREATE TABLE service_subcategory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subcategory_id INT NOT NULL,
    item_text TEXT NOT NULL,
    item_order INT,
    FOREIGN KEY (subcategory_id) REFERENCES service_subcategories(id) ON DELETE CASCADE
);

-- Category Lookup Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT
);

-- Contact Submissions Table
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'read', 'responded') DEFAULT 'new'
);

-- Create Indexes for better query performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_procedures_product ON procedures(product_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_contact_submitted ON contact_submissions(submitted_at);
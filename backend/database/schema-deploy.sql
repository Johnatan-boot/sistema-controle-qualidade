

USE bxuyolh1jafi5ocgsbse;

CREATE TABLE sectors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE statuses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE divergence_types (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code INT NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(150) NOT NULL UNIQUE,
    description VARCHAR(500) NOT NULL,
    supplier_id BIGINT UNSIGNED NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL
);

CREATE TABLE quality_records (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    sector_id BIGINT UNSIGNED NOT NULL,
    status_id BIGINT UNSIGNED NOT NULL,
    divergence_type_id BIGINT UNSIGNED NULL,
    product_id BIGINT UNSIGNED NULL,
    supplier_id BIGINT UNSIGNED NULL,

    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,

    observation TEXT NULL,
    correction_action TEXT NULL,

    observation_date DATE NULL,
    correction_date DATE NULL,

    responsible VARCHAR(150) NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_quality_sector
        FOREIGN KEY (sector_id)
        REFERENCES sectors(id),

    CONSTRAINT fk_quality_status
        FOREIGN KEY (status_id)
        REFERENCES statuses(id),

    CONSTRAINT fk_quality_divergence
        FOREIGN KEY (divergence_type_id)
        REFERENCES divergence_types(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_quality_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_quality_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL,

    INDEX idx_quality_observation_date (observation_date),
    INDEX idx_quality_sector (sector_id),
    INDEX idx_quality_status (status_id),
    INDEX idx_quality_divergence (divergence_type_id),
    INDEX idx_quality_product (product_id),
    INDEX idx_quality_responsible (responsible)
);
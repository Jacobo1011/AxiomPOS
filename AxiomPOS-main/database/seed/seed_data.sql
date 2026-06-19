-- AxiomPOS Seed Data

-- Insert default admin user (password is 'admin123')
INSERT INTO users (username, email, hashed_password, role) 
VALUES ('admin', 'admin@axiompos.com', '$2b$12$4TMK2AycBMSWT4zcAyBVreEivbxrmbEXekdaTYI18mEWfUOrskhYW', 'admin')
ON CONFLICT(username) DO NOTHING;

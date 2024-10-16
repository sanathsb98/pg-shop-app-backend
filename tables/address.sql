CREATE TABLE IF NOT EXISTS address (
   id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id) ON DELETE CASCADE,
   phone VARCHAR(100) NOT NULL,
   zipcode VARCHAR(50) NOT NULL,
   locality VARCHAR(50) NOT NULL,
   address VARCHAR(100) NOT NULL,
   city VARCHAR(50) NOT NULL,
   state VARCHAR(50) NOT NULL,
   landmark VARCHAR(50),
   alternatephone VARCHAR(100)
);



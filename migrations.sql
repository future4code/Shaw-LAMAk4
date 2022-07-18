CREATE TABLE IF NOT EXISTS lama_show(
	id VARCHAR(255) PRIMARY KEY,
	week_day ENUM("FRI", "SAT", "SUN") NOT NULL,
	start_time INT NOT NULL,
	end_time INT NOT NULL,
	band_id VARCHAR(255) NOT NULL,
	FOREIGN KEY(band_id) REFERENCES lama_band(id),
	CHECK (start_time >= 8 AND start_time <= 22),
	CHECK (end_time >= 9 AND start_time <= 23)
);

CREATE TABLE IF NOT EXISTS lama_band(
	id VARCHAR(255) PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL,
	music_genre VARCHAR(255) NOT NULL,
	responsible VARCHAR(255) UNIQUE NOT NULL 
);

CREATE TABLE IF NOT EXISTS lama_user(
	id VARCHAR(255) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	role ENUM ("NORMAL", "ADMIN") NOT NULL DEFAULT "NORMAL",
	CHECK (LENGTH (password) >= 6)
)
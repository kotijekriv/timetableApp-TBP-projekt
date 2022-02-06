-- Kreiranje tablica
BEGIN;
	CREATE TABLE person (
		id SERIAL PRIMARY KEY,
		name VARCHAR(50) NOT NULL,
		surname VARCHAR(50) NOT NULL,
		email VARCHAR(50) NOT NULL,
		password TEXT NOT NULL
	);

	CREATE TABLE event_type (
		id SERIAL PRIMARY KEY,
		name VARCHAR(50) NOT NULL,
		color VARCHAR(10) NOT NULL
	);

	CREATE TABLE subject (
		id SERIAL PRIMARY KEY,
		name VARCHAR(50) NOT NULL,
		teacher VARCHAR(100) NOT NULL,
		ects INT NOT NULL
	);

	CREATE TABLE event (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL,
		start_time TIMESTAMP NOT NULL,
		end_time TIMESTAMP NOT NULL,
		creator INT NOT NULL,
		subject INT NOT NULL,
		event_type INT NOT NULL,
		FOREIGN KEY(creator) REFERENCES person(id) ON DELETE RESTRICT ON UPDATE CASCADE,
		FOREIGN KEY(subject) REFERENCES subject(id) ON DELETE RESTRICT ON UPDATE CASCADE,
		FOREIGN KEY(event_type) REFERENCES event_type(id) ON DELETE RESTRICT ON UPDATE CASCADE
	);
END;

-- Unos početnih vrijednosti
BEGIN
    INSERT INTO person(id, name, surname, email, password) 
    VALUES (default, 'Ivo', 'Ivić', 'iivic@foi.hr', '1234');

    INSERT INTO subject VALUES
    (DEFAULT, 'Teorija baza podataka', 'Markus Schatten', 5),
    (DEFAULT, 'Uzorci dizajna', 'Dragutin Kermek', 5),
    (DEFAULT, 'Inteligentni sustavi', 'Božidar Kliček', 4),
    (DEFAULT, 'ERP sustavi', 'Ruben Picek', 5),
    (DEFAULT, 'Kvaliteta mjerenja u informatici', 'Valetnina Kirinić', 5);

    INSERT INTO event_type VALUES
    (DEFAULT, 'Predavanje', '#9e3742'),
    (DEFAULT, 'Seminari', '#37909e'),
    (DEFAULT, 'Laboratorijske vježe', '#5e379e');
COMMIT;

-- Funkcije i okidači
BEGIN
    -- Validacija email adrese
	CREATE OR REPLACE FUNCTION validate_email()
		RETURNS TRIGGER
		AS $$
			BEGIN
				IF NEW.email LIKE '%@%.%' THEN
					RETURN NEW;
				ELSE
					RAISE EXCEPTION '%', 'Incorrect email format!';
				END IF;
			END;
		$$
		LANGUAGE plpgsql;

	CREATE OR REPLACE TRIGGER email_validation
	BEFORE INSERT OR UPDATE
	ON person
	FOR EACH ROW
	EXECUTE PROCEDURE validate_email();

    -- Kriptiranje lozinke
    CREATE EXTENSION pgcrypto;

    CREATE OR REPLACE FUNCTION hash_password()
        RETURNS TRIGGER
        AS $$
            BEGIN
                NEW.password = crypt(NEW.password, '_J9..9UEN');
                RETURN NEW;
            END;
        $$
        LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER password_hashing
    BEFORE INSERT OR UPDATE
    ON person
    FOR EACH ROW
    EXECUTE PROCEDURE hash_password();

    -- Ručni unos događaja
    CREATE OR REPLACE FUNCTION insert_event(p_title TEXT, p_start_time TIMESTAMP, p_creator INT, 
        p_subject INT, p_event_type INT, p_duration INT, p_repeat_num INT DEFAULT NULL, 
        p_repeat_txt VARCHAR(10) DEFAULT NULL, p_end_repeat TIMESTAMP DEFAULT NULL)
        RETURNS VOID
    AS $$
        DECLARE v_end_time TIMESTAMP;
        DECLARE v_duration TEXT;
        BEGIN
            v_duration := p_duration || ' hours';
            v_end_time := ( 
                SELECT p_start_time + v_duration::interval
            );

            INSERT INTO event 
            VALUES (DEFAULT, p_title, p_start_time, v_end_time, p_creator, p_subject, p_event_type);

            IF p_repeat_num IS NOT NULL AND p_start_time <= p_end_repeat THEN
                IF p_repeat_txt NOT IN ('hours', 'days', 'weeks') THEN
                    RAISE EXCEPTION '%', 'Interval ponavljanja nije u ispravnom formatu.';
                END IF;

                WHILE p_start_time <= p_end_repeat LOOP
                    v_duration := p_repeat_num || p_repeat_txt;
                    p_start_time := ( 
                        SELECT p_start_time + v_duration::interval
                    );

                    v_duration := p_duration || ' hours';
                    v_end_time := ( 
                        SELECT p_start_time + v_duration::interval
                    );

                    INSERT INTO event VALUES 
                    (DEFAULT, p_title, p_start_time, v_end_time, p_creator, p_subject, p_event_type);
                END LOOP;
            END IF;
        END;
    $$
    LANGUAGE plpgsql;

    -- Ručno ažuriranje događaja
    CREATE OR REPLACE FUNCTION update_event(p_event_id INT, p_title TEXT, p_start_time TIMESTAMP, p_creator INT, 
        p_subject INT, p_event_type INT, p_duration INT)
        RETURNS VOID
    AS $$
        DECLARE v_end_time TIMESTAMP;
        DECLARE v_duration TEXT;
        BEGIN
            v_duration := p_duration || ' hours';
            v_end_time := ( 
                SELECT p_start_time + v_duration::interval
            );
            
            UPDATE event SET title=p_title, start_time=p_start_time, end_time=v_end_time, creator=p_creator, 
            subject=p_subject, event_type=p_event_type WHERE id=p_event_id;
        END;
    $$
    LANGUAGE plpgsql;

    -- Provjera 8 sati po danu
    CREATE OR REPLACE FUNCTION check_hours()
        RETURNS TRIGGER
        AS $$
            DECLARE v_hours_sum INT;
            BEGIN
                v_hours_sum := (
                    SELECT COALESCE(SUM((EXTRACT(epoch FROM end_time - start_time)/3600)::INTEGER),0)
                    FROM event 
                    WHERE creator = NEW.creator AND DATE(start_time) = DATE(NEW.start_time)
					AND id <> NEW.id
                );

                v_hours_sum := (
                    SELECT (EXTRACT(epoch FROM NEW.end_time - NEW.start_time)/3600)::INTEGER
                ) + v_hours_sum;

                IF v_hours_sum <= 8 THEN
                    RETURN NEW;
                ELSE
                    RAISE EXCEPTION '%', 'Sum of hours in the day must be 8 or lower!';
                END IF;
            END;
        $$
        LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER hours_validation
    BEFORE INSERT OR UPDATE
    ON event
    FOR EACH ROW
    EXECUTE PROCEDURE check_hours();

    -- Provjera max. 2 predavanja u danu
    CREATE OR REPLACE FUNCTION lecture_validation()
        RETURNS TRIGGER
        AS $$
            DECLARE v_sum_lectures INTEGER;
            
            BEGIN
                IF NEW.event_type <> 1 THEN
                    RETURN NEW;
                END IF;
                
                v_sum_lectures := (
                    SELECT COUNT(*) FROM event 
                    WHERE event_type = 1 AND creator = NEW.creator
                    AND start_time::DATE = NEW.start_time::DATE
					AND id <> NEW.id
                ) + 1;
                
                IF v_sum_lectures <= 2 THEN
                    RETURN NEW;
                ELSE
                    RAISE EXCEPTION '%', 'Can not have 2 or more lectures per day!';
                END IF;
            END;
        $$
        LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER lecture_validation
    BEFORE INSERT OR UPDATE
    ON event
    FOR EACH ROW
    EXECUTE PROCEDURE lecture_validation();

    -- Provjera max. 1 predavanje iz istog predmeta u tjednu
    CREATE OR REPLACE FUNCTION check_weekly_lecture()
        RETURNS TRIGGER
        AS $$
            DECLARE v_lectures INTEGER;
            BEGIN
                v_lectures := ( 
                    SELECT COUNT(*) FROM event 
                    WHERE creator = NEW.creator AND event_type = 1 AND subject = NEW.subject
                    AND extract(week from start_time) = extract(week from NEW.start_time)
					AND id <> NEW.id
                ) + 1;
                
                
                IF v_lectures <= 1 THEN
                    RETURN NEW;
                ELSE
                    RAISE EXCEPTION '%', 'Can not have 2 or more lectures per subject per week!';
                END IF;
            END;
        $$ 
        LANGUAGE plpgsql;
        
    CREATE OR REPLACE TRIGGER weekly_lecture_validation
    BEFORE INSERT OR UPDATE
    ON event
    FOR EACH ROW
    EXECUTE PROCEDURE check_weekly_lecture();

    -- Provjera max. 1 događaj u isto vrijeme
    CREATE OR REPLACE FUNCTION lectures_overlaps()
        RETURNS TRIGGER
        AS $$
            DECLARE v_count_events INTEGER;
            BEGIN
                v_count_events := (
                    SELECT COUNT(*) FROM event
                    WHERE creator = NEW.creator
                    AND (start_time, end_time) OVERLAPS (NEW.start_time, NEW.end_time)
                    AND id <> NEW.id
                );
                
                IF v_count_events = 0 THEN
                    RETURN NEW;
                ELSE 
                    RAISE EXCEPTION '%', 'Can not have 2 or more events at the same time!';
                END IF;
            END;
        $$
        LANGUAGE plpgsql;
        
    CREATE OR REPLACE TRIGGER overlaps_validation
    BEFORE INSERT OR UPDATE
    ON event
    FOR EACH ROW
    EXECUTE PROCEDURE lectures_overlaps();

    -- Provjera dana u tjednu
    CREATE OR REPLACE FUNCTION check_dow()
        RETURNS TRIGGER
        AS $$
            DECLARE v_day INTEGER;
            BEGIN
                v_day := (
                    SELECT EXTRACT(dow FROM NEW.start_time::timestamp)::INTEGER
                );
                
                IF v_day <> 0 THEN
                    RETURN NEW;
                ELSE
                    RAISE EXCEPTION '%', 'Can not create event on Sunday!';
                END IF;
            END;
        $$
        LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER dow_validation
    BEFORE INSERT OR UPDATE
    ON event
    FOR EACH ROW
    EXECUTE PROCEDURE check_dow();
END;
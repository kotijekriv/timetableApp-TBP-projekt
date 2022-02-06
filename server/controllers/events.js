import pool from '../db.js';

export const createEvent = async (req, res) => {
    try {
        const { title, start, subject, eventType, duration, repeatNum, repeatTxt, repeatEnd, user } = req.body;

        if (repeatNum == 0) {
            const query = "SELECT insert_event($1, $2, $3, $4, $5, $6)";

            await pool.query(query, [title, start, user, subject, eventType, duration]);
        } else {
            const query = "SELECT insert_event($1, $2, $3, $4, $5, $6, $7, $8, $9)";

            await pool.query(query, [title, start, user, subject, eventType, duration, repeatNum, repeatTxt, repeatEnd]);
        }


        res.status(200).json({ message: "Event(s) inserted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const updateEvent = async (req, res) => {
    try {
        const { eventId, title, start, subject, eventType, duration, user } = req.body;

        await pool.query(
            "SELECT update_event($1, $2, $3, $4, $5, $6, $7)",
            [eventId, title, start, user, subject, eventType, duration]
        );

        res.status(200).json({ message: "Event updated successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const deleteEvent = async (req, res) => {
    try {
        const { eventId, user } = req.body;

        const result = await pool.query(
            "DELETE FROM event WHERE id = $1 AND creator = $2 RETURNING *",
            [eventId, user]
        );

        if (result.rowCount == 0) res.status(400).json({ message: 'Can not delete an event!' });

        const event = result.rows[0];

        res.status(200).json(event);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const getEvents = async (req, res) => {
    try {
        const { user } = req.body;

        const query = "SELECT e.id as id, et.color as color, e.start_time as \"from\", e.end_time as \"to\", e.title || ': ' || s.name || ' - ' || et.name as title "
            + "FROM event e LEFT JOIN subject s ON e.subject = s.id "
            + "LEFT JOIN event_type et ON e.event_type = et.id "
            + "WHERE creator = $1"

        const result = await pool.query(query, [user]);

        const events = result.rows;

        res.status(200).json(events);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const getEventsByTime = async (req, res) => {
    try {
        const { user, start, end } = req.body;

        const result = await pool.query(
            "SELECT e.id as id, et.color as color, e.start_time as \"from\", e.end_time as \"to\", e.title || ': ' || s.name || ' - ' || et.name as title "
            + "FROM event e LEFT JOIN subject s ON e.subject = s.id LEFT JOIN event_type et ON e.event_type = et.id " 
            + " WHERE creator = $1 AND ($2, $3) OVERLAPS (start_time, end_time)",
            [user, start, end]
        );

        const events = result.rows;

        res.status(200).json(events);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getEvent = async (req, res) => {
    try {
        const { user, eventId } = req.body;

        const result = await pool.query(
            "SELECT * FROM event WHERE id = $1 AND creator = $2",
            [eventId, user]
        );

        if (result.rowCount == 0) res.status(404).json({ message: "Event not found" });

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getEventTypes = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM event_type"
        );

        const eventTypes = result.rows;

        res.status(200).json(eventTypes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const getSubjects = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM subject"
        );

        const subjects = result.rows;

        res.status(200).json(subjects);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}
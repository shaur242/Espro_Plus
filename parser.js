/**
 * ============================================
 * ESPro+
 * parser.js
 * ============================================
 * Reads attendance information from ESPro.
 */

const Parser = {

    /**
     * Returns all individual subject cards.
     */
    getSubjectCards() {
        return [...document.querySelectorAll(".MuiCard-root")]
            .filter(card => {
                const label = card.getAttribute("aria-label");
                if (!label) return false;
                return (
                    label.includes("attendance") &&
                    (label.includes("classes attended") || label.includes("hours attended"))
                );
            });
    },

    /**
     * Parse an individual subject card.
     */
    parseSubject(card) {
        const label = card.getAttribute("aria-label");
        if (!label) return null;

        const match = label.match(
            /(.+?) \((.+?)\): ([\d.]+)% attendance, (\d+) of (\d+) (?:classes|hours) attended/
        );
        if (!match) return null;

        return {
            element: card,
            subject: match[1].trim(),
            code: match[2].trim(),
            percentage: Number(match[3]),
            attended: Number(match[4]),
            total: Number(match[5]),
            isOverall: false
        };
    },

    /**
     * Returns parsed individual subjects array.
     */
    getSubjects() {
        return this.getSubjectCards()
            .map(card => this.parseSubject(card))
            .filter(subject => subject !== null);
    },

    /**
     * Parses the top Overall Attendance overview grid container card.
     */
    getOverallAttendance() {
        const cards = document.querySelectorAll(".MuiCard-root");
        let targetCard = null;

        for (const card of cards) {
            if (card.textContent && card.textContent.includes("Overall Attendance")) {
                targetCard = card;
                break;
            }
        }

        if (!targetCard) return null;

        // Scrapes structural string format layout text: "139 / 151 hrs"
        const match = targetCard.textContent.match(/(\d+)\s*\/\s*(\d+)\s*hrs/);
        if (!match) return null;

        const attended = Number(match[1]);
        const total = Number(match[2]);

        return {
            element: targetCard,
            subject: "Overall Attendance",
            code: "OVERALL",
            percentage: total === 0 ? 0 : Number(((attended / total) * 100).toFixed(2)),
            attended: attended,
            total: total,
            isOverall: true // Enables 85% safe bunk threshold in Calculator
        };
    }
};
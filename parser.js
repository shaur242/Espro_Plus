/**
 * ============================================
 * ESPro+
 * parser.js
 * ============================================
 * Reads attendance information from ESPro.
 */

const Parser = {

    /**
     * Returns all subject cards.
     */
    getSubjectCards() {

        return [...document.querySelectorAll(".MuiCard-root")]

            .filter(card => {

                const label = card.getAttribute("aria-label");

                if (!label)
                    return false;

                return (
                    label.includes("attendance") &&
                    (
                        label.includes("classes attended") ||
                        label.includes("hours attended")
                    )
                );

            });

    },

    /**
     * Parse a subject card.
     */
    parseSubject(card) {

        const label = card.getAttribute("aria-label");

        if (!label)
            return null;

        const match = label.match(

            /(.+?) \((.+?)\): ([\d.]+)% attendance, (\d+) of (\d+) (?:classes|hours) attended/

        );

        if (!match)
            return null;

        return {

            element: card,

            subject: match[1].trim(),

            code: match[2].trim(),

            percentage: Number(match[3]),

            attended: Number(match[4]),

            total: Number(match[5])

        };

    },

    /**
     * Returns parsed subjects.
     */
    getSubjects() {

        return this.getSubjectCards()

            .map(card => this.parseSubject(card))

            .filter(subject => subject !== null);

    }

};
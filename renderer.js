/**
 * ============================================
 * ESPro+
 * renderer.js
 * ============================================
 */

const Renderer = {

    rendering: false,

    /**
     * Render one subject card.
     */
    renderSubject(subject) {

        const content =
            subject.element.querySelector(".MuiCardContent-root");

        if (!content)
            return;

        if (content.querySelector(".attendance-plus"))
            return;

        content.appendChild(
            UI.createAttendancePanel(subject)
        );

    },

    /**
     * Render all subject cards.
     */
    renderSubjects() {

        const subjects = Parser.getSubjects();

        subjects.forEach(subject => {

            this.renderSubject(subject);

        });

    },

    /**
     * Render everything.
     */
    render() {

        if (this.rendering)
            return;

        this.rendering = true;

        try {

            this.renderSubjects();

        } finally {

            this.rendering = false;

        }

    }

};
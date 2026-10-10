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
        const content = subject.element.querySelector(".MuiCardContent-root");
        if (!content) return;
        if (content.querySelector(".attendance-plus")) return;

        content.appendChild(UI.createAttendancePanel(subject));
    },

    /**
     * Render all individual subject cards.
     */
    renderSubjects() {
        const subjects = Parser.getSubjects();
        subjects.forEach(subject => {
            Renderer.renderSubject(subject);
        });
    },

    /**
     * Render the Overall Attendance metrics summary block separately below "Attendance Information".
     */
    renderOverall() {

        const overall = Parser.getOverallAttendance();
        if (!overall) 
            return;

        // Avoid duplicate rendering
        if (document.querySelector(".espro-overall-wrapper")) 
            return;

        let targetAccordion = null;

        // 1. Locate the paragraph/text element for "Attendance Information"
        const elements = document.querySelectorAll('*');
        for (const el of elements) {
            if (el.children.length === 0 && el.textContent.trim() === "Attendance Information") {
                // 2. Select its direct root Material-UI Accordion container
                targetAccordion = el.closest('.MuiAccordion-root');
                break;
            }
        }

        // Fallback: If "Attendance Information" accordion isn't found, attach below overall card grid parent
        if (!targetAccordion) {
            const cardParent = overall.element.parentElement;
            if (!cardParent) return;
            targetAccordion = cardParent.parentElement;
            if (!targetAccordion) return;
        }

        // Create the structural container wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'espro-overall-wrapper';

        // Build the structural framework accordion matching system design layout
        wrapper.innerHTML = `
            <div class="espro-collapse-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.1rem;">📊</span>
                    <span>ESPro+ Overall Attendence Insights</span>
                </div>
                <span class="espro-arrow-icon">▼</span>
            </div>
            <div class="espro-collapse-content">
                <div class="espro-overall-inner-card"></div>
            </div>
        `;

        // Generate the core UI attendance dashboard workspace elements
        const panel = UI.createAttendancePanel(overall);
        panel.style.boxShadow = "none";
        panel.style.background = "transparent";
        panel.style.border = "none";
        panel.style.marginTop = "0";
        panel.style.padding = "0"; // Strip padding since wrapper handles it
        
        // Inject the generated dashboard inside the custom inner panel card component
        wrapper.querySelector('.espro-overall-inner-card').appendChild(panel);

        // 3. Insert cleanly AFTER the complete MuiAccordion-root element
        targetAccordion.insertAdjacentElement('afterend', wrapper);

        // UI expansion toggle click configurations
        const header = wrapper.querySelector('.espro-collapse-header');
        const content = wrapper.querySelector('.espro-collapse-content');
        const arrow = wrapper.querySelector('.espro-arrow-icon');

        header.addEventListener('click', () => {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
            header.style.borderRadius = isHidden ? '8px 8px 0 0' : '8px';
        });
    },

    /**
     * Main execution initialization point trigger hook lifecycle loop.
     */
    render() {
        if (Renderer.rendering) return;
        Renderer.rendering = true;

        try {
            Renderer.renderSubjects();
            Renderer.renderOverall();
        } finally {
            Renderer.rendering = false;
        }
    }
};
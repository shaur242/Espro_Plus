/**
 * ============================================
 * ESPro+
 * ui.js
 * ============================================
 */

const UI = {

    /* ==========================================
       Title
    ========================================== */

    createTitle() {

        const title = document.createElement("div");

        title.className = "espro-title";

        title.textContent = "ESPro+";

        return title;

    },

    /* ==========================================
       Badge
    ========================================== */

    createBadge(text, color) {

        const badge = document.createElement("span");

        badge.className = `espro-badge ${color}`;

        badge.textContent = text;

        return badge;

    },

    /* ==========================================
       Row
    ========================================== */

    createRow(label, value, color) {

        const row = document.createElement("div");

        row.className = "espro-row";

        const left = document.createElement("span");

        left.className = "espro-label";

        left.textContent = label;

        const right = this.createBadge(value, color);

        row.append(left, right);

        return row;

    },

    /* ==========================================
       Simulator
    ========================================== */

    createSimulator(subject, refs) {

        const wrapper = document.createElement("div");

        wrapper.className = "espro-simulator";

        /* Header */

        const toggle = document.createElement("div");

        toggle.className = "espro-toggle";

        toggle.innerHTML = `
            <span>Attendance Simulator</span>
            <span class="espro-arrow">▶</span>
        `;

        /* Body */

        const body = document.createElement("div");

        body.className = "espro-simulator-body";

        body.style.display = "none";

        /* Prevent card click */

        wrapper.addEventListener("click", e => {

            e.preventDefault();

            e.stopPropagation();

        });

        /* Labels */

        const labels = document.createElement("div");

        labels.className = "espro-slider-labels";

        labels.innerHTML = `
            <span>-20</span>
            <span>+20</span>
        `;

        /* Slider */

        const slider = document.createElement("input");

        slider.type = "range";

        slider.min = -20;

        slider.max = 20;

        slider.value = 0;

        slider.className = "espro-slider";

        /* Value */

        const value = document.createElement("div");

        value.className = "espro-slider-value";

        /* Projection */

        const projected = document.createElement("div");

        projected.className = "espro-projected";

        function refresh() {

            const offset = Number(slider.value);

            const result = Calculator.calculate(subject, offset);

            value.textContent =
                offset > 0
                    ? `+${offset}`
                    : offset;

            projected.innerHTML = `
<div class="espro-projection">

    <div class="espro-projection-item">

        <span class="projection-title">
            Attendance
        </span>

        <span class="projection-value">
            ${result.percentage}%
        </span>

    </div>

    <div class="projection-divider"></div>

    <div class="espro-projection-item">

        <span class="projection-title">
            Classes
        </span>

        <span class="projection-value">
            ${result.attended}/${result.total}
        </span>

    </div>

</div>
`;

            refs.need75.textContent =
                result.need75 === 0
                    ? "Reached"
                    : `${result.need75} cls`;

            refs.need85.textContent =
                result.need85 === 0
                    ? "Reached"
                    : `${result.need85} cls`;

            refs.bunks.textContent =
                result.safeBunks;

            refs.need75.className =
                `espro-badge ${result.colors.need75}`;

            refs.need85.className =
                `espro-badge ${result.colors.need85}`;

            refs.bunks.className =
                `espro-badge ${result.colors.bunks}`;

        }

        refresh();

        slider.addEventListener("input", refresh);

        toggle.onclick = () => {

            const open =
                body.style.display === "block";

            body.style.display =
                open
                    ? "none"
                    : "block";

            toggle.querySelector(".espro-arrow").textContent =
                open
                    ? "▶"
                    : "▼";

        };

        body.append(

            labels,

            slider,

            value,

            projected

        );

        wrapper.append(

            toggle,

            body

        );

        return wrapper;

    },

    /* ==========================================
       Attendance Panel
    ========================================== */

    createAttendancePanel(subject) {

        const result =
            Calculator.calculate(subject);

        const panel = document.createElement("div");

        panel.className = "attendance-plus";

        panel.appendChild(
            this.createTitle()
        );

        const row75 = this.createRow(

            "75% Goal",

            result.need75 === 0
                ? "Reached"
                : `${result.need75} cls`,

            result.colors.need75

        );

        const row85 = this.createRow(

            "85% Goal",

            result.need85 === 0
                ? "Reached"
                : `${result.need85} cls`,

            result.colors.need85

        );

        const bunks = this.createRow(

            "Safe Bunks",

            result.safeBunks,

            result.colors.bunks

        );

        panel.append(

            row75,

            row85,

            bunks

        );

        const refs = {

            need75:
                row75.querySelector(".espro-badge"),

            need85:
                row85.querySelector(".espro-badge"),

            bunks:
                bunks.querySelector(".espro-badge")

        };

        panel.appendChild(

            this.createSimulator(subject, refs)

        );

        return panel;

    }

};
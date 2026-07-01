/**
 * ============================================
 * ESPro+
 * calculator.js
 * ============================================
 */

const Calculator = {

    /**
     * Calculate attendance statistics.
     *
     * offset > 0  → Attend future classes
     * offset < 0  → Miss future classes
     */
    calculate(subject, offset = 0) {

        let attended = subject.attended;
        let total = subject.total;

        if (offset > 0) {

            attended += offset;
            total += offset;

        }
        else if (offset < 0) {

            total += Math.abs(offset);

        }

        const percentage =
            total === 0
                ? 0
                : +(attended / total * 100).toFixed(2);

        return {

            attended,
            total,
            percentage,

            need75: this.classesNeeded(attended, total, 75),

            need85: this.classesNeeded(attended, total, 85),

            safeBunks: this.safeBunks(attended, total, 75),

            colors: {

                need75: this.getColor(percentage, 75),

                need85: this.getColor(percentage, 85),

                bunks: this.getBunkColor(
                    this.safeBunks(attended, total, 75)
                )

            }

        };

    },

    /**
     * Consecutive classes needed to reach target.
     */
    classesNeeded(attended, total, target) {

        if ((attended / total) * 100 >= target)
            return 0;

        let a = attended;
        let t = total;
        let count = 0;

        while ((a / t) * 100 < target) {

            a++;
            t++;
            count++;

        }

        return count;

    },

    /**
     * Safe bunks while staying above target.
     */
    safeBunks(attended, total, target) {

        let bunks = 0;

        while (true) {

            const nextTotal = total + bunks + 1;

            const percent =
                attended / nextTotal * 100;

            if (percent < target)
                break;

            bunks++;

        }

        return bunks;

    },

    /**
     * Badge color.
     */
    getColor(current, target) {

        if (current >= target)
            return "green";

        if (current >= target - 5)
            return "orange";

        return "red";

    },

    /**
     * Safe bunk badge.
     */
    getBunkColor(bunks) {

        if (bunks >= 5)
            return "green";

        if (bunks >= 2)
            return "orange";

        return "red";

    }

};
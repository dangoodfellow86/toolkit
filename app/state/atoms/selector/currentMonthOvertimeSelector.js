import { selector } from "recoil";
import { overtimeListValue } from "../overtimeListValue";

export const currentMonthOvertimeSelector = selector({
    key: "currentMonthOvertimeSelector",
    get: ({ get }) => {
        const overtimes = get(overtimeListValue);
        const month = new Date().toLocaleString("default", { month: "long" });
        let totalOvertime = 0;
        overtimes.forEach((overtime) => {
            const overtimeMonth = new Date(overtime.date).toLocaleString("default", {
                month: "long",
            });
            if (overtimeMonth === month) {
                totalOvertime += overtime.amount;
            }
        });
        return totalOvertime.toFixed(2);
    },
    
});
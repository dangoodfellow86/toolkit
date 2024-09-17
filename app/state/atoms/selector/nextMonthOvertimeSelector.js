import { selector } from "recoil";
import { overtimeListValue } from "../overtimeListValue";

export const nextMonthOvertimeSelector = selector({
    key: "nextMonthOvertimeSelector",
    get: ({ get }) => {
       const overtimes = get(overtimeListValue);
        
        
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        const nextMonth = currentDate.toLocaleString("default", { month: "long" });
        let totalOvertime = 0;
        overtimes.forEach((overtime) => {
            const overtimeMonth = new Date(overtime.date).toLocaleString("default", {
                month: "long",
            });
            if (overtimeMonth === nextMonth) {
                totalOvertime += overtime.amount;
            }
        });
        return totalOvertime.toFixed(2);
    }
    
});
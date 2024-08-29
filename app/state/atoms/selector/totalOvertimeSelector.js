import { selector } from "recoil";
import { overtimeListValue } from "../overtimeListValue";

export const totalOvertimeSelector = selector({
    key: "totalOvertimeSelector",
    get: ({ get }) => {
        const overtimes = get(overtimeListValue);
        let totalOvertime = 0;
        overtimes.forEach((overtime) => {
            totalOvertime += overtime.amount;
        });
        return totalOvertime.toFixed(2);
    },
});
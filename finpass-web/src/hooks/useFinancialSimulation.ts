
import { useState, useMemo } from 'react';

export interface SimulationInputs {
    initialNetWorth: number; // 현재 순자산 (원)
    monthlyIncome: number;   // 월 소득 (세후, 원)
    monthlyExpense: number;  // 월 지출 (원)
    savingsRate: number;     // 저축 투자 비율 (%) - 기본값 100% (소득-지출 전액)
    investmentReturnRate: number; // 투자 기대 수익률 (연 %)
    inflationRate: number;   // 물가 상승률 (연 %) - 기본 가정
    retirementAge: number;   // 목표 은퇴 나이
    currentAge: number;      // 현재 나이
    targetMonthlyExpense: number; // 은퇴 후 희망 월 생활비 (현재 가치 기준)
}

export interface YearlyData {
    age: number;
    year: number;
    netWorth: number;         // 해당 연도 순자산
    investmentIncome: number; // 해당 연도 투자 수익
    totalSavings: number;     // 누적 저축액
    passiveIncomeMonthly: number; // 월 배당/이자 소득 (세후 가정)
    isRetired: boolean;       // 은퇴 가능 여부 (4% 룰, 혹은 목표 자산 달성)
}

export interface SimulationResult {
    data: YearlyData[];
    finalNetWorth: number;
    financialIndependenceAge: number | null; // 경제적 자유 도달 나이
    inputs: SimulationInputs;
    setInputs: React.Dispatch<React.SetStateAction<SimulationInputs>>;
}

export const useFinancialSimulation = (initialData: Partial<SimulationInputs> = {}) => {
    const [inputs, setInputs] = useState<SimulationInputs>({
        initialNetWorth: initialData.initialNetWorth || 50000000,
        monthlyIncome: initialData.monthlyIncome || 3000000,
        monthlyExpense: initialData.monthlyExpense || 1500000,
        savingsRate: initialData.savingsRate || 100,
        investmentReturnRate: initialData.investmentReturnRate || 7.0, // S&P 500 장기 평균 근사치
        inflationRate: initialData.inflationRate || 2.5,
        retirementAge: initialData.retirementAge || 60,
        currentAge: initialData.currentAge || 29,
        targetMonthlyExpense: initialData.targetMonthlyExpense || 2000000,
        ...initialData
    });

    const result = useMemo(() => {
        const data: YearlyData[] = [];
        let currentNetWorth = inputs.initialNetWorth;
        let fiAge: number | null = null;

        // 시뮬레이션 기간: 현재 나이부터 100세까지 (또는 유의미한 기간)
        const maxAge = 90;
        const startYear = new Date().getFullYear();

        for (let age = inputs.currentAge; age <= maxAge; age++) {
            const yearIndex = age - inputs.currentAge;
            const currentYear = startYear + yearIndex;

            // 1. 연간 현금 흐름 계산
            // 물가 상승률 반영한 소득/지출 (단순화를 위해 소득도 물가만큼 오른다고 가정)
            // 실제로는 커리어 성장에 따라 소득 상승률이 더 높을 수 있음 -> 추후 고도화
            const inflationMultiplier = Math.pow(1 + inputs.inflationRate / 100, yearIndex);

            const yearlyIncome = inputs.monthlyIncome * 12 * inflationMultiplier;
            const yearlyExpense = inputs.monthlyExpense * 12 * inflationMultiplier;

            // 저축 가능액
            const yearlySavings = (yearlyIncome - yearlyExpense) * (inputs.savingsRate / 100);

            // 2. 자산 성장 (복리)
            // (기초 자산 + 이번 해 저축액의 절반) * 수익률 + 기초 자산 + 이번 해 저축액
            // 저축은 1년 내내 분산되므로 수익률 적용은 평균적으로 절반만 받는다고 가정
            const investmentIncome = (currentNetWorth + yearlySavings / 2) * (inputs.investmentReturnRate / 100);

            currentNetWorth += yearlySavings + investmentIncome;

            // 3. 은퇴 가능 여부 판별 (4% Rule)
            // 목표 자산 = (은퇴 후 연 지출) / 0.04
            // 은퇴 후 지출은 목표 월 생활비 * 12 * 물가상승분
            const targetAnnualExpense = inputs.targetMonthlyExpense * 12 * inflationMultiplier;
            const targetAsset = targetAnnualExpense * 25; // 4% Rule 역산 (100 / 4 = 25)

            const isFI = currentNetWorth >= targetAsset;
            if (isFI && fiAge === null) {
                fiAge = age;
            }

            // 월 현금흐름(자본소득) = 자산 * 수익률 / 12
            // 보수적으로 4% 인출률 기준
            const passiveIncomeMonthly = (currentNetWorth * 0.04) / 12;

            data.push({
                age,
                year: currentYear,
                netWorth: Math.round(currentNetWorth),
                investmentIncome: Math.round(investmentIncome),
                totalSavings: Math.round(yearlySavings),
                passiveIncomeMonthly: Math.round(passiveIncomeMonthly),
                isRetired: isFI
            });
        }

        return {
            data,
            finalNetWorth: Math.round(currentNetWorth),
            financialIndependenceAge: fiAge,
            inputs,
            setInputs
        };
    }, [inputs]);

    return result;
};

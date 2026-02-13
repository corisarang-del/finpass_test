
import { useMemo } from 'react';
import type { SimulationResult } from './useFinancialSimulation';

// 이미지 import
import agentHanImg from '../assets/images/agent_han.png';
import agentSongImg from '../assets/images/agent_song.png';
import agentChoiImg from '../assets/images/agent_choi.png';
import agentYouImg from '../assets/images/agent_you.png';

export interface ExpertAdvice {
    id: string;
    agentName: string;
    agentRole: string;
    agentImage: string;
    message: string;
    type: 'warning' | 'tip' | 'praise';
    triggerCondition: string; // 디버깅용
}

export const useExpertAdvisor = (simulation: SimulationResult) => {
    const { inputs, financialIndependenceAge } = simulation;

    const advices = useMemo(() => {
        const result: ExpertAdvice[] = [];

        // 1. [Agent Han] 주거/부채 관련 (여기서는 부채 비율 데이터가 없어서 저축률로 대체 해석)
        // 저축률이 30% 미만이면 경고
        const savingsRatio = ((inputs.monthlyIncome - inputs.monthlyExpense) / inputs.monthlyIncome) * 100;

        if (savingsRatio < 20) {
            result.push({
                id: 'low-savings',
                agentName: 'Agent Han',
                agentRole: 'Real Estate Strategist',
                agentImage: agentHanImg,
                message: `현재 저축률이 ${savingsRatio.toFixed(1)}% 수준이군. 시드머니를 모으기엔 턱없이 부족해. 고정 지출을 다시 점검하게.`,
                type: 'warning',
                triggerCondition: 'savingsRatio < 20'
            });
        }

        // 2. [Guardian Song] 기초 자산 / 리스크 관리
        // 투자 수익률이 너무 높으면 경고 (현실성 부족)
        if (inputs.investmentReturnRate > 12) {
            result.push({
                id: 'high-return-risk',
                agentName: 'Guardian Song',
                agentRole: 'Risk Manager',
                agentImage: agentSongImg,
                message: `연 수익률 ${inputs.investmentReturnRate}%는 워렌 버핏도 쉽지 않은 숫자예요. 현실적인 목표(7~8%)로 낮추는 것이 안전합니다.`,
                type: 'warning',
                triggerCondition: 'returnRate > 12'
            });
        }
        // 소비가 소득의 70%를 넘으면 경고
        else if (inputs.monthlyExpense > inputs.monthlyIncome * 0.7) {
            result.push({
                id: 'high-expense',
                agentName: 'Guardian Song',
                agentRole: 'Risk Manager',
                agentImage: agentSongImg,
                message: `버는 돈의 70% 이상을 쓰고 있어요. 비상금이 없을 때 큰 위기가 올 수 있습니다.`,
                type: 'warning',
                triggerCondition: 'expense > income * 0.7'
            });
        }

        // 3. [Trader Choi] 투자 / 증식
        // 저축률이 50% 이상이면 칭찬
        if (savingsRatio >= 50) {
            result.push({
                id: 'good-savings',
                agentName: 'Trader Choi',
                agentRole: 'Market Analyst',
                agentImage: agentChoiImg,
                message: `훌륭해! 소득의 절반 이상을 미래에 투자하고 있군. 이 속도면 복리의 마법을 제대로 누릴 수 있어.`,
                type: 'praise',
                triggerCondition: 'savingsRatio >= 50'
            });
        }
        // 목표 은퇴 나이가 현재 나이와 너무 가까우면 (5년 이내) 조언
        if (inputs.retirementAge - inputs.currentAge <= 5 && !financialIndependenceAge) {
            result.push({
                id: 'short-term-goal',
                agentName: 'Trader Choi',
                agentRole: 'Market Analyst',
                agentImage: agentChoiImg,
                message: `은퇴까지 시간이 얼마 남지 않았네. 지금은 공격적인 투자보다 현금 흐름을 확보하는 배당 주식이나 채권 비중을 높여야 해.`,
                type: 'tip',
                triggerCondition: 'yearsToRetire <= 5'
            });
        }

        // 4. [Director Yoo] 라이프 밸런스 / 목표
        // 경제적 자유 달성이 은퇴 목표보다 빠를 경우
        if (financialIndependenceAge && financialIndependenceAge < inputs.retirementAge) {
            result.push({
                id: 'early-fi',
                agentName: 'Director Yoo',
                agentRole: 'Life Balancer',
                agentImage: agentYouImg,
                message: `놀라워요! 계획대로라면 ${financialIndependenceAge}세에 경제적 자유를 얻게 됩니다. 남은 시간은 당신이 진짜 하고 싶은 일에 써보세요.`,
                type: 'praise',
                triggerCondition: 'fiAge < retirementAge'
            });
        }
        // 달성 불가능할 경우
        if (!financialIndependenceAge) {
            result.push({
                id: 'cannot-retire',
                agentName: 'Director Yoo',
                agentRole: 'Life Balancer',
                agentImage: agentYouImg,
                message: `지금 패턴으로는 ${inputs.retirementAge}세 은퇴가 어려울 수 있어요. 은퇴 후 생활비를 조금 조정하거나, 부업으로 소득을 늘려보는 건 어떨까요?`,
                type: 'warning',
                triggerCondition: 'fiImpossible'
            });
        }

        return result;
    }, [inputs, financialIndependenceAge]);

    // 가장 우선순위가 높은 조언 하나만 리턴하거나, 전체 리스트 리턴
    // 여기서는 화면에 하나씩 띄우기 위해 가장 중요한(Warning > Tip > Praise) 순서로 정렬된 첫 번째 조언을 강조
    const primaryAdvice = useMemo(() => {
        if (advices.length === 0) return null;

        // 우선순위 정렬: Warning > Tip > Praise
        return advices.sort((a, b) => {
            const priority = { 'warning': 0, 'tip': 1, 'praise': 2 };
            return priority[a.type] - priority[b.type];
        })[0];
    }, [advices]);

    return {
        advices,
        primaryAdvice
    };
};

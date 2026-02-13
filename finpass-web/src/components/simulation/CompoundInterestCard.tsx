
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface CompoundInterestCardProps {
    dailySaveAmount: number; // 예: 10000원
    interestRate: number;    // 예: 7%
}

const CompoundInterestCard: React.FC<CompoundInterestCardProps> = ({ dailySaveAmount = 10000, interestRate = 7 }) => {
    // 복리 계산 함수: 매일 저축액 * 365 * ((1+r)^n - 1) / r ... 은 너무 복잡하고,
    // 간단히: 월 30만원(1만*30) 적립식 복리 계산

    // 월 납입금
    const monthlyContribution = dailySaveAmount * 30;
    const r = interestRate / 100 / 12; // 월 이자율

    const calculateFutureValue = (years: number) => {
        const n = years * 12; // 총 납입 개월 수
        // 적립식 복리 공식: FV = P * ((1+r)^n - 1) / r
        const fv = monthlyContribution * (Math.pow(1 + r, n) - 1) / r;
        return fv;
    };

    const fv10 = calculateFutureValue(10);
    const fv20 = calculateFutureValue(20);
    const fv30 = calculateFutureValue(30);

    const formatMoney = (val: number) => {
        if (val >= 100000000) return `${(val / 100000000).toFixed(1)}억원`;
        return `${Math.round(val / 10000).toLocaleString()}만원`;
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-bold text-gray-900">복리의 힘: 오늘의 {dailySaveAmount.toLocaleString()}원은?</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <div className="text-xs text-gray-500 font-medium mb-1">10년 후</div>
                    <div className="text-lg font-bold text-pink-500">{formatMoney(fv10)}</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-4 text-center text-white shadow-md transform scale-105 z-10">
                    <div className="text-xs text-pink-100 font-medium mb-1">20년 후</div>
                    <div className="text-xl font-bold">{formatMoney(fv20)}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <div className="text-xs text-gray-500 font-medium mb-1">30년 후</div>
                    <div className="text-lg font-bold text-pink-500">{formatMoney(fv30)}</div>
                </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
                연 {interestRate}% 복리 수익률 가정
            </p>
        </div>
    );
};

export default CompoundInterestCard;

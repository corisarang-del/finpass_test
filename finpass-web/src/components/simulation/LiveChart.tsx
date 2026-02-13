
import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import type { YearlyData } from '../../hooks/useFinancialSimulation';

interface LiveChartProps {
    data: YearlyData[];
    financialIndependenceAge: number | null;
    currentAge?: number;
    targetMonthlyExpense?: number;
}

const LiveChart: React.FC<LiveChartProps> = ({ data, financialIndependenceAge }) => {
    // 숫자를 '1.2억', '5000만' 등으로 간략화하는 포맷터
    const formatCurrency = (value: number) => {
        if (value >= 100000000) {
            return `${(value / 100000000).toFixed(1)}억`;
        }
        return `${(value / 10000).toFixed(0)}만`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-bold text-gray-900 mb-1">{label}세 ({payload[0].payload.year}년)</p>
                    <p className="text-sm text-indigo-600 font-semibold">
                        순자산: {Number(payload[0].value).toLocaleString()}원
                    </p>
                    {/* <p className="text-xs text-gray-500">
                        월 배당/이자: {Number(payload[0].payload.passiveIncomeMonthly).toLocaleString()}원
                    </p> */}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-80 bg-white rounded-2xl p-4 border border-gray-50 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="age"
                        tick={{ fontSize: 12, fill: '#9CA3AF' }}
                        tickLine={false}
                        axisLine={false}
                        unit="세"
                    />
                    <YAxis
                        tickFormatter={formatCurrency}
                        tick={{ fontSize: 12, fill: '#9CA3AF' }}
                        tickLine={false}
                        axisLine={false}
                        width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="netWorth"
                        stroke="#4F46E5"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorNetWorth)"
                        animationDuration={1000}
                    />

                    {/* 경제적 자유 도달 시점 표시 */}
                    {financialIndependenceAge && (
                        <ReferenceLine
                            x={financialIndependenceAge}
                            stroke="#10B981"
                            strokeDasharray="3 3"
                            label={{
                                position: 'top',
                                value: '경제적 자유',
                                fill: '#10B981',
                                fontSize: 12,
                                fontWeight: 'bold'
                            }}
                        />
                    )}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LiveChart;

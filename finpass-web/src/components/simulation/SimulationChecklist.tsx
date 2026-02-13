
import React from 'react';
import { Coffee, ShoppingBag, Smartphone, CheckCircle, Circle } from 'lucide-react';

interface SimulationChecklistProps {
    reductions: {
        coffee: boolean;
        delivery: boolean;
        subscription: boolean;
    };
    onToggle: (type: 'coffee' | 'delivery' | 'subscription', amount: number) => void;
}

const SimulationChecklist: React.FC<SimulationChecklistProps> = ({ reductions, onToggle }) => {
    return (
        <div className="bg-gray-50 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-pink-100 rounded-full text-pink-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle></svg>
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">지출 조정 시뮬레이션</h3>
                </div>
                <span className="text-xs text-gray-400">체크하면 은퇴일이 바뀌어요</span>
            </div>

            <div className="space-y-3">
                {/* Coffee */}
                <button
                    onClick={() => onToggle('coffee', 100000)}
                    className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-pink-200 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${reductions.coffee ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'}`}>
                            <Coffee className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-gray-900">매일 커피 한 잔 줄이기</h4>
                            <p className="text-sm text-gray-500">월 10만 원 절약</p>
                        </div>
                    </div>
                    <div>
                        {reductions.coffee ? (
                            <CheckCircle className="w-6 h-6 text-pink-500 fill-pink-50" />
                        ) : (
                            <Circle className="w-6 h-6 text-gray-300 group-hover:text-pink-300" />
                        )}
                    </div>
                </button>

                {/* Delivery */}
                <button
                    onClick={() => onToggle('delivery', 200000)}
                    className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-pink-200 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${reductions.delivery ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'}`}>
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-gray-900">배달 음식 주 2회 줄이기</h4>
                            <p className="text-sm text-gray-500">월 20만 원 절약</p>
                        </div>
                    </div>
                    <div>
                        {reductions.delivery ? (
                            <CheckCircle className="w-6 h-6 text-pink-500 fill-pink-50" />
                        ) : (
                            <Circle className="w-6 h-6 text-gray-300 group-hover:text-pink-300" />
                        )}
                    </div>
                </button>

                {/* Subscription */}
                <button
                    onClick={() => onToggle('subscription', 50000)}
                    className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-pink-200 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${reductions.subscription ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'}`}>
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-gray-900">안 쓰는 구독 해지하기</h4>
                            <p className="text-sm text-gray-500">월 5만 원 절약</p>
                        </div>
                    </div>
                    <div>
                        {reductions.subscription ? (
                            <CheckCircle className="w-6 h-6 text-pink-500 fill-pink-50" />
                        ) : (
                            <Circle className="w-6 h-6 text-gray-300 group-hover:text-pink-300" />
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default SimulationChecklist;
